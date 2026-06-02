export type ControlState = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

const state: ControlState = {
  forward: false,
  back: false,
  left: false,
  right: false,
};

const CODE_MAP: Record<string, keyof ControlState> = {
  ArrowUp: 'forward',
  KeyW: 'forward',
  w: 'forward',
  ArrowDown: 'back',
  KeyS: 'back',
  s: 'back',
  ArrowLeft: 'left',
  KeyA: 'left',
  a: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  d: 'right',
};

export function getControls(): ControlState {
  return state;
}

export function setControl(key: keyof ControlState, value: boolean) {
  state[key] = value;
}

export function setupKeyboardControls(): () => void {
  const onDown = (e: KeyboardEvent) => {
    const dir = CODE_MAP[e.code] ?? CODE_MAP[e.key];
    if (dir) {
      state[dir] = true;
      e.preventDefault();
    }
  };

  const onUp = (e: KeyboardEvent) => {
    const dir = CODE_MAP[e.code] ?? CODE_MAP[e.key];
    if (dir) {
      state[dir] = false;
    }
  };

  window.addEventListener('keydown', onDown, { passive: false });
  window.addEventListener('keyup', onUp);

  return () => {
    window.removeEventListener('keydown', onDown);
    window.removeEventListener('keyup', onUp);
  };
}
