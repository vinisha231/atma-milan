interface HeaderProps {
  minimal?: boolean
}

export default function Header({ minimal = false }: HeaderProps) {
  return (
    <header className={`text-center ${minimal ? 'py-6' : 'py-16 pb-8'}`}>
      {/* Om Symbol */}
      <div
        className={`om-glow animate-float font-crimson select-none leading-none ${minimal ? 'text-5xl mb-2' : 'text-8xl mb-6'}`}
        style={{ color: '#FFD700' }}
        aria-hidden="true"
      >
        ॐ
      </div>

      {/* Title */}
      <h1
        className={`font-cinzel font-black tracking-widest text-gold-gradient ${minimal ? 'text-2xl' : 'text-5xl sm:text-6xl mb-3'}`}
        style={{ letterSpacing: '0.12em' }}
      >
        Ātmā Milan
      </h1>

      {!minimal && (
        <>
          {/* Tagline */}
          <p className="font-crimson text-xl italic animate-fade-in-up delay-200"
            style={{ color: 'rgba(255,215,0,0.7)' }}>
            आत्मा मिलन
          </p>

          {/* Divider */}
          <div className="divine-divider max-w-xs mx-auto mt-5 mb-4">
            <span style={{ color: 'rgba(255,215,0,0.4)', fontSize: 12 }}>✦</span>
          </div>

          {/* Subtitle */}
          <p className="font-sans text-sm tracking-[0.2em] uppercase animate-fade-in-up delay-300"
            style={{ color: 'rgba(245,230,200,0.5)', letterSpacing: '0.22em' }}>
            Vedic Soul Compatibility
          </p>
        </>
      )}
    </header>
  )
}
