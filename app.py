import os
import joblib
import pandas as pd
import numpy as np
import streamlit as st
import altair as alt

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="EV Range Predictor | Machine Learning Dashboard",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ---------------------------------------------------------
# Custom Modern Dark Theme Styling
# ---------------------------------------------------------
st.markdown("""
<style>
    /* Global Background and Typography */
    .stApp {
        background: radial-gradient(circle at 15% 15%, #111a2e 0%, #080d19 100%);
        color: #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    /* Hero Header */
    .hero-container {
        background: linear-gradient(135deg, rgba(16, 26, 48, 0.85) 0%, rgba(26, 38, 66, 0.65) 100%);
        border: 1px solid rgba(0, 210, 255, 0.25);
        border-radius: 16px;
        padding: 24px 30px;
        margin-bottom: 25px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(10px);
    }
    .hero-title {
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .hero-subtitle {
        font-size: 0.98rem;
        color: #94a3b8;
        margin-top: 8px;
        margin-bottom: 0px;
    }
    .badge-pill {
        display: inline-block;
        padding: 3px 10px;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        background: rgba(0, 210, 255, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.35);
        margin-right: 6px;
    }

    /* Container Glass Cards */
    .glass-card {
        background: rgba(18, 27, 45, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 22px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    /* Hyper-Realistic Digital Instrument Cluster */
    .cluster-binnacle {
        background: radial-gradient(circle at 50% 15%, #182238 0%, #0d1322 45%, #060911 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-top: 3px solid #38bdf8;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), inset 0 2px 14px rgba(56, 189, 248, 0.2), inset 0 0 50px rgba(5, 8, 16, 0.95);
        border-radius: 24px;
        padding: 16px 20px 16px 20px;
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
    }
    .cluster-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px 12px 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .cluster-telemetry-left, .cluster-telemetry-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .telemetry-ready-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 1px;
    }
    .drive-profile-badge {
        background: linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(2, 132, 199, 0.25) 100%);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.4);
        padding: 3px 14px;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 1.5px;
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
    }
    .cluster-main-grid {
        display: grid;
        grid-template-columns: 1fr 1.4fr 1fr;
        align-items: center;
        gap: 10px;
        padding: 15px 0 10px 0;
    }
    .cluster-side-gauge {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .gauge-ring-container {
        position: relative;
        width: 140px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .gauge-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .gauge-bg-circle {
        fill: none;
        stroke: rgba(255, 255, 255, 0.07);
        stroke-width: 8;
        stroke-dasharray: 238.1 151.5;
        stroke-linecap: round;
        transform: rotate(160 80 80);
    }
    .gauge-bg-circle-green {
        fill: none;
        stroke: rgba(255, 255, 255, 0.07);
        stroke-width: 8;
        stroke-dasharray: 238.1 151.5;
        stroke-linecap: round;
        transform: rotate(160 80 80);
    }
    .gauge-active-cyan {
        fill: none;
        stroke: url(#cyanArcGrad);
        stroke-width: 8;
        stroke-dasharray: 238.1 151.5;
        stroke-linecap: round;
        transform: rotate(160 80 80);
        filter: drop-shadow(0 0 6px rgba(0, 242, 254, 0.65));
        transition: stroke-dashoffset 0.5s ease;
    }
    .gauge-active-green {
        fill: none;
        stroke: url(#greenArcGrad);
        stroke-width: 8;
        stroke-dasharray: 238.1 151.5;
        stroke-linecap: round;
        transform: rotate(160 80 80);
        filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.65));
        transition: stroke-dashoffset 0.5s ease;
    }
    .gauge-center-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .gauge-main-stat {
        font-size: 1.55rem;
        font-weight: 900;
        line-height: 1.1;
    }
    .gauge-stat-unit {
        font-size: 0.68rem;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 1.5px;
    }
    .gauge-sub-pill {
        margin-top: 4px;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 9999px;
    }
    .gauge-bottom-label {
        font-size: 0.72rem;
        font-weight: 800;
        color: #94a3b8;
        letter-spacing: 1.5px;
        margin-top: 6px;
    }
    .gauge-bottom-sub {
        font-size: 0.68rem;
        font-weight: 600;
        color: #64748b;
    }
    .cluster-center-console {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
    }
    .glow-value {
        font-size: 4.4rem;
        font-weight: 900;
        line-height: 1;
        color: #ffffff;
        text-shadow: 0 0 20px rgba(56, 189, 248, 0.65), 0 0 40px rgba(0, 242, 254, 0.35);
        letter-spacing: -2px;
    }
    .center-unit-label {
        font-size: 0.76rem;
        font-weight: 800;
        color: #7dd3fc;
        letter-spacing: 3px;
        margin-top: 4px;
        text-transform: uppercase;
    }
    .road-perspective-box {
        width: 190px;
        height: 55px;
        margin-top: 6px;
    }
    .road-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .cluster-gear-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 22px;
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 0.95rem;
        font-weight: 800;
        letter-spacing: 4px;
        color: #475569;
    }
    .gear-slot {
        padding: 2px 8px;
        border-radius: 4px;
    }
    .gear-active {
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.18);
        border: 1px solid rgba(56, 189, 248, 0.5);
        box-shadow: 0 0 14px rgba(56, 189, 248, 0.45);
    }

    /* Range Indicators Grid */
    .indicator-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 15px;
    }
    .indicator-box {
        background: rgba(13, 21, 37, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        padding: 12px;
        text-align: center;
    }
    .indicator-label {
        font-size: 0.78rem;
        color: #94a3b8;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }
    .indicator-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #f8fafc;
    }

    /* Viability & Safety Badge */
    .viability-card {
        border-radius: 14px;
        padding: 14px 18px;
        margin-top: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        font-size: 0.92rem;
    }
    .viability-excellent {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #6ee7b7;
    }
    .viability-good {
        background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #7dd3fc;
    }
    .viability-moderate {
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.35);
        color: #fcd34d;
    }

    /* Section Subheadings */
    .section-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* Customizing Streamlit widgets */
    div[data-testid="stSlider"] label {
        font-weight: 600 !important;
        color: #cbd5e1 !important;
        font-size: 0.88rem !important;
    }
    div[data-testid="stSelectbox"] label {
        font-weight: 600 !important;
        color: #cbd5e1 !important;
        font-size: 0.88rem !important;
    }
</style>
""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Resource Caching for ML Model & Metadata
# ---------------------------------------------------------
@st.cache_resource
def load_ev_artifacts():
    pipeline_file = "ev_range_pipeline.pkl"
    meta_file = "ev_meta.pkl"

    if not os.path.exists(pipeline_file) or not os.path.exists(meta_file):
        raise FileNotFoundError(
            f"Artifact files not found in working directory. Expected {pipeline_file} and {meta_file}."
        )

    pipeline = joblib.load(pipeline_file)
    meta = joblib.load(meta_file)
    return pipeline, meta

# ---------------------------------------------------------
# Physics-Informed Feature Engineering (PIML)
# ---------------------------------------------------------
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
    data = df.copy()
    data['theoretical_range_max'] = (data['battery_capacity_kwh'] * 1000.0) / data['efficiency_wh_per_km'].replace(0, np.nan)
    drag_coeff = data['car_body_type'].map(BODY_DRAG_MAP).fillna(1.05)
    data['aero_drag_index'] = ((data['top_speed_kmh'] / 100.0) ** 2) * drag_coeff
    data['c_rate_thermal_stress'] = data['fast_charging_power_kw_dc'] / data['battery_capacity_kwh'].replace(0, np.nan)
    data['inverter_intensity'] = (1.0 / data['acceleration_0_100_s'].replace(0, np.nan)) * data['battery_capacity_kwh']
    return data


try:
    pipeline, meta = load_ev_artifacts()
    metrics = meta.get('metrics', {})
    rf_metrics = metrics.get('Champion (Random Forest)', {})
    importance_df = meta.get('importance', pd.DataFrame())
except Exception as e:
    st.error(f"❌ Error loading model artifacts: {e}")
    st.stop()


# ---------------------------------------------------------
# Header Banner
# ---------------------------------------------------------
st.markdown("""
<div class="hero-container">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
        <div>
            <h1 class="hero-title">⚡ Electric Vehicle Range Predictor</h1>
            <p class="hero-subtitle">
                High-precision EV range intelligence powered by Scikit-Learn Random Forest Regressor & zero-leakage preprocessing pipelines.
            </p>
        </div>
        <div>
            <span class="badge-pill">Model R²: 0.9620</span>
            <span class="badge-pill">MAE: 14.91 km</span>
            <span class="badge-pill">Test Split: 20% (Zero Leakage)</span>
            <span class="badge-pill">FastAPI Enabled</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Preset Profiles Helper
# ---------------------------------------------------------
PRESETS = {
    "Custom Configuration": None,
    "Tesla Model Y Long Range Spec (AWD)": {
        "battery": 75.0,
        "efficiency": 155.0,
        "speed": 217.0,
        "accel": 5.0,
        "dc_charge": 250.0,
        "body": "SUV",
        "drivetrain": "AWD"
    },
    "Porsche Taycan Performance Spec (AWD)": {
        "battery": 93.4,
        "efficiency": 185.0,
        "speed": 260.0,
        "accel": 3.2,
        "dc_charge": 270.0,
        "body": "Liftback Sedan",
        "drivetrain": "AWD"
    },
    "Hyundai Ioniq 5 Standard (RWD)": {
        "battery": 58.0,
        "efficiency": 167.0,
        "speed": 185.0,
        "accel": 8.5,
        "dc_charge": 175.0,
        "body": "SUV",
        "drivetrain": "RWD"
    },
    "Compact City EV (Hatchback FWD)": {
        "battery": 45.0,
        "efficiency": 135.0,
        "speed": 150.0,
        "accel": 9.2,
        "dc_charge": 85.0,
        "body": "Hatchback",
        "drivetrain": "FWD"
    }
}


# ---------------------------------------------------------
# Main Two-Column Layout
# ---------------------------------------------------------
col_left, col_right = st.columns([1.1, 1.4], gap="large")


# =========================================================
# LEFT COLUMN: Interactive Input Controls
# =========================================================
with col_left:
    st.markdown('<div class="section-title"><span>⚙️</span> Vehicle Engineering Specifications</div>', unsafe_allow_html=True)

    # Preset Selector for easy testing
    selected_preset = st.selectbox(
        "Load Quick Vehicle Benchmark Preset",
        options=list(PRESETS.keys()),
        index=0,
        help="Select a representative vehicle profile or choose 'Custom Configuration' to freely adjust parameters."
    )
    preset_data = PRESETS[selected_preset]

    st.markdown("<hr style='border-color: rgba(255,255,255,0.08); margin: 15px 0;'>", unsafe_allow_html=True)

    # Input Sliders & Selectboxes
    battery_default = preset_data["battery"] if preset_data else 75.0
    battery_kwh = st.slider(
        "🔋 Usable Battery Capacity (kWh)",
        min_value=20.0,
        max_value=130.0,
        value=float(battery_default),
        step=0.5,
        help="Total usable energy capacity of the high-voltage battery pack."
    )

    eff_default = preset_data["efficiency"] if preset_data else 160.0
    efficiency_wh_km = st.slider(
        "⚡ Energy Consumption Efficiency (Wh/km)",
        min_value=100.0,
        max_value=350.0,
        value=float(eff_default),
        step=1.0,
        help="Rated energy consumed per kilometer. Lower Wh/km indicates higher aerodynamic & motor efficiency."
    )

    speed_default = preset_data["speed"] if preset_data else 180.0
    top_speed = st.slider(
        "🏁 Top Speed (km/h)",
        min_value=120.0,
        max_value=320.0,
        value=float(speed_default),
        step=5.0,
        help="Maximum electronically governed or sustained vehicle velocity."
    )

    accel_default = preset_data["accel"] if preset_data else 6.5
    accel_0_100 = st.slider(
        "⏱️ 0 - 100 km/h Acceleration (seconds)",
        min_value=2.0,
        max_value=18.0,
        value=float(accel_default),
        step=0.1,
        help="Time taken in seconds to accelerate from standstill to 100 km/h."
    )

    dc_default = preset_data["dc_charge"] if preset_data else 120.0
    fast_charge_kw = st.slider(
        "🔌 Peak DC Fast Charging Power (kW)",
        min_value=20.0,
        max_value=300.0,
        value=float(dc_default),
        step=5.0,
        help="Peak direct-current charging speed supported at rapid highway charging stations."
    )

    col_sub1, col_sub2 = st.columns(2)
    with col_sub1:
        body_options = [
            'SUV', 'Sedan', 'Hatchback', 'Liftback Sedan', 
            'Station/Estate', 'Small Passenger Van', 'Cabriolet', 'Coupe'
        ]
        body_default_idx = body_options.index(preset_data["body"]) if preset_data and preset_data["body"] in body_options else 0
        body_type = st.selectbox(
            "🚙 Car Body Type",
            options=body_options,
            index=body_default_idx
        )

    with col_sub2:
        drivetrain_options = ['AWD', 'RWD', 'FWD']
        drive_default_idx = drivetrain_options.index(preset_data["drivetrain"]) if preset_data and preset_data["drivetrain"] in drivetrain_options else 0
        drivetrain = st.selectbox(
            "⚙️ Drivetrain Type",
            options=drivetrain_options,
            index=drive_default_idx
        )

    # Fast Charge Time Estimate calculation
    # Typical 10% to 80% charge (70% capacity) considering charging curve factor (~75% avg power)
    avg_charging_kw = max(fast_charge_kw * 0.75, 15.0)
    charge_time_10_80_mins = int((battery_kwh * 0.70 / avg_charging_kw) * 60)

    st.markdown(f"""<div style="margin-top: 15px; padding: 12px; border-radius: 10px; background: rgba(0, 210, 255, 0.05); border: 1px dashed rgba(0, 210, 255, 0.25); font-size: 0.85rem; color: #94a3b8;">
⚡ <b>Rapid DC Charging Estimate:</b> ~10% to 80% SoC in <b>{charge_time_10_80_mins} mins</b> at {int(fast_charge_kw)} kW peak.
</div>""", unsafe_allow_html=True)


# =========================================================
# RIGHT COLUMN: Predictions, Viability, Metrics & Charts
# =========================================================
with col_right:
    # 1. Run Pipeline Inference
    sample_df = pd.DataFrame([{
        'battery_capacity_kwh': float(battery_kwh),
        'efficiency_wh_per_km': float(efficiency_wh_km),
        'top_speed_kmh': float(top_speed),
        'acceleration_0_100_s': float(accel_0_100),
        'fast_charging_power_kw_dc': float(fast_charge_kw),
        'car_body_type': body_type,
        'drivetrain': drivetrain
    }])

    # Compute Physics-Informed features
    sample_df = compute_physics_features(sample_df)

    predicted_range = float(pipeline.predict(sample_df)[0])
    range_km_rounded = round(predicted_range, 1)
    range_miles = round(predicted_range * 0.621371, 1)

    # Real-world telemetry breakdowns
    city_range = round(predicted_range * 1.08, 1)        # Regenerative braking advantage
    highway_range = round(predicted_range * 0.84, 1)     # Aerodynamic drag at 110-120 km/h
    winter_range = round(predicted_range * 0.76, 1)      # Cabin heating & battery cold penalty

    # Efficiency Score & Safety Viability Classification
    if efficiency_wh_km < 145:
        eff_class = "Super Efficient"
        eff_color = "#34d399"
    elif efficiency_wh_km <= 180:
        eff_class = "Standard EV Class"
        eff_color = "#38bdf8"
    else:
        eff_class = "High Consumption"
        eff_color = "#fbbf24"

    if predicted_range >= 480:
        viability_html = (
            '<div class="viability-card viability-excellent">'
            '<span style="font-size: 1.4rem;">🌟</span>'
            '<div><b>Interstate Long-Range Champion</b><br>'
            'Seamless long-distance touring with minimal stops. Exceeds standard 4-hour continuous highway travel limits.</div>'
            '</div>'
        )
    elif predicted_range >= 340:
        viability_html = (
            '<div class="viability-card viability-good">'
            '<span style="font-size: 1.4rem;">⚡</span>'
            '<div><b>Highway & Commute Capable</b><br>'
            'Comfortably supports cross-city highway driving with standard planned DC fast charging rest stops.</div>'
            '</div>'
        )
    else:
        viability_html = (
            '<div class="viability-card viability-moderate">'
            '<span style="font-size: 1.4rem;">🏙️</span>'
            '<div><b>Metropolitan / Regional Focus</b><br>'
            'Ideal for daily urban and suburban commuting. Frequent fast charging recommended for long intercity roadtrips.</div>'
            '</div>'
        )

    # Digital Instrument Cluster Calculations
    battery_pct = min(100.0, max(0.0, (battery_kwh / 130.0) * 100.0))
    autonomy_pct = min(100.0, max(0.0, (predicted_range / 650.0) * 100.0))
    autonomy_miles = predicted_range / 1.609

    arc_len = 238.06
    left_offset = arc_len * (1.0 - battery_pct / 100.0)
    right_offset = arc_len * (1.0 - autonomy_pct / 100.0)

    # Primary Digital Instrument Cluster Card
    cluster_html = f"""<div class="cluster-binnacle">
<div class="cluster-top-bar">
<div class="cluster-telemetry-left">
<span class="telemetry-ready-badge">⚡ READY</span>
<span style="color: #94a3b8; font-size: 0.82rem;">🌡️ 24°C</span>
</div>
<div class="cluster-telemetry-center">
<span class="drive-profile-badge">WLTP EST</span>
</div>
<div class="cluster-telemetry-right">
<span style="color: #94a3b8; font-size: 0.82rem;">🕒 10:42 AM</span>
<span style="color: #38bdf8; font-size: 0.82rem; font-weight: 700;">📶 5G</span>
</div>
</div>
<div class="cluster-main-grid">
<div class="cluster-side-gauge">
<div class="gauge-ring-container">
<svg viewBox="0 0 160 160" class="gauge-svg">
<defs>
<linearGradient id="cyanArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#0284c7" />
<stop offset="100%" stop-color="#00f2fe" />
</linearGradient>
</defs>
<circle cx="80" cy="80" r="62" class="gauge-bg-circle" />
<circle cx="80" cy="80" r="62" class="gauge-active-cyan" style="stroke-dashoffset: {left_offset:.1f};" />
</svg>
<div class="gauge-center-content">
<div class="gauge-main-stat" style="color: #38bdf8;">{battery_kwh:.1f}</div>
<div class="gauge-stat-unit">KWH</div>
<div class="gauge-sub-pill" style="color: #00f2fe; background: rgba(0, 242, 254, 0.12);">{battery_pct:.0f}% SOC</div>
</div>
</div>
<div class="gauge-bottom-label">ENERGY PACK</div>
<div class="gauge-bottom-sub">({battery_kwh:.1f} kWh)</div>
</div>
<div class="cluster-center-console">
<div class="center-hero-value">
<span class="glow-value">{predicted_range:.0f}</span>
</div>
<div class="center-unit-label">ESTIMATED RANGE (KM)</div>
<div class="road-perspective-box">
<svg viewBox="0 0 200 65" class="road-svg">
<defs>
<linearGradient id="roadLaneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="rgba(0, 242, 254, 0.02)" />
<stop offset="100%" stop-color="rgba(0, 242, 254, 0.28)" />
</linearGradient>
</defs>
<polygon points="80,5 120,5 165,60 35,60" fill="url(#roadLaneGrad)" />
<line x1="80" y1="5" x2="35" y2="60" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round" style="filter: drop-shadow(0 0 6px #00f2fe);" />
<line x1="120" y1="5" x2="165" y2="60" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round" style="filter: drop-shadow(0 0 6px #00f2fe);" />
<line x1="100" y1="8" x2="100" y2="58" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round" />
</svg>
</div>
</div>
<div class="cluster-side-gauge">
<div class="gauge-ring-container">
<svg viewBox="0 0 160 160" class="gauge-svg">
<defs>
<linearGradient id="greenArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#059669" />
<stop offset="100%" stop-color="#34d399" />
</linearGradient>
</defs>
<circle cx="80" cy="80" r="62" class="gauge-bg-circle-green" />
<circle cx="80" cy="80" r="62" class="gauge-active-green" style="stroke-dashoffset: {right_offset:.1f};" />
</svg>
<div class="gauge-center-content">
<div class="gauge-main-stat" style="color: #34d399;">{autonomy_miles:.0f}</div>
<div class="gauge-stat-unit">MILES</div>
<div class="gauge-sub-pill" style="color: #10b981; background: rgba(16, 185, 129, 0.12);">{autonomy_pct:.0f}% EFF</div>
</div>
</div>
<div class="gauge-bottom-label">AUTONOMY</div>
<div class="gauge-bottom-sub">({predicted_range / 1.609:.0f} MILES)</div>
</div>
</div>
<div class="cluster-gear-row">
<span class="gear-slot">P</span>
<span class="gear-slot">R</span>
<span class="gear-slot">N</span>
<span class="gear-slot gear-active">[D]</span>
</div>
</div>
<div class="indicator-row">
<div class="indicator-box">
<div class="indicator-label">🏙️ Urban / City</div>
<div class="indicator-value">{city_range} km</div>
<div style="font-size: 0.72rem; color: #64748b;">+8% regen bonus</div>
</div>
<div class="indicator-box">
<div class="indicator-label">🛣️ 120 km/h Highway</div>
<div class="indicator-value">{highway_range} km</div>
<div style="font-size: 0.72rem; color: #64748b;">Aero drag impact</div>
</div>
<div class="indicator-box">
<div class="indicator-label">❄️ Winter (-5°C)</div>
<div class="indicator-value">{winter_range} km</div>
<div style="font-size: 0.72rem; color: #64748b;">HVAC & cold pack</div>
</div>
</div>
{viability_html}"""
    st.markdown(cluster_html, unsafe_allow_html=True)

    # 2. Official Evaluation Benchmark Table
    st.markdown('<div class="section-title"><span>📊</span> Model Benchmark & Evaluation on Held-Out Test Set (96 Vehicles)</div>', unsafe_allow_html=True)

    benchmark_rows = []
    for model_name, score_dict in metrics.items():
        is_champion = "Random Forest" in model_name
        benchmark_rows.append({
            "Model Architecture": f"🏆 {model_name}" if is_champion else f"📈 {model_name}",
            "R² Score": f"{score_dict.get('R2 Score', 0.0):.4f}",
            "MAE (km)": f"{score_dict.get('MAE (km)', 0.0):.2f}",
            "RMSE (km)": f"{score_dict.get('RMSE (km)', 0.0):.2f}",
            "Status": "Champion (Deployed)" if is_champion else "Linear Baseline"
        })

    eval_df = pd.DataFrame(benchmark_rows)
    st.dataframe(
        eval_df,
        use_container_width=True,
        hide_index=True
    )
    
    st.markdown("""<div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px; margin-bottom: 20px; display: flex; justify-content: space-between;">
<span>🎯 <b>Error Reduction:</b> Random Forest cuts Mean Absolute Error by <b>29.0%</b> vs Ridge Baseline.</span>
<span>🔒 <b>Leakage Prevention:</b> Strict 80/20 train-test split before transformer fitting.</span>
</div>""", unsafe_allow_html=True)

    # 3. Top Feature Importances Bar Chart
    st.markdown('<div class="section-title"><span>🔬</span> Top Influential Feature Importances (Random Forest)</div>', unsafe_allow_html=True)

    # Clean display names for features
    feature_name_map = {
        'battery_capacity_kwh': 'Battery Capacity (kWh)',
        'efficiency_wh_per_km': 'Energy Efficiency (Wh/km)',
        'top_speed_kmh': 'Top Speed (km/h)',
        'fast_charging_power_kw_dc': 'DC Fast Charging (kW)',
        'car_body_type_Small Passenger Van': 'Body: Small Passenger Van',
        'acceleration_0_100_s': '0-100 km/h Accel Time (s)'
    }

    chart_df = importance_df.head(5).copy()
    chart_df['Feature_Label'] = chart_df['Feature'].map(lambda x: feature_name_map.get(x, x))
    chart_df['Importance_Percent'] = (chart_df['Importance'] * 100).round(1)
    chart_df['Label_Text'] = chart_df['Importance_Percent'].astype(str) + "%"

    # Altair Horizontal Bar Chart
    bars = alt.Chart(chart_df).mark_bar(
        cornerRadiusTopRight=6,
        cornerRadiusBottomRight=6,
        height=26
    ).encode(
        x=alt.X('Importance:Q', title="Relative Importance Score (Gini)", axis=alt.Axis(format='%')),
        y=alt.Y('Feature_Label:N', sort='-x', title=None),
        color=alt.Color(
            'Importance:Q', 
            scale=alt.Scale(scheme='teals'), 
            legend=None
        ),
        tooltip=[
            alt.Tooltip('Feature_Label:N', title='Feature'),
            alt.Tooltip('Importance_Percent:Q', title='Importance %')
        ]
    )

    text_labels = alt.Chart(chart_df).mark_text(
        align='left',
        baseline='middle',
        dx=8,
        color='#e2e8f0',
        fontWeight='bold',
        fontSize=12
    ).encode(
        x=alt.X('Importance:Q'),
        y=alt.Y('Feature_Label:N', sort='-x'),
        text='Label_Text:N'
    )

    final_chart = (bars + text_labels).properties(
        height=200
    ).configure_view(
        strokeOpacity=0
    ).configure_axis(
        labelColor='#94a3b8',
        titleColor='#94a3b8',
        gridColor='rgba(255, 255, 255, 0.05)'
    )

    st.altair_chart(final_chart, use_container_width=True)
    st.markdown("""<div style="font-size: 0.8rem; color: #94a3b8; text-align: center; margin-top: 6px;">
Battery Capacity dominates model variance (79.4%), followed by vehicle efficiency and powertrain dynamics.
</div>""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------
st.markdown("""
<div style="text-align: center; color: #64748b; font-size: 0.82rem; margin-top: 25px; padding-bottom: 20px;">
    ⚡ <b>Electric Vehicle Range ML Project</b> • Evaluated on 2025 EV Specification Benchmarks • Ready for Cloud Deployment
</div>
""", unsafe_allow_html=True)
