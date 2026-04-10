import { CompatibilityResult } from '../types'
import ScoreCircle from './ScoreCircle'
import MetricCard from './MetricCard'

interface ResultsProps {
  result: CompatibilityResult
  onReset: () => void
}

export default function Results({ result, onReset }: ResultsProps) {
  const { person1, person2, percentage, metrics, verdict, verdictDetail, accentColor, emoji, totalScore, maxScore } = result
  const f1 = person1.name.split(' ')[0]
  const f2 = person2.name.split(' ')[0]

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-16 animate-fade-in-up">

      {/* Names banner */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="font-cinzel font-bold text-xl" style={{ color: '#FF6B2B' }}>{f1}</span>
          <span className="font-crimson italic text-2xl" style={{ color: 'rgba(255,215,0,0.4)' }}>×</span>
          <span className="font-cinzel font-bold text-xl" style={{ color: '#FF69B4' }}>{f2}</span>
        </div>
        {(person1.birthdate || person2.birthdate) && (
          <p className="font-crimson italic text-sm mt-1" style={{ color: 'rgba(245,230,200,0.35)' }}>
            {person1.birthdate && `${f1}: ${new Date(person1.birthdate).toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })}`}
            {person1.birthdate && person2.birthdate && '  ·  '}
            {person2.birthdate && `${f2}: ${new Date(person2.birthdate).toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })}`}
          </p>
        )}
      </div>

      {/* Score circle */}
      <div className="flex justify-center mb-8">
        <ScoreCircle percentage={percentage} accentColor={accentColor} verdict={verdict} emoji={emoji} />
      </div>

      {/* Raw score */}
      <p className="text-center font-sans text-xs mb-8" style={{ color: 'rgba(245,230,200,0.3)', letterSpacing: '0.12em' }}>
        ASHTAKOOTA SCORE: {totalScore} / {maxScore}
      </p>

      {/* Verdict text */}
      <div
        className="glass-card p-6 mb-8 animate-fade-in-up"
        style={{ borderColor: `${accentColor}33`, boxShadow: `0 0 40px ${accentColor}0a` }}
      >
        <div className="divine-divider mb-4">
          <span style={{ fontSize: 13, letterSpacing: '0.2em', color: 'rgba(255,215,0,0.45)' }}>
            COSMIC READING
          </span>
        </div>
        <p className="font-crimson text-base leading-relaxed text-center"
          style={{ color: 'rgba(245,230,200,0.8)', fontSize: '1.08rem' }}>
          {verdictDetail}
        </p>
      </div>

      {/* Section heading */}
      <div className="divine-divider mb-6">
        <span className="font-cinzel text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.45)', letterSpacing: '0.2em' }}>
          ASHTAKOOTA — 8 SACRED METRICS
        </span>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {metrics.map((m, i) => (
          <MetricCard key={m.id} metric={m} delay={i * 80} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {([['excellent','#FFD700'],['good','#66BB6A'],['average','#FFA726'],['poor','#EF5350']] as const).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="font-sans text-xs capitalize" style={{ color: 'rgba(245,230,200,0.4)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Vedic note */}
      <div className="glass-card p-5 mb-8 text-center">
        <p className="font-crimson italic text-sm leading-relaxed" style={{ color: 'rgba(245,230,200,0.45)' }}>
          "The stars incline, they do not compel. Love, devotion, and conscious choice
          remain the supreme forces in any union."
        </p>
        <p className="font-sans text-xs mt-2" style={{ color: 'rgba(245,230,200,0.25)', letterSpacing: '0.1em' }}>
          — Ancient Jyotish wisdom
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="btn-primary" onClick={onReset}>
          <span style={{ fontSize: 16 }}>ॐ</span>
          Check Another Pair
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            const text = `${emoji} ${f1} & ${f2} — ${percentage}% compatible (${verdict}) on Ātmā Milan!`
            if (navigator.share) {
              navigator.share({ title: 'Ātmā Milan', text, url: window.location.href }).catch(() => {})
            } else {
              navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!')).catch(() => {})
            }
          }}
        >
          Share Result
        </button>
      </div>
    </div>
  )
}
