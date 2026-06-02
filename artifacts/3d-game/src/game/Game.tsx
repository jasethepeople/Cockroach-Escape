import * as THREE from 'three';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './store';
import { LEVELS, getLevelObstacles, getLevelCollectibles } from './levels';
import { setupKeyboardControls } from './controls';
import { Room } from './components/Room';
import { Cockroach } from './components/Cockroach';
import { Obstacles } from './components/Obstacles';
import { Collectibles } from './components/Collectibles';
import { ExitZone } from './components/ExitZone';
import { FollowCamera } from './components/Camera';
import { HUD } from './components/HUD';
import { StartScreen, LevelCompleteScreen, GameOverScreen } from './components/StartScreen';
import type { CollectibleItem } from './types';

function getStartPos(levelNum: number) {
  const cfg = LEVELS[levelNum - 1];
  const startZ = cfg ? cfg.roomSize.depth / 2 - 2.5 : 0;
  return new THREE.Vector3(0, 0.12, startZ);
}

function GameScene() {
  const { level, collected, required, phase, collectItem } = useGameStore();
  const startPos = useMemo(() => getStartPos(level), [level]);
  const cockroachPos = useRef(startPos.clone());
  const [posState, setPosState] = useState(() => startPos.clone());
  const [items, setItems] = useState<CollectibleItem[]>(() =>
    getLevelCollectibles(level).map((item) => ({ ...item, collected: false }))
  );

  const config = LEVELS[level - 1];
  const obstacles = useMemo(() => getLevelObstacles(level), [level]);

  useEffect(() => {
    const sp = getStartPos(level);
    cockroachPos.current = sp.clone();
    setPosState(sp.clone());
    setItems(getLevelCollectibles(level).map((item) => ({ ...item, collected: false })));
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

const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export function Game() {
  const { phase } = useGameStore();

  // Set up keyboard listener once, at the top level — outside the canvas
  useEffect(() => {
    return setupKeyboardControls();
  }, []);

  // Make the root div focusable and auto-focus it so key events land here
  const rootRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    rootRef.current?.focus();
  }, [phase]);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0A0500',
        overflow: 'hidden',
        outline: 'none',
      }}
    >
      {phase === 'menu' && <StartScreen />}
      {phase === 'level_complete' && <LevelCompleteScreen />}
      {phase === 'game_over' && <GameOverScreen />}

      {phase === 'playing' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            shadows={!isMobile}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{
              antialias: !isMobile,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.85,
              powerPreference: 'high-performance',
            }}
            camera={{
              fov: 65,
              near: 0.1,
              far: isMobile ? 60 : 100,
              position: [0, 4.5, 7],
            }}
            style={{ background: '#0A0500' }}
          >
            <GameScene />
          </Canvas>
        </div>
      )}

      {phase === 'playing' && <HUD />}
    </div>
  );
}
