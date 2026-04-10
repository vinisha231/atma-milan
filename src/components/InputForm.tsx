import { useState, FormEvent } from 'react'
import { PersonInfo } from '../types'

interface InputFormProps {
  onSubmit: (p1: PersonInfo, p2: PersonInfo) => void
}

function PersonCard({
  label,
  side,
  data,
  onChange,
  expanded,
  onToggleExpand,
}: {
  label: string
  side: 'left' | 'right'
  data: PersonInfo
  onChange: (d: Partial<PersonInfo>) => void
  expanded: boolean
  onToggleExpand: () => void
}) {
  const accent = side === 'left' ? '#FF6B2B' : '#FF69B4'
  const accentFaint = side === 'left' ? 'rgba(255,107,43,0.12)' : 'rgba(255,105,180,0.12)'

  return (
    <div
      className="relative flex flex-col gap-4 p-6 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${side === 'left' ? 'rgba(255,107,43,0.2)' : 'rgba(255,105,180,0.2)'}`,
        boxShadow: `0 0 40px ${accentFaint}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.6 }}
      />

      {/* Corner glyph */}
      <span
        className="absolute top-3 right-4 font-crimson select-none"
        style={{ color: accent, opacity: 0.3, fontSize: 18 }}
        aria-hidden="true"
      >
        {side === 'left' ? '❯' : '❮'}
      </span>

      {/* Label */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
        <span
          className="font-cinzel text-xs tracking-widest uppercase"
          style={{ color: accent, letterSpacing: '0.2em' }}
        >
          {label}
        </span>
      </div>

      {/* Name input */}
      <div>
        <label className="block text-xs mb-2" style={{ color: 'rgba(245,230,200,0.45)', letterSpacing: '0.12em' }}>
          FULL NAME <span style={{ color: accent }}>*</span>
        </label>
        <input
          className="vedic-input"
          type="text"
          placeholder={side === 'left' ? 'Your name…' : 'Their name…'}
          value={data.name}
          onChange={e => onChange({ name: e.target.value })}
          required
          autoComplete="off"
          style={{ borderColor: data.name.trim().length >= 2 ? `${accent}44` : undefined }}
        />
      </div>

      {/* Optional toggle */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex items-center justify-between w-full rounded-lg px-4 py-2.5 text-left"
        style={{
          background: expanded ? `${accentFaint}` : 'rgba(255,215,0,0.03)',
          border: `1px solid ${expanded ? `${accent}33` : 'rgba(255,215,0,0.12)'}`,
          color: expanded ? accent : 'rgba(245,230,200,0.5)',
          fontSize: 13,
          transition: 'all 0.25s',
        }}
      >
        <span className="font-sans">Optional details</span>
        <span style={{ display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
          ▾
        </span>
      </button>

      {/* Optional fields */}
      <div
        style={{
          maxHeight: expanded ? '320px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div className="flex flex-col gap-4 pt-1">
          <div>
            <label className="block text-xs mb-2" style={{ color: 'rgba(245,230,200,0.4)', letterSpacing: '0.12em' }}>
              DATE OF BIRTH
            </label>
            <input
              className="vedic-input"
              type="date"
              value={data.birthdate ?? ''}
              onChange={e => onChange({ birthdate: e.target.value })}
              style={{ colorScheme: 'dark' }}
            />
            <p className="text-xs mt-1.5 font-crimson italic" style={{ color: 'rgba(245,230,200,0.3)' }}>
              Unlocks Rashi, Bhakoot &amp; Tārā analysis
            </p>
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: 'rgba(245,230,200,0.4)', letterSpacing: '0.12em' }}>
              AGE
            </label>
            <input
              className="vedic-input"
              type="number"
              min="1" max="120"
              placeholder="e.g. 28"
              value={data.age ?? ''}
              onChange={e => onChange({ age: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: 'rgba(245,230,200,0.4)', letterSpacing: '0.12em' }}>
              GENDER
            </label>
            <select
              className="vedic-input"
              value={data.gender ?? ''}
              onChange={e => onChange({ gender: e.target.value as PersonInfo['gender'] })}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male (Purusha)</option>
              <option value="female">Female (Prakriti)</option>
              <option value="other">Other / Non-binary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Lotus divider SVG ────────────────────────────────────────────────────────
function LotusDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2))' }} />
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.55 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="18" cy="9" rx="3.5" ry="8"
            fill="rgba(255,215,0,0.5)"
            transform={`rotate(${i * 45} 18 18)`}
          />
        ))}
        <circle cx="18" cy="18" r="4.5" fill="#FF9933" opacity="0.8" />
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,215,0,0.2))' }} />
    </div>
  )
}

// ── How-it-works chips ───────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: '✦', text: 'Enter names' },
    { icon: '◈', text: 'Add birthdate (optional)' },
    { icon: '∞', text: 'Reveal 8 Vedic metrics' },
    { icon: '★', text: 'Receive cosmic verdict' },
  ]
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(255,215,0,0.04)',
            border: '1px solid rgba(255,215,0,0.12)',
            color: 'rgba(245,230,200,0.45)',
            fontSize: 12,
          }}
        >
          <span style={{ color: 'rgba(255,215,0,0.6)', fontSize: 10 }}>{s.icon}</span>
          <span className="font-sans">{s.text}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main form ────────────────────────────────────────────────────────────────
export default function InputForm({ onSubmit }: InputFormProps) {
  const [p1, setP1] = useState<PersonInfo>({ name: '' })
  const [p2, setP2] = useState<PersonInfo>({ name: '' })
  const [exp1, setExp1] = useState(false)
  const [exp2, setExp2] = useState(false)

  const canSubmit = p1.name.trim().length >= 2 && p2.name.trim().length >= 2

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ ...p1, name: p1.name.trim() }, { ...p2, name: p2.name.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4">

      {/* Intro */}
      <div className="text-center mb-8 animate-fade-in-up delay-100">
        <p className="font-crimson text-xl italic" style={{ color: 'rgba(245,230,200,0.65)' }}>
          Enter two souls to reveal their cosmic connection
        </p>
        <p className="font-sans text-xs mt-1" style={{ color: 'rgba(245,230,200,0.3)', letterSpacing: '0.1em' }}>
          Only names required — birthdate unlocks deeper insights
        </p>
      </div>

      {/* How it works */}
      <div className="animate-fade-in-up delay-200">
        <HowItWorks />
      </div>

      {/* Two-column cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 animate-fade-in-up delay-300">
        <PersonCard
          label="First Soul" side="left"
          data={p1} onChange={d => setP1(prev => ({ ...prev, ...d }))}
          expanded={exp1} onToggleExpand={() => setExp1(e => !e)}
        />
        <PersonCard
          label="Second Soul" side="right"
          data={p2} onChange={d => setP2(prev => ({ ...prev, ...d }))}
          expanded={exp2} onToggleExpand={() => setExp2(e => !e)}
        />
      </div>

      {/* Lotus divider */}
      <div className="animate-fade-in-up delay-400">
        <LotusDivider />
      </div>

      {/* Submit button */}
      <div className="flex flex-col items-center gap-3 mt-5 animate-fade-in-up delay-500">
        <button
          type="submit"
          className="btn-primary"
          disabled={!canSubmit}
          style={{ minWidth: 240 }}
        >
          <span style={{ fontSize: 20, lineHeight: 1, marginRight: 2 }}>ॐ</span>
          Reveal Compatibility
        </button>
        {!canSubmit && (
          <p className="font-sans text-xs" style={{ color: 'rgba(245,230,200,0.28)', letterSpacing: '0.08em' }}>
            Enter both names to continue
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <p
        className="text-center mt-6 font-crimson text-sm italic animate-fade-in-up delay-600"
        style={{ color: 'rgba(245,230,200,0.25)' }}
      >
        Guided by the ancient science of Jyotish — for insight and reflection
      </p>
    </form>
  )
}
