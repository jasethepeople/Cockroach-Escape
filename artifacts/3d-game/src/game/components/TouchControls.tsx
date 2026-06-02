import { useCallback, useEffect, useRef } from 'react';

const KEY_MAP: Record<string, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};

function dispatch(key: string, type: 'keydown' | 'keyup') {
  window.dispatchEvent(
    new KeyboardEvent(type, {
      key,
      code: key === 'ArrowUp' ? 'KeyW'
        : key === 'ArrowDown' ? 'KeyS'
        : key === 'ArrowLeft' ? 'KeyA'
        : 'KeyD',
      bubbles: true,
      cancelable: true,
    })
  );
}

interface DPadButtonProps {
  dir: 'up' | 'down' | 'left' | 'right';
  label: string;
  style: React.CSSProperties;
}

function DPadButton({ dir, label, style }: DPadButtonProps) {
  const pressedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPress = useCallback(() => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    dispatch(KEY_MAP[dir], 'keydown');
    // Repeat keydown while held (some browsers throttle repeat)
    intervalRef.current = setInterval(() => {
      if (pressedRef.current) dispatch(KEY_MAP[dir], 'keydown');
    }, 50);
  }, [dir]);

  const endPress = useCallback(() => {
    pressedRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(KEY_MAP[dir], 'keyup');
  }, [dir]);

  useEffect(() => () => endPress(), [endPress]);

  return (
    <div
      onPointerDown={(e) => { e.preventDefault(); startPress(); }}
      onPointerUp={(e) => { e.preventDefault(); endPress(); }}
      onPointerCancel={(e) => { e.preventDefault(); endPress(); }}
      onPointerLeave={(e) => { e.preventDefault(); endPress(); }}
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 8,
        background: 'rgba(255, 107, 53, 0.18)',
        border: '2px solid rgba(255, 107, 53, 0.5)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 22,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        cursor: 'pointer',
        transition: 'background 0.08s',
        ...style,
      }}
    >
      {label}
    </div>
  );
}

export function TouchControls() {
  // Only show on touch-capable devices
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return null;

  const PAD = 20; // bottom offset
  const CENTER_X = 90; // left offset of d-pad center

  return (
    <div
      style={{
        position: 'fixed',
        bottom: PAD,
        left: 0,
        width: '100vw',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* D-pad cluster */}
      <div style={{ position: 'absolute', left: CENTER_X - 60, bottom: 0, width: 180, height: 180 }}>
        {/* Up */}
        <DPadButton dir="up" label="▲" style={{ top: 0, left: 62 }} />
        {/* Down */}
        <DPadButton dir="down" label="▼" style={{ bottom: 0, left: 62 }} />
        {/* Left */}
        <DPadButton dir="left" label="◄" style={{ top: 62, left: 0 }} />
        {/* Right */}
        <DPadButton dir="right" label="►" style={{ top: 62, right: 0 }} />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: 67,
            left: 67,
            width: 46,
            height: 46,
            borderRadius: 8,
            background: 'rgba(255,107,53,0.08)',
            border: '2px solid rgba(255,107,53,0.2)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
