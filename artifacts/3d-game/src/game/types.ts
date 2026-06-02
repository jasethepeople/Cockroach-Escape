export type GamePhase = 'menu' | 'playing' | 'level_complete' | 'game_over';

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  requiredCollectibles: number;
  roomSize: { width: number; depth: number; height: number };
  floorColor: string;
  wallColor: string;
  ceilingColor: string;
  ambientIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

export interface Obstacle {
  id: string;
  type: 'shoe' | 'bottle' | 'newspaper' | 'rat' | 'rain' | 'slipper' | 'can';
  position: [number, number, number];
  size: [number, number, number];
  speed: number;
  range: number;
  axis: 'x' | 'z' | 'y';
  phase: number;
}

export interface CollectibleItem {
  id: string;
  position: [number, number, number];
  collected: boolean;
}
