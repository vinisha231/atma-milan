import React from 'react'

// Seeded "random" so the star layout is stable across renders
function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* ── Base gradient ──────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 10%, #2a0a4a 0%, #120022 40%, #080012 70%, #04000c 100%)',
        }}
      />

      {/* ── Ambient colour orbs ────────────────────────── */}
      {/* Saffron top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: '-180px', right: '-180px',
          background: 'radial-gradient(circle, rgba(255,107,43,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Purple bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 650, height: 650,
          bottom: '-200px', left: '-200px',
          background: 'radial-gradient(circle, rgba(100,30,180,0.22) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Gold centre-top */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          top: '-80px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(255,215,0,0.10) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Lotus pink bottom-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 480, height: 480,
          bottom: '-120px', right: '-80px',
          background: 'radial-gradient(circle, rgba(220,70,180,0.12) 0%, transparent 70%)',
          filter: 'blur(55px)',
        }}
      />
      {/* Subtle teal accent centre-bottom */}
      <div
        className="absolute rounded-full"
        style={{
          width: 360, height: 360,
          bottom: '10%', left: '38%',
          background: 'radial-gradient(circle, rgba(40,160,180,0.07) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* ── Star field ─────────────────────────────────── */}
      {Array.from({ length: 80 }).map((_, i) => {
        const size = seeded(i * 7) > 0.92 ? 3 : seeded(i * 7) > 0.75 ? 2 : 1
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width:  size,
              height: size,
              top:    `${seeded(i * 3) * 100}%`,
              left:   `${seeded(i * 5) * 100}%`,
              background: seeded(i * 11) > 0.7
                ? `rgba(255,215,0,${0.15 + seeded(i * 13) * 0.5})`
                : `rgba(245,230,200,${0.1 + seeded(i * 17) * 0.4})`,
              animation: `pulse ${3 + seeded(i * 19) * 4}s ease-in-out ${seeded(i * 23) * 4}s infinite`,
            }}
          />
        )
      })}

      {/* ── Outer mandala ring ─────────────────────────── */}
      <div
        className="absolute animate-spin-slow"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 760, height: 760,
          opacity: 0.07,
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="100" y1="100" x2="100" y2="4"
              stroke="#FFD700" strokeWidth="0.4"
              transform={`rotate(${i * 15} 100 100)`} />
          ))}
          {[88, 74, 60, 46, 32, 18].map(r => (
            <circle key={r} cx="100" cy="100" r={r} stroke="#FFD700" strokeWidth="0.35" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <polygon key={i} points="100,14 105,7 100,0 95,7"
              fill="#FFD700" transform={`rotate(${i * 30} 100 100)`} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180)
            const r = 60
            return <circle key={`d${i}`}
              cx={100 + r * Math.cos(a)} cy={100 + r * Math.sin(a)}
              r="2" fill="#FF9933" opacity="0.6" />
          })}
        </svg>
      </div>

      {/* ── Inner mandala ring (counter-rotating) ──────── */}
      <div
        className="absolute animate-spin-slow-ccw"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 520, height: 520,
          opacity: 0.065,
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1="100" y1="100" x2="100" y2="8"
              stroke="#FF9933" strokeWidth="0.5"
              transform={`rotate(${i * 20} 100 100)`} />
          ))}
          {[78, 58, 38, 20].map(r => (
            <circle key={r} cx="100" cy="100" r={r} stroke="#FF9933" strokeWidth="0.45" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <polygon key={i} points="100,18 104,12 100,6 96,12"
              fill="#FF9933" transform={`rotate(${i * 40} 100 100)`} />
          ))}
        </svg>
      </div>

      {/* ── Third ring — lotus petals (stationary) ─────── */}
      <div
        className="absolute"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300, height: 300,
          opacity: 0.05,
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="50" cy="22" rx="7" ry="18"
              fill="#FF69B4" transform={`rotate(${i * 45} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="10" fill="#FFD700" />
        </svg>
      </div>

      {/* ── Corner lotus decorations ────────────────────── */}
      {([
        { top: '-50px', left: '-50px', rotateDeg: 0 },
        { top: '-50px', right: '-50px', rotateDeg: 90 },
        { bottom: '-50px', left: '-50px', rotateDeg: 270 },
        { bottom: '-50px', right: '-50px', rotateDeg: 180 },
      ] as Array<{ rotateDeg: number; top?: string; left?: string; right?: string; bottom?: string }>)
        .map(({ rotateDeg, ...pos }, i) => (
          <div
            key={i}
            className="absolute opacity-[0.07]"
            style={{ ...pos, width: 240, height: 240 } as React.CSSProperties}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ transform: `rotate(${rotateDeg}deg)` }}>
              {Array.from({ length: 8 }).map((_, j) => (
                <ellipse key={j} cx="50" cy="24" rx="9" ry="22"
                  fill="#FFD700" transform={`rotate(${j * 45} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="11" fill="#FF9933" />
            </svg>
          </div>
        ))}

      {/* ── Noise/grain texture overlay ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          opacity: 0.35,
        }}
      />

      {/* ── Edge vignette ───────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(4,0,12,0.65) 100%)',
        }}
      />
    </div>
  )
}
