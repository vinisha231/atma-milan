import { useState } from 'react'
import { CompatibilityResult } from '../types'
import ScoreCircle from './ScoreCircle'
import MetricCard from './MetricCard'

interface ResultsProps {
  result: CompatibilityResult
  onReset: () => void
}

export default function Results({ result, onReset }: ResultsProps) {
  const {
    person1, person2, percentage, metrics,
    verdict, verdictDetail, accentColor, emoji, totalScore, maxScore,
  } = result
  const f1 = person1.name.split(' ')[0]
  const f2 = person2.name.split(' ')[0]
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const text = `${emoji} ${f1} & ${f2} — ${percentage}% compatible (${verdict}) on Ātmā Milan!`
    if (navigator.share) {
      navigator.share({ title: 'Ātmā Milan', text, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-20 animate-fade-in-up">

      {/* ── Names banner ───────────────────────────────── */}
      <div
        className="text-center mb-8 py-5 px-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,43,0.06) 0%, rgba(255,105,180,0.06) 100%)',
          border: '1px solid rgba(255,215,0,0.1)',
        }}
      >
        <div className="flex items-center justify-center gap-4 flex-wrap mb-2">
          <div className="text-center">
            <p className="font-cinzel font-bold text-2xl" style={{ color: '#FF6B2B', textShadow: '0 0 20px rgba(255,107,43,0.5)' }}>
              {f1}
            </p>
            {person1.birthdate && (
              <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(245,230,200,0.35)' }}>
                {new Date(person1.birthdate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="font-crimson italic text-3xl" style={{ color: 'rgba(255,215,0,0.35)' }}>×</span>
            <span className="font-sans text-xs" style={{ color: 'rgba(255,215,0,0.25)', letterSpacing: '0.15em' }}>MILAN</span>
          </div>

          <div className="text-center">
            <p className="font-cinzel font-bold text-2xl" style={{ color: '#FF69B4', textShadow: '0 0 20px rgba(255,105,180,0.5)' }}>
              {f2}
            </p>
            {person2.birthdate && (
              <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(245,230,200,0.35)' }}>
                {new Date(person2.birthdate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Score circle ──────────────────────────────── */}
      <div className="flex justify-center mb-4">
        <ScoreCircle percentage={percentage} accentColor={accentColor} verdict={verdict} emoji={emoji} />
      </div>

      {/* Raw score pill */}
      <div className="flex justify-center mb-8">
        <span
          className="font-cinzel text-xs px-4 py-1.5 rounded-full"
          style={{
            background: `${accentColor}12`,
            border: `1px solid ${accentColor}30`,
            color: `${accentColor}bb`,
            letterSpacing: '0.15em',
          }}
        >
          ASHTAKOOTA &nbsp;{totalScore} / {maxScore}
        </span>
      </div>

      {/* ── Cosmic reading ────────────────────────────── */}
      <div
        className="glass-card p-7 mb-8"
        style={{
          borderColor: `${accentColor}30`,
          boxShadow: `0 0 60px ${accentColor}0d, 0 2px 8px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40)` }} />
          <span
            className="font-cinzel text-xs tracking-widest"
            style={{ color: `${accentColor}99`, letterSpacing: '0.22em' }}
          >
            COSMIC READING
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, transparent, ${accentColor}40)` }} />
        </div>

        {/* Verdict icon */}
        <div className="text-center text-4xl mb-3">{emoji}</div>

        <p
          className="font-crimson leading-relaxed text-center"
          style={{ color: 'rgba(245,230,200,0.82)', fontSize: '1.1rem', lineHeight: 1.75 }}
        >
          {verdictDetail}
        </p>
      </div>

      {/* ── 8 metrics section ─────────────────────────── */}
      <div className="mb-6">
        <div className="divine-divider mb-6">
          <span className="font-cinzel text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.4)', letterSpacing: '0.22em' }}>
            8 SACRED METRICS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.id} metric={m} delay={i * 70} />
          ))}
        </div>
      </div>

      {/* ── Legend ────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {([
          ['Excellent', '#FFD700'],
          ['Good',      '#66BB6A'],
          ['Average',   '#FFA726'],
          ['Challenging','#EF5350'],
        ] as const).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: `${color}0e`, border: `1px solid ${color}2a` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span className="font-sans" style={{ color: 'rgba(245,230,200,0.45)', fontSize: 11 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Vedic quote ───────────────────────────────── */}
      <div className="glass-card p-6 mb-8 text-center">
        <p className="font-crimson italic leading-relaxed" style={{ color: 'rgba(245,230,200,0.5)', fontSize: '1.05rem' }}>
          "The stars incline, they do not compel. Love, devotion,
          and conscious choice remain the supreme forces in any union."
        </p>
        <p className="font-sans text-xs mt-3" style={{ color: 'rgba(245,230,200,0.22)', letterSpacing: '0.12em' }}>
          — Ancient Jyotish wisdom
        </p>
      </div>

      {/* ── Actions ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button className="btn-primary" onClick={onReset}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>ॐ</span>
          Check Another Pair
        </button>
        <button className="btn-ghost" onClick={handleShare}>
          {copied ? '✓ Copied!' : 'Share Result'}
        </button>
      </div>
    </div>
  )
}
