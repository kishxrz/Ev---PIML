import React, { useMemo } from 'react'

export default function InstrumentCluster({
  predictedRange = 450,
  batteryKwh = 75,
  efficiencyWhKm = 160,
  speedKmh = 180,
  drivetrain = 'AWD',
}) {
  // Battery and autonomy percentages
  const batteryPct = Math.min(100, Math.max(0, (batteryKwh / 130.0) * 100))
  const autonomyPct = Math.min(100, Math.max(0, (predictedRange / 650.0) * 100))
  const autonomyMiles = Math.round(predictedRange / 1.60934)

  // Arc length calculations for 220 degree sweep on r = 62 circle
  const arcLen = 238.06
  const leftOffset = arcLen * (1.0 - batteryPct / 100.0)
  const rightOffset = arcLen * (1.0 - autonomyPct / 100.0)

  // Real-world telemetry estimates
  const cityRange = Math.round(predictedRange * 1.08)
  const highwayRange = Math.round(predictedRange * 0.84)
  const winterRange = Math.round(predictedRange * 0.76)

  // Efficiency category
  const efficiencyRating = useMemo(() => {
    if (efficiencyWhKm < 145) return { text: 'Super Efficient', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    if (efficiencyWhKm <= 180) return { text: 'Standard Class', color: 'text-sky-400', bg: 'bg-sky-500/10' }
    return { text: 'High Consumption', color: 'text-amber-400', bg: 'bg-amber-500/10' }
  }, [efficiencyWhKm])

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 1. Main Matte-Dark Dashboard Enclosure (Binnacle) */}
      <div className="glass-panel-cowl rounded-3xl p-5 md:p-6 relative overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Top Ambient Telemetry Header Bar */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold tracking-wider text-[11px]">
              ⚡ READY
            </span>
            <span className="font-semibold text-slate-300">🌡️ 24°C</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/40 px-3.5 py-0.5 rounded-full font-bold tracking-widest text-[11px] shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              WLTP EST • {drivetrain}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">🕒 10:42 AM</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              5G
            </span>
          </div>
        </div>

        {/* Twin Curved Arcs & Center Dynamic Range Display */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr_1fr] items-center gap-4 py-4">
          
          {/* LEFT GAUGE: Usable Battery Energy Level (Electric Cyan Arc) */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <defs>
                  <linearGradient id="cyanArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>
                {/* Background Ring Track */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeWidth="8"
                  strokeDasharray="238.1 151.5"
                  strokeLinecap="round"
                  transform="rotate(160 80 80)"
                />
                {/* Active Cyan Sweep */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="url(#cyanArcGrad)"
                  strokeWidth="8"
                  strokeDasharray="238.1 151.5"
                  strokeDashoffset={leftOffset}
                  strokeLinecap="round"
                  transform="rotate(160 80 80)"
                  className="transition-all duration-500 ease-out"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0, 242, 254, 0.7))' }}
                />
              </svg>

              {/* Gauge Center Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-telemetry font-bold text-3xl text-cyan-400 tracking-tight leading-none">
                  {batteryKwh.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 font-semibold mt-0.5">
                  KWH
                </span>
                <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
                  {Math.round(batteryPct)}% SOC
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-2">
              ENERGY PACK
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              ({batteryKwh.toFixed(1)} kWh usable)
            </span>
          </div>

          {/* CENTER DISPLAY: Massive Glowing ML Predicted Range + Road Horizon */}
          <div className="flex flex-col items-center justify-center text-center px-2">
            <div className="relative">
              <span className="font-telemetry font-black text-6xl md:text-7xl text-white tracking-tighter glow-cyan leading-none select-none">
                {Math.round(predictedRange)}
              </span>
            </div>

            <div className="text-[11px] font-mono font-bold text-cyan-400 tracking-[0.25em] uppercase mt-1">
              ESTIMATED RANGE (KM)
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-400">
                ≈ <span className="text-slate-200 font-semibold">{autonomyMiles}</span> miles
              </span>
              <span className="text-slate-600">•</span>
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${efficiencyRating.bg} ${efficiencyRating.color}`}>
                {efficiencyRating.text}
              </span>
            </div>

            {/* Perspective Vector Road Lane leading to Horizon */}
            <div className="w-48 h-14 mt-1">
              <svg viewBox="0 0 200 65" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="roadLaneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0, 242, 254, 0.02)" />
                    <stop offset="100%" stopColor="rgba(0, 242, 254, 0.35)" />
                  </linearGradient>
                </defs>
                {/* Road perspective polygon */}
                <polygon points="80,5 120,5 165,60 35,60" fill="url(#roadLaneGrad)" />
                {/* Left lane border */}
                <line
                  x1="80"
                  y1="5"
                  x2="35"
                  y2="60"
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px #00f2fe)' }}
                />
                {/* Right lane border */}
                <line
                  x1="120"
                  y1="5"
                  x2="165"
                  y2="60"
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px #00f2fe)' }}
                />
                {/* Dashed center divider */}
                <line
                  x1="100"
                  y1="8"
                  x2="100"
                  y2="58"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* RIGHT GAUGE: Autonomy & Driving Efficiency (Neon Green Arc) */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <defs>
                  <linearGradient id="greenArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                {/* Background Ring Track */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeWidth="8"
                  strokeDasharray="238.1 151.5"
                  strokeLinecap="round"
                  transform="rotate(160 80 80)"
                />
                {/* Active Green Sweep */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="url(#greenArcGrad)"
                  strokeWidth="8"
                  strokeDasharray="238.1 151.5"
                  strokeDashoffset={rightOffset}
                  strokeLinecap="round"
                  transform="rotate(160 80 80)"
                  className="transition-all duration-500 ease-out"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.7))' }}
                />
              </svg>

              {/* Gauge Center Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-telemetry font-bold text-3xl text-emerald-400 tracking-tight leading-none">
                  {autonomyMiles}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 font-semibold mt-0.5">
                  MILES
                </span>
                <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30">
                  {Math.round(autonomyPct)}% EFF
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-2">
              AUTONOMY
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              ({autonomyMiles} MILES)
            </span>
          </div>

        </div>

        {/* Bottom Gear Selection Indicator Row */}
        <div className="flex justify-center items-center gap-6 pt-3 border-t border-white/5 font-mono font-bold tracking-[0.3em] text-sm text-slate-600">
          <span className="px-2 py-0.5 hover:text-slate-400 transition-colors">P</span>
          <span className="px-2 py-0.5 hover:text-slate-400 transition-colors">R</span>
          <span className="px-2 py-0.5 hover:text-slate-400 transition-colors">N</span>
          <span className="px-3 py-0.5 text-cyan-400 bg-cyan-500/15 border border-cyan-400/50 rounded shadow-[0_0_14px_rgba(56,189,248,0.4)]">
            [D]
          </span>
        </div>
      </div>

      {/* 2. Real-World Telemetry Breakdown Pill Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-panel p-2.5 rounded-xl border border-white/5">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
            🏙️ Urban / City
          </div>
          <div className="text-base font-telemetry font-bold text-slate-100 mt-0.5">
            {cityRange} km
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">+8% regen bonus</div>
        </div>

        <div className="glass-panel p-2.5 rounded-xl border border-white/5">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
            🛣️ 120km/h Highway
          </div>
          <div className="text-base font-telemetry font-bold text-slate-100 mt-0.5">
            {highwayRange} km
          </div>
          <div className="text-[10px] text-sky-400 font-mono">Aero drag impact</div>
        </div>

        <div className="glass-panel p-2.5 rounded-xl border border-white/5">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
            ❄️ Winter (-5°C)
          </div>
          <div className="text-base font-telemetry font-bold text-slate-100 mt-0.5">
            {winterRange} km
          </div>
          <div className="text-[10px] text-amber-400 font-mono">HVAC penalty</div>
        </div>
      </div>
    </div>
  )
}
