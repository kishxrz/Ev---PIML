import React from 'react'
import { Sliders, BatteryCharging, Zap, Gauge, Timer, Layers, Compass } from 'lucide-react'

const BODY_OPTIONS = [
  'SUV', 'Sedan', 'Hatchback', 'Liftback Sedan', 
  'Station/Estate', 'Small Passenger Van', 'Cabriolet', 'Coupe'
]

const DRIVETRAIN_OPTIONS = ['AWD', 'RWD', 'FWD']

const PRESETS = [
  {
    name: 'Tesla Model Y LR',
    spec: { battery: 75.0, efficiency: 155, speed: 217, accel: 5.0, dc: 250, body: 'SUV', drive: 'AWD' }
  },
  {
    name: 'Porsche Taycan GT',
    spec: { battery: 93.4, efficiency: 185, speed: 260, accel: 3.2, dc: 270, body: 'Liftback Sedan', drive: 'AWD' }
  },
  {
    name: 'Hyundai Ioniq 5',
    spec: { battery: 58.0, efficiency: 167, speed: 185, accel: 8.5, dc: 175, body: 'SUV', drive: 'RWD' }
  },
  {
    name: 'Urban City EV',
    spec: { battery: 45.0, efficiency: 135, speed: 150, accel: 9.2, dc: 85, body: 'Hatchback', drive: 'FWD' }
  }
]

export default function ControlConsole({
  features,
  setFeatures,
  loading = false,
  apiConnected = true,
  onOpenMetrics,
}) {
  const updateFeature = (key, value) => {
    setFeatures((prev) => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset) => {
    setFeatures({
      battery_capacity_kwh: preset.spec.battery,
      efficiency_wh_per_km: preset.spec.efficiency,
      top_speed_kmh: preset.spec.speed,
      acceleration_0_100_s: preset.spec.accel,
      fast_charging_power_kw_dc: preset.spec.dc,
      car_body_type: preset.spec.body,
      drivetrain: preset.spec.drive,
    })
  }

  // Estimated 10% to 80% charge time in minutes
  const avgChargingKw = Math.max(features.fast_charging_power_kw_dc * 0.75, 15)
  const chargeTime10to80 = Math.round((features.battery_capacity_kwh * 0.70 / avgChargingKw) * 60)

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 flex flex-col gap-5 h-full">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide flex items-center gap-2">
              VEHICLE CONTROLS
              {loading && (
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Tactile engineering parameters</p>
          </div>
        </div>

        <button
          onClick={onOpenMetrics}
          className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-mono font-semibold text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,189,248,0.15)] cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          ML Benchmark
        </button>
      </div>

      {/* Quick Benchmark Presets */}
      <div>
        <div className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
          ⚡ Representative EV Profiles
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-cyan-950/40 text-xs font-mono text-slate-300 hover:text-cyan-300 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-left truncate cursor-pointer"
            >
              🏎️ {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {/* Battery Capacity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
              Usable Battery Capacity
            </span>
            <span className="font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
              {features.battery_capacity_kwh.toFixed(1)} kWh
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="130"
            step="0.5"
            value={features.battery_capacity_kwh}
            onChange={(e) => updateFeature('battery_capacity_kwh', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Energy Consumption Efficiency */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Consumption Efficiency
            </span>
            <span className="font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
              {features.efficiency_wh_per_km} Wh/km
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="350"
            step="1"
            value={features.efficiency_wh_per_km}
            onChange={(e) => updateFeature('efficiency_wh_per_km', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Top Speed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              Top Governed Speed
            </span>
            <span className="font-bold text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-500/30">
              {features.top_speed_kmh} km/h
            </span>
          </div>
          <input
            type="range"
            min="120"
            max="320"
            step="5"
            value={features.top_speed_kmh}
            onChange={(e) => updateFeature('top_speed_kmh', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* 0-100 Acceleration */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Timer className="w-3.5 h-3.5 text-purple-400" />
              0 - 100 km/h Acceleration
            </span>
            <span className="font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
              {features.acceleration_0_100_s.toFixed(1)} s
            </span>
          </div>
          <input
            type="range"
            min="2.0"
            max="18.0"
            step="0.1"
            value={features.acceleration_0_100_s}
            onChange={(e) => updateFeature('acceleration_0_100_s', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* Peak DC Fast Charging Power */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Peak DC Fast Charge Power
            </span>
            <span className="font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              {features.fast_charging_power_kw_dc} kW
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="5"
            value={features.fast_charging_power_kw_dc}
            onChange={(e) => updateFeature('fast_charging_power_kw_dc', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Car Body Type & Drivetrain Selectors */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1 font-semibold">
              🚙 Body Type
            </label>
            <select
              value={features.car_body_type}
              onChange={(e) => updateFeature('car_body_type', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {BODY_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1 font-semibold flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Drivetrain
            </label>
            <select
              value={features.drivetrain}
              onChange={(e) => updateFeature('drivetrain', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {DRIVETRAIN_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charging Duration Estimation Pill */}
      <div className="mt-auto pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          10% → 80% Rapid SoC:
        </span>
        <span className="font-bold text-emerald-400">
          ~{chargeTime10to80} mins ({features.fast_charging_power_kw_dc} kW)
        </span>
      </div>
    </div>
  )
}
