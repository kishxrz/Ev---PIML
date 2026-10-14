# ⚡ Electric Vehicle (EV) Range Prediction Engine & 3D Cockpit

Production-grade Machine Learning system and standalone interactive React + Three.js + Tailwind CSS digital automotive cockpit designed to predict the real-world electric driving range (WLTP/EPA km) of modern Electric Vehicles.

---

## 🚀 Key Highlights & Evaluation Results

Benchmarked strictly on an 80/20 train-test split (96 unseen test vehicles) with zero data leakage:

| Model Architecture | R² Score | MAE (km) | RMSE (km) | Performance Status |
| :--- | :---: | :---: | :---: | :--- |
| **Random Forest Regressor (Champion)** | **0.9620** | **14.91 km** | **20.04 km** | **Deployed Champion 🏆** |
| Ridge Regression (Baseline) | 0.9369 | 21.01 km | 25.83 km | Linear Baseline 📊 |

- **Error Reduction**: Random Forest cuts Mean Absolute Error by **29.0%** over the linear baseline.
- **Top Feature Drivers**:
  1. `battery_capacity_kwh`: 79.4%
  2. `efficiency_wh_per_km`: 5.0%
  3. `top_speed_kmh`: 4.3%
  4. `fast_charging_power_kw_dc`: 2.7%
  5. `car_body_type`: 2.4%

---

## 🛠️ Project Architecture

```
ev-ml-pro/
├── api.py                     # FastAPI REST API with CORS and Pydantic validation
├── train_model.py             # Preprocessing & Machine Learning Training pipeline
├── ev_range_pipeline.pkl      # Serialized Scikit-Learn Pipeline (ColumnTransformer + RF)
├── ev_meta.pkl                # Benchmark metrics and feature importances
├── requirements.txt           # Pinned production dependencies
├── Procfile                   # Cloud container deployment configuration
├── app.py                     # Streamlit Interactive Dashboard (Alternative Frontend)
│
└── frontend/                  # React + Three.js + Tailwind CSS Web App (Vercel Ready)
    ├── vercel.json            # Vercel SPA deployment configuration
    ├── vite.config.js         # Vite configuration with Tailwind CSS v4
    ├── package.json           # Dependencies: three, @react-three/fiber, lucide-react
    ├── src/
    │   ├── App.jsx            # Main Cockpit Controller & API debouncing
    │   ├── index.css          # Tailwind CSS tokens, glassmorphism & glow effects
    │   └── components/
    │       ├── CarCanvas.jsx         # 3D Viewport: Rotatable EV Chassis + Glowing Cells
    │       ├── InstrumentCluster.jsx # Dual-Screen Cockpit with twin SVG arcs
    │       ├── ControlConsole.jsx    # Tesla-style Tactile Sliders & Presets
    │       └── EvaluationModal.jsx   # Slide-out ML Benchmark & Feature Importances
    └── index.html             # High-tech automotive typography & metadata
```

---

## 🏎️ Running the React + Three.js Cockpit Locally

### 1. Launch FastAPI Backend:
```bash
uvicorn api:app --port 8000
```
Runs at `http://localhost:8000`.

### 2. Launch Vite React Frontend:
```bash
cd frontend
npm install
npm run dev
```
Preview in browser at:
👉 **`http://localhost:5173`**

---

## 🌐 Deploying Frontend Directly to Vercel

The `frontend/` directory includes [`vercel.json`](file:///c:/Users/Kishore/Desktop/ev-ml-pro/frontend/vercel.json) pre-configured with SPA route rewrites:

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), select **Add New Project** → import this repository.
3. Configure the **Root Directory** setting to `frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**!

---

## 🔌 API Endpoints (`api.py`)

- `POST /predict`: Predicts electric range for any vehicle configuration.
- `GET /metrics`: Returns official benchmark metrics and top 5 feature importances.
- `GET /health`: Healthcheck endpoint for cloud monitoring.
- `GET /docs`: Interactive Swagger UI documentation at `http://localhost:8000/docs`.
