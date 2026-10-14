import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Activity, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react'
import CarCanvas from './components/CarCanvas'
import InstrumentCluster from './components/InstrumentCluster'
import ControlConsole from './components/ControlConsole'
import EvaluationModal from './components/EvaluationModal'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [features, setFeatures] = useState({
    battery_capacity_kwh: 75.0,
    efficiency_wh_per_km: 155.0,
    top_speed_kmh: 180.0,
    acceleration_0_100_s: 6.5,
    fast_charging_power_kw_dc: 120.0,
    car_body_type: 'SUV',
    drivetrain: 'AWD',
  })

  const [predictedRange, setPredictedRange] = useState(452.4)
  const [loading, setLoading] = useState(false)
  const [apiConnected, setApiConnected] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const debounceTimerRef = useRef(null)

  // Local fallback approximation in case FastAPI is offline
  const computeLocalFallback = (f) => {
    // Formula derived from dataset physics: range ≈ (battery_kwh * 1000 / efficiency) * drag_factor
    const base = (f.battery_capacity_kwh * 1000) / f.efficiency_wh_per_km
    const drivePenalty = f.drivetrain === 'AWD' ? 0.96 : f.drivetrain === 'RWD' ? 0.98 : 1.0
    const speedFactor = 1 - (f.top_speed_kmh - 180) * 0.0008
    return Math.round(base * drivePenalty * speedFactor * 0.94)
  }

  // Fetch ML Prediction from FastAPI backend with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setLoading(true)

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/predict`, features, {
          timeout: 2500,
        })
        if (response.data && response.data.predicted_range_km) {
          setPredictedRange(response.data.predicted_range_km)
          setApiConnected(true)
        }
      } catch (err) {
        // Fall back gracefully to local formula if backend is unreachable
        const fallback = computeLocalFallback(features)
        setPredictedRange(fallback)
        setApiConnected(false)
      } finally {
        setLoading(false)
      }
    }, 120)

    return () => clearTimeout(debounceTimerRef.current)
  }, [features])

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-[0_0_20px_rgba(0,242,254,0.4)]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-bold text-lg text-white tracking-wider">
                  EV INTELLIGENCE
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v2.5 PRO
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Physics-Informed ML (PIML) • 3D Skateboard Architecture
              </p>
            </div>
          </div>

          {/* Backend Status & Benchmark Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300">
                {apiConnected ? 'FastAPI Connected (PIML Core)' : 'Local Telemetry Mode'}
              </span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-400 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,242,254,0.2)] cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>PIML R²: 0.9571</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main High-Tech EV Cockpit Layout */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1 flex flex-col gap-6">
        
        {/* TOP ROW: Digital Instrument Cluster (Hero Display) */}
        <section className="w-full">
          <InstrumentCluster
            predictedRange={predictedRange}
            batteryKwh={features.battery_capacity_kwh}
            efficiencyWhKm={features.efficiency_wh_per_km}
            speedKmh={features.top_speed_kmh}
            drivetrain={features.drivetrain}
          />
        </section>

        {/* BOTTOM ROW: 3D Viewport on Left, Tactile Sliders Console on Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 3D Chassis Viewport (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-2 relative overflow-hidden min-h-[440px] flex flex-col">
            <div className="w-full h-full flex-1">
              <CarCanvas
                batteryKwh={features.battery_capacity_kwh}
                drivetrain={features.drivetrain}
                bodyType={features.car_body_type}
              />
            </div>
          </div>

          {/* Tactile Control Console (5 Cols) */}
          <div className="lg:col-span-5 min-h-[440px]">
            <ControlConsole
              features={features}
              setFeatures={setFeatures}
              loading={loading}
              apiConnected={apiConnected}
              onOpenMetrics={() => setIsModalOpen(true)}
            />
          </div>

        </section>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs font-mono text-slate-500">
        ⚡ <b>EV Range ML Intelligence</b> • Physics-Informed Random Forest ($R^2$: 0.9571, MAE: 15.88 km) • React + Three.js + FastAPI
      </footer>

      {/* Slide-out / Modal ML Benchmark Drawer */}
      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
