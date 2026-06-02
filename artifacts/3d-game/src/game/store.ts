import { create } from 'zustand';
import type { GamePhase } from './types';

interface GameStore {
  phase: GamePhase;
  level: number;
  score: number;
  health: number;
  collected: number;
  required: number;
  invincible: boolean;

  setPhase: (phase: GamePhase) => void;
  setLevel: (level: number) => void;
  collectItem: () => void;
  takeDamage: () => void;
  addScore: (pts: number) => void;
  nextLevel: () => void;
  reset: () => void;
  startGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  level: 1,
  score: 0,
  health: 3,
  collected: 0,
  required: 5,
  invincible: false,

  setPhase: (phase) => set({ phase }),
  setLevel: (level) => set({ level }),

  collectItem: () => {
    const { collected, required, score } = get();
    const next = collected + 1;
    set({ collected: next, score: score + 100 });
    if (next >= required) {
      set({ phase: 'level_complete', score: score + 100 + 500 });
    }
  },

  takeDamage: () => {
    const { health, invincible } = get();
    if (invincible) return;
    const newHealth = health - 1;
    set({ health: newHealth, invincible: true });
    if (newHealth <= 0) {
      set({ phase: 'game_over' });
    }
    setTimeout(() => set({ invincible: false }), 2000);
  },

  addScore: (pts) => set((s) => ({ score: s.score + pts })),

  nextLevel: () => {
    const { level } = get();
    const nextLevel = level + 1;
    if (nextLevel > 3) {
      set({ phase: 'game_over', score: get().score + 1000 });
    } else {
      set({
        phase: 'playing',
        level: nextLevel,
        collected: 0,
        required: nextLevel === 2 ? 4 : 5,
        health: Math.min(get().health + 1, 3),
      });
    }
  },

  reset: () =>
    set({
      phase: 'menu',
      level: 1,
      score: 0,
      health: 3,
      collected: 0,
      required: 5,
      invincible: false,
    }),

  startGame: () =>
    set({
      phase: 'playing',
      level: 1,
      score: 0,
      health: 3,
      collected: 0,
      required: 5,
      invincible: false,
    }),
}));
