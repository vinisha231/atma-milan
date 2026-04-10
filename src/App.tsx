import { useState } from 'react'
import { PersonInfo, CompatibilityResult } from './types'
import { calculateCompatibility } from './utils/compatibility'
import Background from './components/Background'
import Header from './components/Header'
import InputForm from './components/InputForm'
import Results from './components/Results'

type Step = 'form' | 'results'

export default function App() {
  const [step, setStep] = useState<Step>('form')
  const [result, setResult] = useState<CompatibilityResult | null>(null)

  function handleSubmit(p1: PersonInfo, p2: PersonInfo) {
    const r = calculateCompatibility(p1, p2)
    setResult(r)
    setStep('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setStep('form')
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Animated starfield + mandala background */}
      <Background />

      {/* Page content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-start py-8 px-2">
          {step === 'form' && (
            <InputForm onSubmit={handleSubmit} />
          )}
          {step === 'results' && result && (
            <Results result={result} onReset={handleReset} />
          )}
        </main>

        <footer className="text-center py-6 px-4">
          <p className="font-sans text-xs" style={{ color: 'rgba(245,230,200,0.2)', letterSpacing: '0.1em' }}>
            ॐ &nbsp; Guided by Jyotish — the ancient Hindu science of light &nbsp; ॐ
          </p>
        </footer>
      </div>
    </div>
  )
}
