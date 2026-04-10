export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 20% 20%, #1a0533 0%, #0a0014 45%, #0d1225 100%)' }} />

      {/* Subtle star field */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gold"
          style={{
            width: Math.random() > 0.8 ? 2 : 1,
            height: Math.random() > 0.8 ? 2 : 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
            animation: `pulse ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
          }}
        />
      ))}

      {/* Outer mandala ring */}
      <div
        className="absolute animate-spin-slow"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700,
          opacity: 0.04,
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="100" y1="100" x2="100" y2="5"
              stroke="#FFD700" strokeWidth="0.5"
              transform={`rotate(${i * 15} 100 100)`}
            />
          ))}
          {[85, 70, 55, 40, 25, 10].map(r => (
            <circle key={r} cx="100" cy="100" r={r} stroke="#FFD700" strokeWidth="0.4" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <polygon
              key={i}
              points="100,15 106,8 100,1 94,8"
              fill="#FFD700"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Inner mandala ring (counter-rotating) */}
      <div
        className="absolute animate-spin-slow-ccw"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480, height: 480,
          opacity: 0.05,
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100" y1="100" x2="100" y2="10"
              stroke="#FF9933" strokeWidth="0.6"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
          {[75, 55, 35].map(r => (
            <circle key={r} cx="100" cy="100" r={r} stroke="#FF9933" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <polygon
              key={i}
              points="100,20 105,14 100,8 95,14"
              fill="#FF9933"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Corner lotus decorations */}
      {[
        { top: '-60px', left: '-60px', rotateDeg: 0 },
        { top: '-60px', right: '-60px', rotateDeg: 90 },
        { bottom: '-60px', left: '-60px', rotateDeg: 270 },
        { bottom: '-60px', right: '-60px', rotateDeg: 180 },
      ].map(({ rotateDeg, ...pos }, i) => (
        <div
          key={i}
          className="absolute opacity-5"
          style={{ ...pos, width: 200, height: 200 } as React.CSSProperties}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${rotateDeg}deg)` }}>
            {Array.from({ length: 8 }).map((_, j) => (
              <ellipse
                key={j}
                cx="50" cy="25" rx="10" ry="22"
                fill="#FFD700"
                transform={`rotate(${j * 45} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="12" fill="#FF9933" />
          </svg>
        </div>
      ))}

      {/* Gradient vignette overlay */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,0,20,0.7) 100%)',
        }}
      />
    </div>
  )
}
