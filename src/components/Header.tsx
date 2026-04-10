interface HeaderProps {
  minimal?: boolean
}

export default function Header({ minimal = false }: HeaderProps) {
  return (
    <header className={`text-center relative ${minimal ? 'py-6' : 'py-14 pb-6'}`}>

      {!minimal && (
        <>
          {/* ── Om symbol with decorative halo ─── */}
          <div className="relative inline-block mb-4">
            {/* Outer ring of 12 dots */}
            <svg
              className="absolute inset-0 m-auto animate-spin-slow"
              width="160" height="160"
              viewBox="0 0 160 160"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 - 90) * (Math.PI / 180)
                return (
                  <circle
                    key={i}
                    cx={80 + 70 * Math.cos(a)}
                    cy={80 + 70 * Math.sin(a)}
                    r={i % 3 === 0 ? 3 : 1.8}
                    fill="#FFD700"
                    opacity={i % 3 === 0 ? 0.7 : 0.35}
                  />
                )
              })}
            </svg>

            {/* Inner ring of 8 petals */}
            <svg
              className="absolute inset-0 m-auto animate-spin-slow-ccw"
              width="120" height="120"
              viewBox="0 0 120 120"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i * 45 - 90) * (Math.PI / 180)
                return (
                  <ellipse
                    key={i}
                    cx={60 + 46 * Math.cos(a)}
                    cy={60 + 46 * Math.sin(a)}
                    rx="4" ry="9"
                    fill="#FF9933"
                    opacity="0.25"
                    transform={`rotate(${i * 45} ${60 + 46 * Math.cos(a)} ${60 + 46 * Math.sin(a)})`}
                  />
                )
              })}
            </svg>

            {/* The Om */}
            <div
              className="relative om-glow animate-float font-crimson select-none"
              style={{
                fontSize: 96,
                lineHeight: 1,
                color: '#FFD700',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
              aria-hidden="true"
            >
              ॐ
            </div>
          </div>

          {/* ── Title ─── */}
          <h1
            className="font-cinzel font-black text-gold-gradient animate-fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 4rem)',
              letterSpacing: '0.14em',
              lineHeight: 1.1,
            }}
          >
            Ātmā Milan
          </h1>

          {/* Sanskrit subtitle */}
          <p
            className="font-crimson italic animate-fade-in-up delay-200 mt-2"
            style={{ fontSize: '1.35rem', color: 'rgba(255,215,0,0.65)' }}
          >
            आत्मा मिलन — Soul Union
          </p>

          {/* Ornate divider */}
          <div className="flex items-center justify-center gap-3 mt-5 mb-4 animate-fade-in-up delay-300">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4))' }} />
            <span style={{ color: 'rgba(255,215,0,0.55)', fontSize: 9 }}>✦</span>
            <div className="h-px w-3" style={{ background: 'rgba(255,215,0,0.25)' }} />
            <span style={{ color: 'rgba(255,107,43,0.7)', fontSize: 16 }}>❀</span>
            <div className="h-px w-3" style={{ background: 'rgba(255,215,0,0.25)' }} />
            <span style={{ color: 'rgba(255,215,0,0.55)', fontSize: 9 }}>✦</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,215,0,0.4))' }} />
          </div>

          {/* Tagline */}
          <p
            className="font-sans uppercase tracking-widest animate-fade-in-up delay-400"
            style={{ fontSize: 11, color: 'rgba(245,230,200,0.45)', letterSpacing: '0.28em' }}
          >
            Vedic Soul Compatibility
          </p>

          {/* Pill tags */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap animate-fade-in-up delay-500">
            {['Ashtakoota', 'Jyotish', 'Chaldean'].map(tag => (
              <span
                key={tag}
                className="font-sans text-xs px-3 py-1 rounded-full"
                style={{
                  border: '1px solid rgba(255,215,0,0.18)',
                  color: 'rgba(245,230,200,0.38)',
                  background: 'rgba(255,215,0,0.04)',
                  letterSpacing: '0.08em',
                  fontSize: 10,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}

      {minimal && (
        <div className="flex items-center justify-center gap-3">
          <span className="om-glow font-crimson select-none" style={{ fontSize: 36, color: '#FFD700' }} aria-hidden="true">ॐ</span>
          <h1 className="font-cinzel font-bold text-gold-gradient" style={{ fontSize: '1.6rem', letterSpacing: '0.12em' }}>
            Ātmā Milan
          </h1>
        </div>
      )}
    </header>
  )
}
