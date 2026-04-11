import { useState } from 'react'
import { CompatibilityResult, Precision } from '../types'
import ScoreCircle from './ScoreCircle'
import MetricCard from './MetricCard'
import { RASHI_ENGLISH } from '../utils/nakshatra'

interface ResultsProps {
  result: CompatibilityResult
  onReset: () => void
}

// ── Precision badge ────────────────────────────────────────────────────────────
const PRECISION_CONFIG: Record<Precision, { label: string; color: string; tip: string }> = {
  high:   { label: 'Nakshatra',     color: '#66BB6A', tip: 'Real Moon position via Meeus ephemeris' },
  medium: { label: 'Sun sign',      color: '#FFA726', tip: 'Add birth time for Nakshatra accuracy' },
  low:    { label: 'Numerology',    color: 'rgba(245,230,200,0.35)', tip: 'Add birthdate + time for full Jyotish' },
}

function PrecisionBadge({ precision }: { precision: Precision }) {
  const { label, color } = PRECISION_CONFIG[precision]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-sans"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}40`,
        color,
        fontSize: 10,
        letterSpacing: '0.08em',
      }}
    >
      <span style={{ fontSize: 7 }}>●</span>
      {label}
    </span>
  )
}

// ── Person astro card ──────────────────────────────────────────────────────────
function PersonAstroCard({
  name, accent, nakshatra, moonRashi, precision, birthdate, birthTime,
}: {
  name: string
  accent: string
  nakshatra?: string
  moonRashi?: string
  precision: Precision
  birthdate?: string
  birthTime?: string
}) {
  const displayRashi = moonRashi ? `${moonRashi} (${RASHI_ENGLISH[moonRashi] ?? moonRashi})` : null

  return (
    <div
      className="flex-1 rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: `${accent}08`,
        border: `1px solid ${accent}25`,
      }}
    >
      {/* Name + precision */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="font-cinzel font-bold" style={{ color: accent, fontSize: '1.1rem' }}>{name}</span>
        <PrecisionBadge precision={precision} />
      </div>

      {/* Nakshatra */}
      {nakshatra ? (
        <div className="flex items-center gap-2">
          <span style={{ color: accent, fontSize: 12 }}>✦</span>
          <span className="font-crimson italic" style={{ color: 'rgba(245,230,200,0.75)', fontSize: '0.95rem' }}>
            {nakshatra} Nakshatra
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span style={{ color: 'rgba(245,230,200,0.25)', fontSize: 12 }}>✦</span>
          <span className="font-crimson italic" style={{ color: 'rgba(245,230,200,0.35)', fontSize: '0.95rem' }}>
            {PRECISION_CONFIG[precision].tip}
          </span>
        </div>
      )}

      {/* Moon Rashi */}
      {displayRashi && (
        <div className="flex items-center gap-2">
          <span style={{ color: accent, fontSize: 12 }}>☽</span>
          <span className="font-sans text-xs" style={{ color: 'rgba(245,230,200,0.6)' }}>
            Moon in {displayRashi}
          </span>
        </div>
      )}

      {/* Birthdate */}
      {birthdate && (
        <div className="flex items-center gap-2">
          <span style={{ color: 'rgba(245,230,200,0.25)', fontSize: 12 }}>◎</span>
          <span className="font-sans text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
            {new Date(birthdate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            {birthTime ? ` at ${birthTime}` : ''}
          </span>
        </div>
      )}
    </div>
  )
}

export default function Results({ result, onReset }: ResultsProps) {
  const {
    person1, person2, astro1, astro2,
    percentage, metrics, verdict, verdictDetail,
    accentColor, emoji, totalScore, maxScore,
  } = result
  const f1 = person1.name.split(' ')[0]
  const f2 = person2.name.split(' ')[0]
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const text = `${emoji} ${f1} & ${f2} — ${percentage}% compatible (${verdict}) on Ātmā Milan!`
    if (navigator.share) {
      navigator.share({ title: 'Ātmā Milan', text, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
        .catch(() => {})
    }
  }

  // Best precision of the two (for header note)
  const bestPrecision = (astro1.precision === 'high' || astro2.precision === 'high') ? 'high'
    : (astro1.precision === 'medium' || astro2.precision === 'medium') ? 'medium' : 'low'

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-20 animate-fade-in-up">

      {/* ── Astro cards (names + Nakshatra) ──────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <PersonAstroCard
          name={f1} accent="#FF6B2B"
          nakshatra={astro1.nakshatra}
          moonRashi={astro1.moonRashi}
          precision={astro1.precision}
          birthdate={person1.birthdate}
          birthTime={person1.birthTime}
        />
        {/* Centre connector */}
        <div className="flex sm:flex-col items-center justify-center gap-1 px-1">
          <div className="flex-1 h-px sm:h-auto sm:w-px sm:flex-1" style={{ background: 'rgba(255,215,0,0.15)' }} />
          <span className="font-crimson italic text-2xl" style={{ color: 'rgba(255,215,0,0.3)' }}>×</span>
          <div className="flex-1 h-px sm:h-auto sm:w-px sm:flex-1" style={{ background: 'rgba(255,215,0,0.15)' }} />
        </div>
        <PersonAstroCard
          name={f2} accent="#FF69B4"
          nakshatra={astro2.nakshatra}
          moonRashi={astro2.moonRashi}
          precision={astro2.precision}
          birthdate={person2.birthdate}
          birthTime={person2.birthTime}
        />
      </div>

      {/* Precision note */}
      {bestPrecision !== 'high' && (
        <p className="text-center font-sans text-xs mb-6 italic"
          style={{ color: 'rgba(245,230,200,0.3)', letterSpacing: '0.08em' }}>
          {bestPrecision === 'medium'
            ? 'Add exact birth time + timezone to unlock real Nakshatra calculation'
            : 'Add birthdate + birth time for full Jyotish accuracy'}
        </p>
      )}

      {/* ── Score circle ─────────────────────────── */}
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

      {/* ── Cosmic reading ────────────────────────── */}
      <div
        className="glass-card p-7 mb-8"
        style={{
          borderColor: `${accentColor}30`,
          boxShadow: `0 0 60px ${accentColor}0d, 0 2px 8px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40)` }} />
          <span className="font-cinzel text-xs tracking-widest" style={{ color: `${accentColor}99`, letterSpacing: '0.22em' }}>
            COSMIC READING
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, transparent, ${accentColor}40)` }} />
        </div>
        <div className="text-center text-4xl mb-3">{emoji}</div>
        <p className="font-crimson leading-relaxed text-center"
          style={{ color: 'rgba(245,230,200,0.82)', fontSize: '1.1rem', lineHeight: 1.75 }}>
          {verdictDetail}
        </p>
      </div>

      {/* ── 8 metrics grid ───────────────────────── */}
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

      {/* ── Legend ────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {([['Excellent','#FFD700'],['Good','#66BB6A'],['Average','#FFA726'],['Challenging','#EF5350']] as const).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: `${color}0e`, border: `1px solid ${color}2a` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span className="font-sans" style={{ color: 'rgba(245,230,200,0.45)', fontSize: 11 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Vedic quote ───────────────────────────── */}
      <div className="glass-card p-6 mb-8 text-center">
        <p className="font-crimson italic leading-relaxed" style={{ color: 'rgba(245,230,200,0.5)', fontSize: '1.05rem' }}>
          "The stars incline, they do not compel. Love, devotion, and conscious choice
          remain the supreme forces in any union."
        </p>
        <p className="font-sans text-xs mt-3" style={{ color: 'rgba(245,230,200,0.22)', letterSpacing: '0.12em' }}>
          — Ancient Jyotish wisdom
        </p>
      </div>

      {/* ── Actions ───────────────────────────────── */}
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
