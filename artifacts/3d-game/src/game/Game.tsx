import * as THREE from 'three';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { useGameStore } from './store';
import { LEVELS, getLevelObstacles, getLevelCollectibles } from './levels';
import { Room } from './components/Room';
import { Cockroach } from './components/Cockroach';
import { Obstacles } from './components/Obstacles';
import { Collectibles } from './components/Collectibles';
import { ExitZone } from './components/ExitZone';
import { FollowCamera } from './components/Camera';
import { HUD } from './components/HUD';
import { StartScreen, LevelCompleteScreen, GameOverScreen } from './components/StartScreen';
import type { CollectibleItem } from './types';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

const KEY_MAP = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
];

function GameScene() {
  const { level, collected, required, phase, collectItem } = useGameStore();
  const cockroachPos = useRef(new THREE.Vector3(0, 0.12, 0));
  const [posState, setPosState] = useState(new THREE.Vector3(0, 0.12, 0));
  const [items, setItems] = useState<CollectibleItem[]>([]);

  const config = LEVELS[level - 1];
  const obstacles = getLevelObstacles(level);

  // Re-initialize items when level changes
  useEffect(() => {
    setItems(getLevelCollectibles(level).map((item) => ({ ...item, collected: false })));
    cockroachPos.current = new THREE.Vector3(0, 0.12, (config?.roomSize.depth ?? 20) / 2 - 2.5);
    setPosState(cockroachPos.current.clone());
  }, [level]);

  const handlePositionChange = useCallback((pos: THREE.Vector3) => {
    cockroachPos.current.copy(pos);
    setPosState(pos.clone());
  }, []);

  const handleCollect = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, collected: true } : item))
    );
    collectItem();
  }, [collectItem]);

  if (!config || phase !== 'playing') return null;

  const allCollected = collected >= required;

  return (
    <>
      <color attach="background" args={[config.fogColor as THREE.ColorRepresentation]} />
      <fog attach="fog" args={[config.fogColor, config.fogNear, config.fogFar]} />
      <ambientLight intensity={config.ambientIntensity} color="#FFD080" />

      <FollowCamera target={posState} levelId={level} />
      <Room config={config} />
      <Cockroach config={config} onPositionChange={handlePositionChange} />
      <Obstacles obstacles={obstacles} cockroachPos={posState} />
      <Collectibles
        items={items}
        levelId={level}
        cockroachPos={posState}
        onCollect={handleCollect}
      />
      <ExitZone config={config} cockroachPos={posState} allCollected={allCollected} />
    </>
  );
}

export function Game() {
  const { phase } = useGameStore();

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0A0500', overflow: 'hidden' }}>
      {phase === 'menu' && <StartScreen />}
      {phase === 'level_complete' && <LevelCompleteScreen />}
      {phase === 'game_over' && <GameOverScreen />}

      {phase === 'playing' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <KeyboardControls map={KEY_MAP}>
            <Canvas
              shadows
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.85,
              }}
              camera={{
                fov: 65,
                near: 0.1,
                far: 100,
                position: [0, 4.5, 7],
              }}
              style={{ background: '#0A0500' }}
            >
              <GameScene />
            </Canvas>
          </KeyboardControls>
        </div>
      )}

      {phase === 'playing' && <HUD />}
    </div>
  );
}
