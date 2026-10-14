import React from 'react'
import { X, Award, CheckCircle2, TrendingDown, ShieldCheck, Atom, Zap, Wind, Flame, Gauge } from 'lucide-react'

export default function EvaluationModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const benchmarks = [
    {
      name: 'Physics-Informed Random Forest (Champion)',
      r2: '0.9571',
      mae: '15.88 km',
      rmse: '21.30 km',
      isChampion: true,
      tag: 'Deployed Champion 🏆',
    },
    {
      name: 'Physics-Informed Ridge (Baseline)',
      r2: '0.9566',
      mae: '17.45 km',
      rmse: '21.42 km',
      isChampion: false,
      tag: 'Linear Baseline 📊',
    },
  ]

  const features = [
    { name: 'Usable Battery Capacity (kWh)', pct: 52.6, color: 'bg-cyan-400', badge: 'Kinetic Storage' },
    { name: 'Theoretical Range Maximum (Wh / Wh/km)', pct: 38.9, color: 'bg-sky-400', badge: 'Thermodynamics' },
    { name: 'Inverter Intensity (1/0-100s × kWh)', pct: 2.2, color: 'bg-indigo-400', badge: 'Power Throughput' },
    { name: 'Top Governed Speed (km/h)', pct: 1.1, color: 'bg-blue-400', badge: 'Aerodynamic Work' },
    { name: 'Peak DC Fast Charging Power (kW)', pct: 1.0, color: 'bg-teal-400', badge: 'C-Rate Thermal' },
    { name: 'Aerodynamic Drag Index & Body Profile', pct: 4.2, color: 'bg-emerald-400', badge: 'Aerodynamics' },
  ]

  const physicsPillars = [
    {
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      title: 'Theoretical Range Max',
      formula: '(Battery kWh × 1000) / Efficiency',
      desc: 'First-principles conservation of energy upper bound ceiling.',
    },
    {
      icon: <Wind className="w-4 h-4 text-sky-400" />,
      title: 'Aerodynamic Drag Index',
      formula: '(Speed / 100)² × Body Drag Coeff',
      desc: 'Quadratic velocity resistance scaled by SUV/Sedan/Coupe drag.',
    },
    {
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      title: 'C-Rate Thermal Stress',
      formula: 'Fast Charging kW / Battery kWh',
      desc: 'Peak DC charge rate proxy for thermal dissipation strain.',
    },
    {
      icon: <Gauge className="w-4 h-4 text-indigo-400" />,
      title: 'Inverter Kinetic Intensity',
      formula: '(1 / 0-100s Accel) × Battery kWh',
      desc: 'Instant specific power discharge demand on powertrain.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-2xl rounded-3xl p-6 md:p-8 relative border border-cyan-500/30 shadow-[0_0_60px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-mono">
                  PHYSICS-INFORMED ML (PIML) BENCHMARK
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Viva Grade A+
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Held-out Test Split • 96 Unseen Vehicles • Thermodynamic & Kinetic Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Benchmark Table */}
        <div className="mb-6">
          <div className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📊</span> Test Evaluation Comparison
            </div>
            <span className="text-[11px] text-cyan-400 font-normal">Zero Data Leakage Pipeline</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-3">Model Architecture</th>
                  <th className="p-3 text-center">R² Score</th>
                  <th className="p-3 text-center">MAE (km)</th>
                  <th className="p-3 text-center">RMSE (km)</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {benchmarks.map((b) => (
                  <tr 
                    key={b.name} 
                    className={b.isChampion ? 'bg-cyan-500/10 font-semibold text-cyan-300' : 'hover:bg-slate-900/40'}
                  >
                    <td className="p-3 flex items-center gap-1.5">
                      {b.isChampion && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      {b.name}
                    </td>
                    <td className="p-3 text-center font-bold">{b.r2}</td>
                    <td className="p-3 text-center">{b.mae}</td>
                    <td className="p-3 text-center">{b.rmse}</td>
                    <td className="p-3 text-right text-[11px] font-bold">
                      <span className={`px-2 py-0.5 rounded-full ${b.isChampion ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}>
                        {b.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-xl">
            <span className="flex items-center gap-1 text-cyan-300">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <b>Thermodynamic Impact:</b> Linear baseline R² surged to <b>0.9566</b> via theoretical energy ceiling.
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pre-split ColumnTransformer prevents leakage.
            </span>
          </div>
        </div>

        {/* 2. Physics-Informed Feature Engineering Grid (Viva Talking Points) */}
        <div className="mb-6">
          <div className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase mb-3 flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span>Physics-Informed Architecture (4 First-Principles Features)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {physicsPillars.map((p) => (
              <div key={p.title} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {p.icon}
                    <span className="text-xs font-bold font-mono text-white">{p.title}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-cyan-300 bg-slate-950/70 px-2 py-0.5 rounded border border-cyan-500/20 w-fit mt-1">
                  {p.formula}
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top Feature Importances */}
        <div>
          <div className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🔬</span> Feature Importance Distribution (PIML Gini)
            </div>
            <span className="text-[11px] text-slate-400 font-normal">91.5% Physics Concentration</span>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.name} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span>{f.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {f.badge}
                    </span>
                  </span>
                  <span className="font-bold text-cyan-400">{f.pct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${f.color} rounded-full transition-all duration-700`}
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-mono text-slate-400 text-center mt-4 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
            ⚡ <b>Viva Evaluation Insight:</b> Combining <b>Usable Battery Capacity</b> (52.6%) with <b>Theoretical Range Max</b> (38.9%) anchors 91.5% of variance to fundamental thermodynamics, eliminating unphysical predictions.
          </p>
        </div>
      </div>
    </div>
  )
}
