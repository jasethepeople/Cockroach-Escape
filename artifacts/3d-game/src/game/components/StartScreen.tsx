import { useGameStore } from '../store';

export function StartScreen() {
  const { startGame } = useGameStore();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #1A0F00 0%, #0A0500 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Courier New", monospace',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Cockroach silhouettes */}
      {[
        { x: '8%', y: '15%', rot: '30deg', size: '40px', opacity: 0.12 },
        { x: '88%', y: '20%', rot: '-20deg', size: '55px', opacity: 0.1 },
        { x: '5%', y: '70%', rot: '75deg', size: '35px', opacity: 0.08 },
        { x: '92%', y: '75%', rot: '-45deg', size: '48px', opacity: 0.1 },
        { x: '45%', y: '90%', rot: '10deg', size: '30px', opacity: 0.06 },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            fontSize: r.size,
            transform: `rotate(${r.rot})`,
            opacity: r.opacity,
          }}
        >
          🪳
        </div>
      ))}

      {/* Main content */}
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '0 24px' }}>
        {/* NYC skyline silhouette */}
        <div style={{ fontSize: '12px', color: 'rgba(255,100,0,0.5)', letterSpacing: '4px', marginBottom: '8px' }}>
          NYC · CDC CERTIFIED · INFESTATION CONFIRMED
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 'clamp(48px, 10vw, 72px)',
            fontWeight: 'bold',
            color: '#FF6B35',
            lineHeight: 0.9,
            textShadow: '0 0 30px rgba(255,107,53,0.6), 0 0 60px rgba(255,107,53,0.3)',
            letterSpacing: '-2px',
          }}
        >
          ROACH
        </div>
        <div
          style={{
            fontSize: 'clamp(48px, 10vw, 72px)',
            fontWeight: 'bold',
            color: '#FFD700',
            lineHeight: 0.9,
            textShadow: '0 0 30px rgba(255,215,0,0.5)',
            letterSpacing: '-2px',
            marginBottom: '12px',
          }}
        >
          RUNNER
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#888',
            letterSpacing: '4px',
            marginBottom: '32px',
          }}
        >
          A SURVIVAL GAME FOR THE UNDEAD-BY-HEART
        </div>

        {/* Story */}
        <div
          style={{
            background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px',
            color: '#CCC',
            fontSize: '12px',
            lineHeight: 1.7,
            letterSpacing: '0.5px',
            textAlign: 'left',
          }}
        >
          <span style={{ color: '#FF6B35', fontWeight: 'bold' }}>You are a cockroach.</span>
          <br />
          Deep in a crumbling NYC apartment, the lights just flicked on.
          <br />
          Scavenge what you need. Dodge what you can.
          <br />
          <span style={{ color: '#FFD700' }}>The city is your kingdom — if you survive.</span>
        </div>

        {/* Levels preview */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          {[
            { num: 1, name: 'KITCHEN', subtitle: 'Washington Heights' },
            { num: 2, name: 'BEDROOM', subtitle: 'Crown Heights' },
            { num: 3, name: 'THE ALLEY', subtitle: 'South Bronx' },
          ].map((l) => (
            <div
              key={l.num}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#FF6B35', fontSize: '18px', fontWeight: 'bold' }}>{l.num}</div>
              <div style={{ color: '#FFF', fontSize: '9px', letterSpacing: '2px', marginTop: '2px' }}>{l.name}</div>
              <div style={{ color: '#666', fontSize: '8px', letterSpacing: '1px', marginTop: '1px' }}>{l.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Play button */}
        <button
          onClick={startGame}
          style={{
            background: 'linear-gradient(135deg, #FF6B35, #FF3300)',
            border: 'none',
            borderRadius: '6px',
            padding: '14px 48px',
            color: '#FFF',
            fontSize: '16px',
            fontFamily: '"Courier New", monospace',
            fontWeight: 'bold',
            letterSpacing: '4px',
            cursor: 'pointer',
            boxShadow: '0 0 24px rgba(255,107,53,0.5)',
            transition: 'all 0.2s',
            marginBottom: '16px',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(255,107,53,0.8)';
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(255,107,53,0.5)';
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          ► SKITTER IN
        </button>

        <div style={{ color: '#444', fontSize: '10px', letterSpacing: '2px' }}>
          WASD / ARROW KEYS · AVOID HAZARDS · COLLECT SCRAPS
        </div>
      </div>
    </div>
  );
}

export function LevelCompleteScreen() {
  const { nextLevel, level, score } = useGameStore();
  const isLast = level >= 3;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Courier New", monospace',
        zIndex: 100,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 24px' }}>
        <div style={{ fontSize: '60px', marginBottom: '12px' }}>🪳</div>

        <div style={{ color: '#00FF88', fontSize: '10px', letterSpacing: '4px', marginBottom: '8px' }}>
          {isLast ? 'MISSION COMPLETE' : 'LEVEL CLEARED'}
        </div>

        <div
          style={{
            color: '#FFD700',
            fontSize: '40px',
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(255,215,0,0.6)',
            marginBottom: '8px',
          }}
        >
          {isLast ? 'YOU SURVIVED' : `LEVEL ${level}`}
        </div>

        {isLast && (
          <div style={{ color: '#CCC', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
            From kitchen scraps to alley glory —<br />
            you are the last survivor of the Bronx.
          </div>
        )}

        <div
          style={{
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '8px',
            padding: '12px 24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ color: '#888', fontSize: '10px', letterSpacing: '3px' }}>SCORE</div>
          <div style={{ color: '#FFD700', fontSize: '32px', fontWeight: 'bold' }}>
            {score.toString().padStart(6, '0')}
          </div>
        </div>

        <button
          onClick={nextLevel}
          style={{
            background: isLast
              ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
              : 'linear-gradient(135deg, #00FF88, #00AA55)',
            border: 'none',
            borderRadius: '6px',
            padding: '14px 40px',
            color: '#000',
            fontSize: '14px',
            fontFamily: '"Courier New", monospace',
            fontWeight: 'bold',
            letterSpacing: '3px',
            cursor: 'pointer',
            boxShadow: isLast ? '0 0 24px rgba(255,215,0,0.5)' : '0 0 24px rgba(0,255,136,0.5)',
          }}
        >
          {isLast ? '► PLAY AGAIN' : '► NEXT LEVEL'}
        </button>
      </div>
    </div>
  );
}

export function GameOverScreen() {
  const { reset, score } = useGameStore();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(60,0,0,0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Courier New", monospace',
        zIndex: 100,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px', transform: 'rotate(180deg)', display: 'inline-block' }}>🪳</div>

        <div style={{ color: '#FF2222', fontSize: '10px', letterSpacing: '5px', marginBottom: '8px' }}>
          SQUASHED
        </div>

        <div
          style={{
            color: '#FF4444',
            fontSize: '48px',
            fontWeight: 'bold',
            textShadow: '0 0 30px rgba(255,50,50,0.6)',
            marginBottom: '4px',
          }}
        >
          GAME OVER
        </div>

        <div style={{ color: '#AA4444', fontSize: '13px', marginBottom: '20px', letterSpacing: '1px' }}>
          The exterminator wins this round.
        </div>

        <div
          style={{
            background: 'rgba(255,50,50,0.1)',
            border: '1px solid rgba(255,50,50,0.3)',
            borderRadius: '8px',
            padding: '12px 24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ color: '#888', fontSize: '10px', letterSpacing: '3px' }}>FINAL SCORE</div>
          <div style={{ color: '#FF8888', fontSize: '32px', fontWeight: 'bold' }}>
            {score.toString().padStart(6, '0')}
          </div>
        </div>

        <button
          onClick={reset}
          style={{
            background: 'linear-gradient(135deg, #FF4444, #AA0000)',
            border: 'none',
            borderRadius: '6px',
            padding: '14px 40px',
            color: '#FFF',
            fontSize: '14px',
            fontFamily: '"Courier New", monospace',
            fontWeight: 'bold',
            letterSpacing: '3px',
            cursor: 'pointer',
            boxShadow: '0 0 24px rgba(255,50,50,0.4)',
          }}
        >
          ► TRY AGAIN
        </button>
      </div>
    </div>
  );
}
