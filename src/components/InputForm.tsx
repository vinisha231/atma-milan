import { useState, FormEvent } from 'react'
import { PersonInfo } from '../types'

interface InputFormProps {
  onSubmit: (p1: PersonInfo, p2: PersonInfo) => void
}

function PersonFields({
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
  const accentColor = side === 'left' ? '#FF6B2B' : '#FF69B4'

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
        <span className="font-cinzel text-xs tracking-widest uppercase"
          style={{ color: accentColor, letterSpacing: '0.18em' }}>
          {label}
        </span>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs mb-2 font-sans"
          style={{ color: 'rgba(245,230,200,0.55)', letterSpacing: '0.1em' }}>
          FULL NAME <span style={{ color: accentColor }}>*</span>
        </label>
        <input
          className="vedic-input"
          type="text"
          placeholder={side === 'left' ? 'Your name…' : 'Their name…'}
          value={data.name}
          onChange={e => onChange({ name: e.target.value })}
          required
          autoComplete="off"
        />
      </div>

      {/* Optional details toggle */}
      <button
        type="button"
        className="btn-ghost text-left w-full justify-between"
        style={{ fontSize: 13 }}
        onClick={onToggleExpand}
      >
        <span>Optional details</span>
        <span style={{ transition: 'transform 0.3s', display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>

      {/* Optional fields */}
      {expanded && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          {/* Birthdate */}
          <div>
            <label className="block text-xs mb-2 font-sans"
              style={{ color: 'rgba(245,230,200,0.55)', letterSpacing: '0.1em' }}>
              DATE OF BIRTH
            </label>
            <input
              className="vedic-input"
              type="date"
              value={data.birthdate ?? ''}
              onChange={e => onChange({ birthdate: e.target.value })}
              style={{ colorScheme: 'dark' }}
            />
            <p className="text-xs mt-1" style={{ color: 'rgba(245,230,200,0.35)' }}>
              Unlocks Rashi, Bhakoot & Tārā analysis
            </p>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs mb-2 font-sans"
              style={{ color: 'rgba(245,230,200,0.55)', letterSpacing: '0.1em' }}>
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

          {/* Gender */}
          <div>
            <label className="block text-xs mb-2 font-sans"
              style={{ color: 'rgba(245,230,200,0.55)', letterSpacing: '0.1em' }}>
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
      )}
    </div>
  )
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [p1, setP1] = useState<PersonInfo>({ name: '' })
  const [p2, setP2] = useState<PersonInfo>({ name: '' })
  const [exp1, setExp1] = useState(false)
  const [exp2, setExp2] = useState(false)

  const canSubmit = p1.name.trim().length >= 2 && p2.name.trim().length >= 2

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(
      { ...p1, name: p1.name.trim() },
      { ...p2, name: p2.name.trim() },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      {/* Intro text */}
      <p className="text-center font-crimson text-lg mb-8 animate-fade-in-up delay-100"
        style={{ color: 'rgba(245,230,200,0.6)' }}>
        Enter two souls to reveal their cosmic connection
      </p>

      {/* Two-column person inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 animate-fade-in-up delay-200">
        <PersonFields
          label="First Soul"
          side="left"
          data={p1}
          onChange={d => setP1(prev => ({ ...prev, ...d }))}
          expanded={exp1}
          onToggleExpand={() => setExp1(e => !e)}
        />

        <PersonFields
          label="Second Soul"
          side="right"
          data={p2}
          onChange={d => setP2(prev => ({ ...prev, ...d }))}
          expanded={exp2}
          onToggleExpand={() => setExp2(e => !e)}
        />
      </div>

      {/* Decorative connector */}
      <div className="flex items-center justify-center gap-3 mb-6"
        style={{ color: 'rgba(255,215,0,0.35)', fontSize: 11, letterSpacing: '0.2em' }}>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2))' }} />
        <span className="font-cinzel">MILAN</span>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,215,0,0.2))' }} />
      </div>

      {/* Submit */}
      <div className="flex justify-center animate-fade-in-up delay-300">
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>ॐ</span>
          Reveal Compatibility
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center mt-5 font-crimson text-sm italic animate-fade-in-up delay-400"
        style={{ color: 'rgba(245,230,200,0.3)' }}>
        Guided by the ancient science of Jyotish — for insight and reflection
      </p>
    </form>
  )
}
