import os
import joblib
import pandas as pd
import numpy as np

from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error

# =====================================================================
# 1. Physics-Informed Machine Learning (PIML) Feature Engineering
# =====================================================================
BODY_DRAG_MAP = {
    'SUV': 1.25,
    'Small Passenger Van': 1.28,
    'Station/Estate': 1.10,
    'Hatchback': 1.05,
    'Sedan': 1.00,
    'Liftback Sedan': 0.98,
    'Cabriolet': 1.02,
    'Coupe': 0.92
}

def compute_physics_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes 4 domain-grounded Physics-Informed features:
    1. theoretical_range_max: Thermodynamic upper bound on range (Wh / (Wh/km))
    2. aero_drag_index: Aerodynamic drag scaling with velocity squared * drag coefficient
    3. c_rate_thermal_stress: DC charging C-rate proxy for thermal and battery stress
    4. inverter_intensity: Specific power throughput proxy
    """
    data = df.copy()
    
    # 1. Theoretical Range Maximum (km) - Energy Conservation Ceiling
    data['theoretical_range_max'] = (data['battery_capacity_kwh'] * 1000.0) / data['efficiency_wh_per_km'].replace(0, np.nan)
    
    # 2. Aero Drag Index - Quadratic velocity drag multiplied by aerodynamic body profile
    drag_coeff = data['car_body_type'].map(BODY_DRAG_MAP).fillna(1.05)
    data['aero_drag_index'] = ((data['top_speed_kmh'] / 100.0) ** 2) * drag_coeff
    
    # 3. C-Rate Thermal Stress - Battery fast-charging heat/stress quotient
    data['c_rate_thermal_stress'] = data['fast_charging_power_kw_dc'] / data['battery_capacity_kwh'].replace(0, np.nan)
    
    # 4. Inverter Intensity - Instant power throughput demand
    data['inverter_intensity'] = (1.0 / data['acceleration_0_100_s'].replace(0, np.nan)) * data['battery_capacity_kwh']
    
    return data

class PhysicsFeatureTransformer(BaseEstimator, TransformerMixin):
    """Custom Scikit-Learn Transformer for Physics-Informed EV Feature Extraction."""
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return compute_physics_features(X)

# =====================================================================
# 2. Dataset Ingestion & Pre-Processing
# =====================================================================
csv_path = os.path.join("archive", "electric_vehicles_spec_2025.csv.csv")
if not os.path.exists(csv_path):
    csv_path = "archive/electric_vehicles_spec_2025.csv"

df = pd.read_csv(csv_path)
print(f"Loaded raw dataset shape: {df.shape}")

# Normalize column names to lowercase
df.columns = df.columns.str.strip().str.lower()
target_col = 'range_km'

# Drop rows missing target
df = df.dropna(subset=[target_col]).copy()

# Compute Physics-Informed Features
df = compute_physics_features(df)

# Base numerical + 4 Physics features
raw_num_cols = [
    'battery_capacity_kwh',
    'efficiency_wh_per_km',
    'top_speed_kmh',
    'acceleration_0_100_s',
    'fast_charging_power_kw_dc'
]
physics_cols = [
    'theoretical_range_max',
    'aero_drag_index',
    'c_rate_thermal_stress',
    'inverter_intensity'
]
num_cols = raw_num_cols + physics_cols
cat_cols = ['car_body_type', 'drivetrain']

# Keep only existing columns
num_cols = [c for c in num_cols if c in df.columns]
cat_cols = [c for c in cat_cols if c in df.columns]

print(f"All Numerical Features ({len(num_cols)}): {num_cols}")
print(f"Categorical Features  ({len(cat_cols)}): {cat_cols}")
print(f"Target Column: {target_col}")

X = df[num_cols + cat_cols]
y = df[target_col]

# =====================================================================
# 3. 80-20 Train-Test Split (Zero Data Leakage)
# =====================================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42
)
print(f"Train split: {X_train.shape[0]} rows | Test split: {X_test.shape[0]} rows")

# =====================================================================
# 4. Leakage-Free Preprocessing Pipelines
# =====================================================================
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', num_pipeline, num_cols),
        ('cat', cat_pipeline, cat_cols)
    ]
)

# =====================================================================
# 5. Multi-Model Benchmarking (Ridge vs. Random Forest)
# =====================================================================
models = {
    "Baseline (Ridge Regression)": Ridge(alpha=1.0),
    "Champion (Random Forest)": RandomForestRegressor(
        n_estimators=150, max_depth=10, random_state=42
    )
}

benchmark_metrics = {}
best_pipeline = None
best_r2 = -float("inf")

for name, model in models.items():
    pipe = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', model)
    ])
    
    # Fit strictly on train split
    pipe.fit(X_train, y_train)
    
    # Evaluate strictly on unseen test split
    preds = pipe.predict(X_test)
    
    r2 = r2_score(y_test, preds)
    mae = mean_absolute_error(y_test, preds)
    rmse = root_mean_squared_error(y_test, preds)
    
    benchmark_metrics[name] = {
        "R2 Score": round(float(r2), 4),
        "MAE (km)": round(float(mae), 2),
        "RMSE (km)": round(float(rmse), 2)
    }
    
    if r2 > best_r2:
        best_r2 = r2
        best_pipeline = pipe

# =====================================================================
# 6. Extract Feature Importances from Champion
# =====================================================================
rf = best_pipeline.named_steps['regressor']
cat_encoder = best_pipeline.named_steps['preprocessor'].named_transformers_['cat'].named_steps['encoder']
cat_features_encoded = list(cat_encoder.get_feature_names_out(cat_cols))
all_features = num_cols + cat_features_encoded

importance_df = pd.DataFrame({
    'Feature': all_features,
    'Importance': rf.feature_importances_
}).sort_values('Importance', ascending=False)

# =====================================================================
# 7. Print Benchmark Table for Viva Presentation
# =====================================================================
print("\n" + "=" * 65)
print("     OFFICIAL PHYSICS-INFORMED ML (PIML) TEST BENCHMARK")
print("=" * 65)
print(pd.DataFrame(benchmark_metrics).T)
print("=" * 65)
print("\nTop 6 Influential Features (Thermodynamics & Kinetics Dominant):")
print(importance_df.head(6).to_string(index=False))

# =====================================================================
# 8. Save Upgraded Artifacts for FastAPI & Web App
# =====================================================================
joblib.dump(best_pipeline, "ev_range_pipeline.pkl")
joblib.dump({
    'metrics': benchmark_metrics,
    'importance': importance_df.head(8),
    'num_cols': num_cols,
    'cat_cols': cat_cols,
    'physics_cols': physics_cols
}, "ev_meta.pkl")

print("\nModel pipeline saved as 'ev_range_pipeline.pkl'")
print("Metadata saved as 'ev_meta.pkl'")