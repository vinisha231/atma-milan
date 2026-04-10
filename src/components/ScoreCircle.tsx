import { useEffect, useState } from 'react'

interface ScoreCircleProps {
  percentage: number
  accentColor: string
  verdict: string
  emoji: string
}

export default function ScoreCircle({ percentage, accentColor, verdict, emoji }: ScoreCircleProps) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 1600
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setAnimated(Math.round(eased * percentage))
      if (t < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [percentage])

  const radius = 88
  const stroke = 10
  const normalised = radius - stroke / 2
  const circumference = 2 * Math.PI * normalised
  const dashOffset = circumference * (1 - animated / 100)

  // Second ring (decorative, slow rotation via CSS)
  const r2 = radius + 22
  const c2 = 2 * Math.PI * r2

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: 240, height: 240 }}>
        <svg width="240" height="240" viewBox="0 0 240 240" className="block">
          {/* Outer decorative dashed ring */}
          <circle
            cx="120" cy="120" r={r2}
            fill="none"
            stroke="rgba(255,215,0,0.12)"
            strokeWidth="1"
            strokeDasharray="4 8"
            style={{ transformOrigin: '120px 120px' }}
            className="animate-spin-slow"
          />

          {/* Inner decorative dashed ring (counter-clockwise) */}
          <circle
            cx="120" cy="120" r={radius + 8}
            fill="none"
            stroke="rgba(255,107,43,0.15)"
            strokeWidth="1"
            strokeDasharray="3 6"
            style={{ transformOrigin: '120px 120px' }}
            className="animate-spin-slow-ccw"
          />

          {/* Track ring */}
          <circle
            cx="120" cy="120" r={normalised}
            fill="none"
            stroke="rgba(255,215,0,0.08)"
            strokeWidth={stroke}
          />

          {/* Progress arc */}
          <circle
            cx="120" cy="120" r={normalised}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 8px ${accentColor}88)` }}
          />

          {/* Lotus petal dots at cardinal points */}
          {[0, 90, 180, 270].map(deg => {
            const rad = (deg - 90) * (Math.PI / 180)
            const x = 120 + (radius + 18) * Math.cos(rad)
            const y = 120 + (radius + 18) * Math.sin(rad)
            return <circle key={deg} cx={x} cy={y} r="2.5" fill={accentColor} opacity="0.6" />
          })}

          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B2B" />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 select-none">
          <span style={{ fontSize: 28 }}>{emoji}</span>
          <span
            className="font-cinzel font-bold tabular-nums"
            style={{ fontSize: 42, lineHeight: 1, color: accentColor, textShadow: `0 0 20px ${accentColor}66` }}
          >
            {animated}%
          </span>
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(245,230,200,0.45)', letterSpacing: '0.15em' }}>
            compatibility
          </span>
        </div>
      </div>

      {/* Verdict label */}
      <div className="text-center">
        <h2
          className="font-cinzel font-bold text-2xl"
          style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}55` }}
        >
          {verdict}
        </h2>
      </div>
    </div>
  )
}
