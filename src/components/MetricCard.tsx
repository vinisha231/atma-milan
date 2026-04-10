import { useEffect, useRef, useState } from 'react'
import { CompatibilityMetric } from '../types'

const LEVEL_COLORS = {
  excellent: '#FFD700',
  good:      '#66BB6A',
  average:   '#FFA726',
  poor:      '#EF5350',
} as const

const LEVEL_LABELS = {
  excellent: 'Excellent',
  good:      'Good',
  average:   'Average',
  poor:      'Challenging',
} as const

interface MetricCardProps {
  metric: CompatibilityMetric
  delay?: number
}

export default function MetricCard({ metric, delay = 0 }: MetricCardProps) {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Intersection observer for staggered entrance
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const pct = (metric.score / metric.maxScore) * 100
  const color = LEVEL_COLORS[metric.level]

  return (
    <div
      ref={ref}
      className="glass-card glass-card-hover p-5 flex flex-col gap-3 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl leading-none"
            style={{ color, textShadow: `0 0 12px ${color}88`, filter: 'drop-shadow(0 0 4px currentColor)' }}
          >
            {metric.icon}
          </span>
          <div>
            <p className="font-cinzel font-semibold text-sm" style={{ color: 'rgba(245,230,200,0.9)' }}>
              {metric.name}
            </p>
            <p className="font-crimson italic text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
              {metric.sanskritName}
            </p>
          </div>
        </div>

        {/* Score badge */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="font-cinzel font-bold text-base tabular-nums"
            style={{ color }}
          >
            {metric.score}/{metric.maxScore}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-sans"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}44`,
              color,
              fontSize: 10,
              letterSpacing: '0.08em',
            }}
          >
            {LEVEL_LABELS[metric.level]}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,215,0,0.08)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full score-bar-fill"
          style={{
            '--fill': `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
            width: visible ? `${pct}%` : '0%',
            transition: `width 1.1s cubic-bezier(.4,0,.2,1) ${delay + 200}ms`,
          } as React.CSSProperties}
        />
      </div>

      {/* Description */}
      <p className="font-sans text-xs" style={{ color: 'rgba(245,230,200,0.5)' }}>
        {metric.description}
      </p>

      {/* Expandable detail */}
      <div
        style={{
          maxHeight: expanded ? '120px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
      >
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,215,0,0.1)' }}>
          <p className="font-crimson text-sm leading-relaxed" style={{ color: 'rgba(245,230,200,0.65)' }}>
            {metric.detail}
          </p>
        </div>
      </div>

      {/* Tap hint */}
      <p className="text-center font-sans" style={{ fontSize: 10, color: 'rgba(245,230,200,0.2)', letterSpacing: '0.1em' }}>
        {expanded ? '▲ collapse' : '▼ tap for reading'}
      </p>
    </div>
  )
}
