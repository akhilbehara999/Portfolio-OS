import React from 'react';

export const GradientFlow: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradient-flow 15s ease infinite',
      zIndex: -1,
    }}
  >
    <style>{`
      @keyframes gradient-flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </div>
);

export const ParticleField: React.FC = () => {
  // CSS-only particles using box-shadows is efficient
  // We'll generate the shadows once
  const generateShadows = (n: number) => {
    let value = '';
    for (let i = 0; i < n; i++) {
      value += `${Math.random() * 100}vw ${Math.random() * 100}vh #fff`;
      if (i < n - 1) value += ', ';
    }
    return value;
  };

  const [shadows, setShadows] = React.useState({
    small: '',
    medium: '',
    big: '',
  });

  React.useEffect(() => {
    setShadows({
      small: generateShadows(700),
      medium: generateShadows(200),
      big: generateShadows(100),
    });
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      <div className="stars-1" style={{ '--shadows': shadows.small } as React.CSSProperties} />
      <div className="stars-2" style={{ '--shadows': shadows.medium } as React.CSSProperties} />
      <div className="stars-3" style={{ '--shadows': shadows.big } as React.CSSProperties} />

      <style>{`
        .stars-1, .stars-2, .stars-3 {
          position: absolute;
          width: 1px;
          height: 1px;
          background: transparent;
          border-radius: 50%;
          box-shadow: var(--shadows);
        }

        .stars-1:after, .stars-2:after, .stars-3:after {
          content: " ";
          position: absolute;
          top: 100vh;
          width: 1px;
          height: 1px;
          background: transparent;
          border-radius: 50%;
          box-shadow: var(--shadows);
        }

        .stars-1 { animation: animStar 50s linear infinite; }
        .stars-2 { animation: animStar 100s linear infinite; }
        .stars-3 { animation: animStar 150s linear infinite; }

        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-100vh); }
        }
      `}</style>
    </div>
  );
};

export const Wave: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%)',
      zIndex: -1,
    }}
  >
    <svg
      className="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '15vh',
        minHeight: '100px',
        maxHeight: '150px',
      }}
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className="parallax">
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
      </g>
    </svg>
    <style>{`
      .parallax > use {
        animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
      }
      .parallax > use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
      }
      .parallax > use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
      }
      .parallax > use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
      }
      .parallax > use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
      }
      @keyframes move-forever {
        0% { transform: translate3d(-90px,0,0); }
        100% { transform: translate3d(85px,0,0); }
      }
    `}</style>
  </div>
);

export const Aurora: React.FC = () => (
  <div
    style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden', zIndex: -1 }}
  >
    <div className="aurora-1" />
    <div className="aurora-2" />
    <div className="aurora-3" />
    <style>{`
      .aurora-1, .aurora-2, .aurora-3 {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        opacity: 0.5;
        filter: blur(50px);
        animation: aurora-move 20s infinite alternate;
      }
      .aurora-1 {
        background: linear-gradient(45deg, #00ff00, #0000ff);
        animation-duration: 15s;
      }
      .aurora-2 {
        background: linear-gradient(135deg, #ff00ff, #00ffff);
        animation-duration: 25s;
        animation-direction: alternate-reverse;
      }
      .aurora-3 {
        background: radial-gradient(circle, #ffff00, transparent);
        animation-duration: 30s;
      }
      @keyframes aurora-move {
        0% { transform: rotate(0deg) translate(0, 0); }
        100% { transform: rotate(10deg) translate(50px, 50px); }
      }
    `}</style>
  </div>
);

export const MatrixRain: React.FC = () => {
  // Creating a simplified CSS matrix effect using columns
  // For a truly performant full-screen matrix rain without canvas,
  // we can use background-image with repeating characters or a few columns of text.
  // Here we use a few columns for the effect.

  const [columns, setColumns] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    const cols = Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="matrix-col"
        style={{
          left: `${i * 5}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
        }}
      >
        {'01'
          .repeat(20)
          .split('')
          .map((_, j) => (
            <span key={j} style={{ opacity: Math.random() }}>
              {Math.random() > 0.5 ? '1' : '0'}
            </span>
          ))}
      </div>
    ));
    setColumns(cols);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        fontFamily: 'monospace',
        zIndex: -1,
      }}
    >
      {columns}
      <style>{`
        .matrix-col {
          position: absolute;
          top: -100%;
          width: 5%;
          display: flex;
          flex-direction: column;
          color: #0f0;
          font-size: 1.2rem;
          text-align: center;
          text-shadow: 0 0 5px #0f0;
          animation: matrix-fall linear infinite;
        }
        @keyframes matrix-fall {
          0% { top: -100%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};
