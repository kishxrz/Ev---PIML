import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Eye, Shield, RotateCcw, Sparkles } from 'lucide-react'

// ============================================================================
// 1. DYNAMIC VEHICLE SPECIFICATIONS BY BODY TYPE
// ============================================================================
const BODY_SPECS = {
  'SUV': {
    name: 'Electric SUV Class',
    badge: 'Tall Crossover Stance • AWD Architecture',
    cabinHeight: 0.85,
    cabinLength: 2.20,
    cabinWidth: 1.40,
    hoodLength: 1.15,
    rearLength: 0.90,
    groundClearance: 0.44,
    wheelbase: 2.85,
    trackWidth: 1.72,
    rearSlope: -0.32,
    bodyLengthTotal: 4.30,
  },
  'Sedan': {
    name: 'Executive EV Sedan',
    badge: 'Elongated Aerodynamic Stance',
    cabinHeight: 0.60,
    cabinLength: 2.10,
    cabinWidth: 1.35,
    hoodLength: 1.25,
    rearLength: 1.00,
    groundClearance: 0.36,
    wheelbase: 2.90,
    trackWidth: 1.68,
    rearSlope: -0.45,
    bodyLengthTotal: 4.40,
  },
  'Hatchback': {
    name: 'Urban City EV',
    badge: 'Compact Urban Wheelbase • Agile Commuter',
    cabinHeight: 0.65,
    cabinLength: 1.65,
    cabinWidth: 1.35,
    hoodLength: 0.95,
    rearLength: 0.60,
    groundClearance: 0.38,
    wheelbase: 2.45,
    trackWidth: 1.62,
    rearSlope: -0.15,
    bodyLengthTotal: 3.65,
  },
  'Small Passenger Van': {
    name: 'Multi-Passenger E-Van',
    badge: 'Tall Continuous Van Roof • Maximum Volume',
    cabinHeight: 1.05,
    cabinLength: 2.40,
    cabinWidth: 1.40,
    hoodLength: 0.80,
    rearLength: 0.85,
    groundClearance: 0.46,
    wheelbase: 2.95,
    trackWidth: 1.72,
    rearSlope: -0.08,
    bodyLengthTotal: 4.45,
  },
  'Coupe': {
    name: 'Aero GT Coupe',
    badge: 'Low-Slung Sports Stance • Swept Back',
    cabinHeight: 0.55,
    cabinLength: 2.00,
    cabinWidth: 1.38,
    hoodLength: 1.35,
    rearLength: 0.95,
    groundClearance: 0.34,
    wheelbase: 2.75,
    trackWidth: 1.72,
    rearSlope: -0.52,
    bodyLengthTotal: 4.35,
  },
  'Liftback Sedan': {
    name: 'Performance Liftback',
    badge: 'High-Performance Gran Coupe Profile',
    cabinHeight: 0.58,
    cabinLength: 2.20,
    cabinWidth: 1.38,
    hoodLength: 1.30,
    rearLength: 1.05,
    groundClearance: 0.35,
    wheelbase: 2.92,
    trackWidth: 1.70,
    rearSlope: -0.48,
    bodyLengthTotal: 4.45,
  },
  'Station/Estate': {
    name: 'EV Station Wagon / Estate',
    badge: 'Extended Touring Roofline • Utility Aero',
    cabinHeight: 0.70,
    cabinLength: 2.30,
    cabinWidth: 1.38,
    hoodLength: 1.20,
    rearLength: 1.10,
    groundClearance: 0.38,
    wheelbase: 2.90,
    trackWidth: 1.68,
    rearSlope: -0.22,
    bodyLengthTotal: 4.45,
  },
  'Cabriolet': {
    name: 'Open-Air Roadster',
    badge: 'Low-Stance Performance Roadster',
    cabinHeight: 0.52,
    cabinLength: 1.95,
    cabinWidth: 1.38,
    hoodLength: 1.35,
    rearLength: 0.90,
    groundClearance: 0.34,
    wheelbase: 2.70,
    trackWidth: 1.70,
    rearSlope: -0.40,
    bodyLengthTotal: 4.25,
  },
}

// ============================================================================
// 2. DETAILED DARK WHEEL WITH RUBBER TIRE & CHROME CENTER HUB
// ============================================================================
function DarkAlloyWheel({ position, isLeft, xRayMode }) {
  const wheelGroupRef = useRef()

  useFrame(() => {
    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.x += 0.015
    }
  })

  return (
    <group position={position}>
      <group ref={wheelGroupRef}>
        {/* Rubber Tread Tire (#0f172a) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.28, 28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Outer Wheel Lip Chamfer */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.03, 12, 28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Dark Gunmetal Wheel Barrel */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? -0.11 : 0.11, 0, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.04, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Chrome Center Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? -0.145 : 0.145, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Drilled Steel Brake Rotor Disc */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? -0.06 : 0.06, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.18} />
        </mesh>
      </group>

      {/* High-Performance Cyan Brake Caliper */}
      <mesh position={[isLeft ? -0.09 : 0.09, 0.14, 0.14]}>
        <boxGeometry args={[0.07, 0.14, 0.10]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={xRayMode ? 2.5 : 1.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

// ============================================================================
// 3. SOLID ASH GREY VEHICLE WITH DYNAMIC BODY MORPHING & UNDERFLOOR BATTERY
// ============================================================================
function SolidEVVehicle({ batteryKwh = 75, drivetrain = 'AWD', bodyType = 'SUV', xRayMode = false }) {
  const batteryGroupRef = useRef()

  const spec = useMemo(() => {
    return BODY_SPECS[bodyType] || BODY_SPECS['SUV']
  }, [bodyType])

  // Battery Pack Glow Color based on pack capacity
  const batteryColor = useMemo(() => {
    if (batteryKwh >= 90) return '#38bdf8'  // Hyper Sky Cyan
    if (batteryKwh >= 70) return '#00f2fe'  // Electric Cyan
    if (batteryKwh >= 50) return '#34d399'  // Balanced Emerald
    return '#fbbf24'                       // Amber
  }, [batteryKwh])

  // Continuous subtle pulse animation on underfloor battery cells
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (batteryGroupRef.current) {
      const pulse = xRayMode ? 2.2 + Math.sin(t * 3.5) * 0.8 : 1.2 + Math.sin(t * 2.0) * 0.3
      batteryGroupRef.current.children.forEach((child) => {
        if (child.material && child.material.emissive) {
          child.material.emissiveIntensity = pulse
        }
      })
    }
  })

  // Wheel positions mapped dynamically to body wheelbase and track
  const halfWheelbase = spec.wheelbase / 2
  const halfTrack = spec.trackWidth / 2
  const wheelY = 0.38

  return (
    <group position={[0, -0.02, 0]}>

      {/* ================================================================== */}
      {/* A. UNDER-FLOOR STRUCTURAL BATTERY PACK & SKATEBOARD PLATFORM       */}
      {/* ================================================================== */}
      <group position={[0, 0.30, 0]}>
        {/* Armored Titanium Floor Battery Enclosure */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[spec.cabinWidth * 1.05, 0.14, spec.wheelbase * 0.95]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.35} />
        </mesh>

        {/* Longitudinal Frame Rails */}
        <mesh position={[-spec.cabinWidth * 0.54, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.16, spec.wheelbase * 1.15]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[spec.cabinWidth * 0.54, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.16, spec.wheelbase * 1.15]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* 10 Individual High-Voltage Battery Cell Modules */}
        <group ref={batteryGroupRef} position={[0, 0.11, 0]}>
          {[-1.0, -0.5, 0.0, 0.5, 1.0].map((relZ, idx) => (
            <React.Fragment key={idx}>
              {/* Left Cell Bay */}
              <mesh position={[-spec.cabinWidth * 0.28, 0, relZ * (spec.wheelbase * 0.36)]}>
                <boxGeometry args={[spec.cabinWidth * 0.42, 0.07, spec.wheelbase * 0.14]} />
                <meshStandardMaterial
                  color={batteryColor}
                  emissive={batteryColor}
                  emissiveIntensity={xRayMode ? 3.5 : 1.3}
                  toneMapped={false}
                />
              </mesh>
              {/* Right Cell Bay */}
              <mesh position={[spec.cabinWidth * 0.28, 0, relZ * (spec.wheelbase * 0.36)]}>
                <boxGeometry args={[spec.cabinWidth * 0.42, 0.07, spec.wheelbase * 0.14]} />
                <meshStandardMaterial
                  color={batteryColor}
                  emissive={batteryColor}
                  emissiveIntensity={xRayMode ? 3.5 : 1.3}
                  toneMapped={false}
                />
              </mesh>
            </React.Fragment>
          ))}
        </group>

        {/* High-Voltage Orange Busbar Conduits */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.06, 0.05, spec.wheelbase * 0.9]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#ea580c"
            emissiveIntensity={xRayMode ? 3.0 : 1.4}
          />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* B. ELECTRIC DRIVE MOTORS (FRONT & REAR AXLES)                      */}
      {/* ================================================================== */}
      {/* Rear High-Output Electric Drive Unit */}
      <group position={[0, 0.38, halfWheelbase]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.65, 18]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={xRayMode} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.35, 0.14, 0.3]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={xRayMode ? 2.5 : 1.0}
          />
        </mesh>
      </group>

      {/* Front Electric Drive Unit (for AWD / FWD) */}
      {drivetrain !== 'RWD' && (
        <group position={[0, 0.38, -halfWheelbase]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.60, 18]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={xRayMode} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.30, 0.12, 0.26]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={xRayMode ? 2.5 : 1.0}
            />
          </mesh>
        </group>
      )}

      {/* ================================================================== */}
      {/* C. 4 DARK ALLOY WHEELS AT CORNERS                                  */}
      {/* ================================================================== */}
      {/* Front Left */}
      <DarkAlloyWheel
        position={[-halfTrack, wheelY, -halfWheelbase]}
        isLeft={true}
        xRayMode={xRayMode}
      />
      {/* Front Right */}
      <DarkAlloyWheel
        position={[halfTrack, wheelY, -halfWheelbase]}
        isLeft={false}
        xRayMode={xRayMode}
      />
      {/* Rear Left */}
      <DarkAlloyWheel
        position={[-halfTrack, wheelY, halfWheelbase]}
        isLeft={true}
        xRayMode={xRayMode}
      />
      {/* Rear Right */}
      <DarkAlloyWheel
        position={[halfTrack, wheelY, halfWheelbase]}
        isLeft={false}
        xRayMode={xRayMode}
      />

      {/* ================================================================== */}
      {/* D. SOLID ASH GREY BODYWORK (DYNAMIC BY CAR_BODY_TYPE)              */}
      {/* ================================================================== */}
      <group position={[0, spec.groundClearance, 0]}>

        {/* 1. Main Monocoque Lower Beltline Shell (#64748b, roughness: 0.3, metalness: 0.5) */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[spec.cabinWidth * 1.14, 0.38, spec.bodyLengthTotal]} />
          <meshStandardMaterial
            color="#64748b"
            roughness={0.3}
            metalness={0.5}
            transparent={xRayMode}
            opacity={xRayMode ? 0.25 : 1.0}
            wireframe={xRayMode}
          />
        </mesh>

        {/* 2. Sloping Aerodynamic Front Hood */}
        <mesh
          position={[0, 0.36, -halfWheelbase - spec.hoodLength * 0.22]}
          rotation={[0.07, 0, 0]}
        >
          <boxGeometry args={[spec.cabinWidth * 1.08, 0.22, spec.hoodLength]} />
          <meshStandardMaterial
            color="#64748b"
            roughness={0.3}
            metalness={0.5}
            transparent={xRayMode}
            opacity={xRayMode ? 0.25 : 1.0}
            wireframe={xRayMode}
          />
        </mesh>

        {/* 3. Front Lower Aero Splitter & Air Dam */}
        <mesh position={[0, 0.08, -spec.bodyLengthTotal / 2]}>
          <boxGeometry args={[spec.cabinWidth * 1.10, 0.08, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* 4. Rear Lower Aerodynamic Diffuser */}
        <mesh position={[0, 0.08, spec.bodyLengthTotal / 2]}>
          <boxGeometry args={[spec.cabinWidth * 1.10, 0.09, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* 5. Aerodynamic Rear Deck / Tailgate Lip */}
        <mesh
          position={[0, 0.36, halfWheelbase + spec.rearLength * 0.25]}
          rotation={[-0.04, 0, 0]}
        >
          <boxGeometry args={[spec.cabinWidth * 1.06, 0.22, spec.rearLength]} />
          <meshStandardMaterial
            color="#64748b"
            roughness={0.3}
            metalness={0.5}
            transparent={xRayMode}
            opacity={xRayMode ? 0.25 : 1.0}
            wireframe={xRayMode}
          />
        </mesh>

        {/* 6. Dark Tinted Greenhouse / Cabin Windows (#1e293b, roughness: 0.1, metalness: 0.8) */}
        <mesh position={[0, 0.47 + spec.cabinHeight / 2, 0.05]}>
          <boxGeometry args={[spec.cabinWidth, spec.cabinHeight, spec.cabinLength]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.1}
            metalness={0.8}
            transparent={true}
            opacity={xRayMode ? 0.18 : 0.90}
            wireframe={xRayMode}
          />
        </mesh>

        {/* 7. Sloped Front Windshield Glass */}
        <mesh
          position={[0, 0.50 + spec.cabinHeight * 0.42, -spec.cabinLength * 0.48]}
          rotation={[0.45, 0, 0]}
        >
          <boxGeometry args={[spec.cabinWidth * 0.96, 0.03, spec.cabinHeight * 0.95]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.1}
            metalness={0.85}
            transparent={true}
            opacity={xRayMode ? 0.2 : 0.85}
          />
        </mesh>

        {/* 8. Sloped Rear Window Glass (Angled by bodyType) */}
        <mesh
          position={[0, 0.50 + spec.cabinHeight * 0.42, spec.cabinLength * 0.48]}
          rotation={[spec.rearSlope, 0, 0]}
        >
          <boxGeometry args={[spec.cabinWidth * 0.96, 0.03, spec.cabinHeight * 0.95]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.1}
            metalness={0.85}
            transparent={true}
            opacity={xRayMode ? 0.2 : 0.85}
          />
        </mesh>

        {/* 9. Sleek Side Mirrors */}
        <group position={[-spec.cabinWidth * 0.62, 0.56, -spec.cabinLength * 0.38]}>
          <mesh>
            <boxGeometry args={[0.18, 0.07, 0.11]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
        <group position={[spec.cabinWidth * 0.62, 0.56, -spec.cabinLength * 0.38]}>
          <mesh>
            <boxGeometry args={[0.18, 0.07, 0.11]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>

        {/* ================================================================== */}
        {/* E. HORIZONTAL LIGHTING: CYAN LED FRONT & RED LED REAR              */}
        {/* ================================================================== */}
        {/* Front Horizontal Cyan LED Headlights (#38bdf8) */}
        <mesh position={[0, 0.38, -spec.bodyLengthTotal / 2 - 0.01]}>
          <boxGeometry args={[spec.cabinWidth * 1.02, 0.045, 0.04]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={3.5}
            toneMapped={false}
          />
        </mesh>
        {/* Left & Right Headlight Projector Pods */}
        <mesh position={[-spec.cabinWidth * 0.42, 0.38, -spec.bodyLengthTotal / 2 - 0.015]}>
          <boxGeometry args={[0.18, 0.06, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={4.0} />
        </mesh>
        <mesh position={[spec.cabinWidth * 0.42, 0.38, -spec.bodyLengthTotal / 2 - 0.015]}>
          <boxGeometry args={[0.18, 0.06, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={4.0} />
        </mesh>

        {/* Rear Horizontal Red LED Taillights (#ef4444) */}
        <mesh position={[0, 0.40, spec.bodyLengthTotal / 2 + 0.01]}>
          <boxGeometry args={[spec.cabinWidth * 1.02, 0.045, 0.04]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={3.5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// ============================================================================
// 4. MAIN EXPORTED CARCANVAS COMPONENT
// ============================================================================
export default function CarCanvas({
  batteryKwh = 75,
  drivetrain = 'AWD',
  bodyType = 'SUV',
}) {
  const [xRayMode, setXRayMode] = useState(false)
  const activeSpec = BODY_SPECS[bodyType] || BODY_SPECS['SUV']

  return (
    <div className="w-full h-full relative select-none rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1124] via-[#060a14] to-[#03060c]">
      <Canvas
        camera={{ position: [4.2, 2.6, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Crisp Studio Lighting (No Silhouette / No Pitch Black) */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[10, 15, 10]} intensity={3.0} />
        <directionalLight position={[-10, 10, -8]} intensity={1.8} color="#cbd5e1" />
        <pointLight position={[0, 6, 6]} intensity={2.5} color="#38bdf8" />

        {/* Solid Ash Grey 3D EV Vehicle Model with Dynamic Proportions */}
        <SolidEVVehicle
          batteryKwh={batteryKwh}
          drivetrain={drivetrain}
          bodyType={bodyType}
          xRayMode={xRayMode}
        />

        {/* High-Fidelity Showroom Contact Floor Shadows */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.7}
          scale={12}
          blur={2.0}
          far={4}
          color="#000000"
        />

        {/* Perspective Ground Grid */}
        <Grid
          position={[0, 0, 0]}
          args={[26, 26]}
          cellSize={0.5}
          cellThickness={0.8}
          cellColor="#1e293b"
          sectionSize={2.0}
          sectionThickness={1.2}
          sectionColor="#0284c7"
          fadeDistance={20}
          fadeStrength={1.4}
        />

        {/* Interactive Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 7}
          autoRotate={!xRayMode}
          autoRotateSpeed={0.6}
        />
      </Canvas>

      {/* Top Left: Active Vehicle Telemetry Badge */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase bg-slate-950/85 px-3 py-1 rounded-lg border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            {activeSpec.name} • {bodyType}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 ml-4 flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-cyan-400" />
          Metallic Ash Grey • {activeSpec.badge} ({drivetrain})
        </span>
      </div>

      {/* Top Right: "⚡ Battery X-Ray Inspection" Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setXRayMode((prev) => !prev)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold tracking-wide transition-all shadow-lg cursor-pointer backdrop-blur-md border ${
            xRayMode
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.6)] ring-2 ring-cyan-400'
              : 'bg-slate-900/80 text-cyan-400 border-cyan-500/40 hover:bg-slate-800 hover:border-cyan-400'
          }`}
        >
          <Eye className={`w-4 h-4 ${xRayMode ? 'animate-pulse' : ''}`} />
          <span>{xRayMode ? '⚡ X-Ray Active (Cells Exposed)' : '⚡ Battery X-Ray Mode'}</span>
        </button>
      </div>

      {/* Bottom Center: X-Ray Telemetry Pill when Active */}
      {xRayMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-semibold px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(0,242,254,0.35)] flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Underfloor Skateboard Battery Pack: {batteryKwh.toFixed(1)} kWh Active Cell Matrix</span>
        </div>
      )}

      {/* Bottom Right: Navigation Hint */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800/80 pointer-events-none backdrop-blur-sm">
        🖱️ Orbit Viewport • Scroll Zoom
      </div>
    </div>
  )
}
