import { useGameStore } from '../store';
import { LEVELS } from '../levels';
import { TouchControls } from './TouchControls';

export function HUD() {
  const { health, collected, required, score, level, invincible } = useGameStore();
  const config = LEVELS[level - 1];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        fontFamily: '"Courier New", monospace',
        zIndex: 10,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Level info */}
        <div>
          <div style={{ color: '#FF6B35', fontSize: '11px', letterSpacing: '3px', fontWeight: 'bold' }}>
            LEVEL {level} / 3
          </div>
          <div style={{ color: '#FFF', fontSize: '18px', fontWeight: 'bold', lineHeight: 1.1 }}>
            {config?.name}
          </div>
          <div style={{ color: '#AAA', fontSize: '10px', letterSpacing: '2px' }}>
            {config?.subtitle}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#FFD700', fontSize: '10px', letterSpacing: '3px' }}>SCORE</div>
          <div style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>
            {score.toString().padStart(5, '0')}
          </div>
        </div>

        {/* Health */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#FF4444', fontSize: '10px', letterSpacing: '3px', marginBottom: '4px' }}>
            LIVES
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  fontSize: '22px',
                  filter: i < health ? 'none' : 'grayscale(1) opacity(0.25)',
                  transform: `scale(${invincible && i < health ? '0.8' : '1'})`,
                  transition: 'all 0.15s',
                  display: 'inline-block',
                }}
              >
                🪳
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Collectibles counter */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '18px',
          transform: 'translateY(-50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ color: 'rgba(255,215,0,0.8)', fontSize: '10px', letterSpacing: '2px' }}>SCAVENGED</div>
        <div
          style={{
            color: '#FFD700',
            fontSize: '36px',
            fontWeight: 'bold',
            textShadow: '0 0 12px #FFD700',
            lineHeight: 1,
          }}
        >
          {collected}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>/ {required}</div>

        {/* Progress dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px', alignItems: 'center' }}>
          {Array.from({ length: required }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: i < collected ? '#FFD700' : 'rgba(255,215,0,0.2)',
                boxShadow: i < collected ? '0 0 6px #FFD700' : 'none',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls hint (bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '10px',
          letterSpacing: '2px',
          textAlign: 'center',
        }}
      >
        {window.matchMedia('(pointer: coarse)').matches ? 'USE D-PAD TO MOVE' : 'WASD / ARROW KEYS TO MOVE'}
      </div>

      {/* Objective hint */}
      {collected < required && (
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,165,0,0.4)',
            borderRadius: '4px',
            padding: '5px 14px',
            color: '#FFA500',
            fontSize: '11px',
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
          }}
        >
          COLLECT {required - collected} MORE{' '}
          {level === 1 ? 'CRUMBS' : level === 2 ? 'SCRAPS' : 'GARBAGE'}
        </div>
      )}

      {collected >= required && (
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,80,0,0.7)',
            border: '1px solid rgba(0,255,100,0.6)',
            borderRadius: '4px',
            padding: '5px 14px',
            color: '#00FF88',
            fontSize: '11px',
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
            animation: 'pulse 1s infinite',
          }}
        >
          ► REACH THE EXIT!
        </div>
      )}

      {/* Invincibility flash */}
      {invincible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,0,0,0.12)',
            pointerEvents: 'none',
          }}
        />
      )}

      <TouchControls />
    </div>
  );
}
