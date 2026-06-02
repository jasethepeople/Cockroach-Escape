import type { LevelConfig, Obstacle, CollectibleItem } from './types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'THE KITCHEN',
    subtitle: 'Washington Heights, 3AM',
    requiredCollectibles: 5,
    roomSize: { width: 28, depth: 22, height: 8 },
    floorColor: '#8B7355',
    wallColor: '#C8B99A',
    ceilingColor: '#B0A080',
    ambientIntensity: 0.25,
    fogColor: '#2a1f10',
    fogNear: 15,
    fogFar: 40,
  },
  {
    id: 2,
    name: 'THE BEDROOM',
    subtitle: 'Crown Heights, 2AM',
    requiredCollectibles: 4,
    roomSize: { width: 26, depth: 24, height: 9 },
    floorColor: '#5C4A3A',
    wallColor: '#8B7B6B',
    ceilingColor: '#6B5B4B',
    ambientIntensity: 0.15,
    fogColor: '#15100a',
    fogNear: 12,
    fogFar: 35,
  },
  {
    id: 3,
    name: 'THE ALLEY',
    subtitle: 'South Bronx, Midnight',
    requiredCollectibles: 6,
    roomSize: { width: 14, depth: 40, height: 20 },
    floorColor: '#3A3A3A',
    wallColor: '#4A4A4A',
    ceilingColor: '#1A1A2E',
    ambientIntensity: 0.1,
    fogColor: '#0a0a15',
    fogNear: 10,
    fogFar: 45,
  },
];

export function getLevelObstacles(level: number): Obstacle[] {
  if (level === 1) {
    return [
      {
        id: 'shoe1',
        type: 'shoe',
        position: [0, 0, 2],
        size: [2.5, 1.5, 5],
        speed: 1.2,
        range: 0,
        axis: 'y',
        phase: 0,
      },
      {
        id: 'shoe2',
        type: 'shoe',
        position: [-5, 0, -3],
        size: [2.5, 1.5, 5],
        speed: 0.9,
        range: 0,
        axis: 'y',
        phase: Math.PI,
      },
      {
        id: 'can1',
        type: 'can',
        position: [4, 0, 0],
        size: [1.2, 1.8, 1.2],
        speed: 3.0,
        range: 5,
        axis: 'x',
        phase: 0,
      },
      {
        id: 'can2',
        type: 'can',
        position: [-6, 0, 4],
        size: [1.2, 1.8, 1.2],
        speed: 2.5,
        range: 4,
        axis: 'z',
        phase: 1.2,
      },
    ];
  }

  if (level === 2) {
    return [
      {
        id: 'slipper1',
        type: 'slipper',
        position: [2, 0, 0],
        size: [3, 1, 7],
        speed: 1.5,
        range: 0,
        axis: 'y',
        phase: 0,
      },
      {
        id: 'slipper2',
        type: 'slipper',
        position: [-4, 0, 5],
        size: [3, 1, 7],
        speed: 1.0,
        range: 0,
        axis: 'y',
        phase: Math.PI * 0.7,
      },
      {
        id: 'newspaper1',
        type: 'newspaper',
        position: [5, 0, -4],
        size: [4, 0.4, 5],
        speed: 1.8,
        range: 0,
        axis: 'y',
        phase: 1.5,
      },
    ];
  }

  if (level === 3) {
    return [
      {
        id: 'rat1',
        type: 'rat',
        position: [0, 0, 0],
        size: [2, 1.5, 4],
        speed: 2.5,
        range: 6,
        axis: 'x',
        phase: 0,
      },
      {
        id: 'rain1',
        type: 'rain',
        position: [-3, 0, 5],
        size: [1.5, 0.5, 1.5],
        speed: 2.0,
        range: 0,
        axis: 'y',
        phase: 0,
      },
      {
        id: 'rain2',
        type: 'rain',
        position: [3, 0, -2],
        size: [1.5, 0.5, 1.5],
        speed: 1.7,
        range: 0,
        axis: 'y',
        phase: 1.0,
      },
      {
        id: 'can3',
        type: 'can',
        position: [2, 0, 8],
        size: [1.2, 1.8, 1.2],
        speed: 2.8,
        range: 5,
        axis: 'x',
        phase: 0.5,
      },
    ];
  }

  return [];
}

export function getLevelCollectibles(level: number): CollectibleItem[] {
  if (level === 1) {
    return [
      { id: 'c1', position: [-6, 0.1, -6], collected: false },
      { id: 'c2', position: [5, 0.1, -7], collected: false },
      { id: 'c3', position: [-7, 0.1, 4], collected: false },
      { id: 'c4', position: [7, 0.1, 2], collected: false },
      { id: 'c5', position: [2, 0.1, -5], collected: false },
    ];
  }
  if (level === 2) {
    return [
      { id: 'c1', position: [-7, 0.1, -8], collected: false },
      { id: 'c2', position: [6, 0.1, -6], collected: false },
      { id: 'c3', position: [-5, 0.1, 7], collected: false },
      { id: 'c4', position: [8, 0.1, 8], collected: false },
    ];
  }
  if (level === 3) {
    return [
      { id: 'c1', position: [-3, 0.1, -12], collected: false },
      { id: 'c2', position: [3, 0.1, -8], collected: false },
      { id: 'c3', position: [-2, 0.1, 0], collected: false },
      { id: 'c4', position: [4, 0.1, 8], collected: false },
      { id: 'c5', position: [-4, 0.1, 12], collected: false },
      { id: 'c6', position: [2, 0.1, 16], collected: false },
    ];
  }
  return [];
}
