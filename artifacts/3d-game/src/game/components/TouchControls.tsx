import { useCallback, useEffect, useRef } from 'react';
import { setControl } from '../controls';
import type { ControlState } from '../controls';

interface DPadButtonProps {
  dir: keyof ControlState;
  label: string;
  style: React.CSSProperties;
}

function DPadButton({ dir, label, style }: DPadButtonProps) {
  const pressedRef = useRef(false);

  const startPress = useCallback(() => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    setControl(dir, true);
  }, [dir]);

  const endPress = useCallback(() => {
    pressedRef.current = false;
    setControl(dir, false);
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
        width: 60,
        height: 60,
        borderRadius: 10,
        background: 'rgba(255, 107, 53, 0.22)',
        border: '2px solid rgba(255, 107, 53, 0.55)',
        color: 'rgba(255,255,255,0.9)',
        fontSize: 24,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {label}
    </div>
  );
}

export function TouchControls() {
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        width: 192,
        height: 192,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Up */}
      <DPadButton dir="forward" label="▲" style={{ top: 0, left: 66, pointerEvents: 'auto' }} />
      {/* Down */}
      <DPadButton dir="back"    label="▼" style={{ bottom: 0, left: 66, pointerEvents: 'auto' }} />
      {/* Left */}
      <DPadButton dir="left"   label="◄" style={{ top: 66, left: 0, pointerEvents: 'auto' }} />
      {/* Right */}
      <DPadButton dir="right"  label="►" style={{ top: 66, right: 0, pointerEvents: 'auto' }} />
      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          top: 71,
          left: 71,
          width: 50,
          height: 50,
          borderRadius: 10,
          background: 'rgba(255,107,53,0.07)',
          border: '2px solid rgba(255,107,53,0.18)',
        }}
      />
    </div>
  );
}
