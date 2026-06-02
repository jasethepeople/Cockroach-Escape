import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import type { LevelConfig } from '../types';

interface ExitZoneProps {
  config: LevelConfig;
  cockroachPos: THREE.Vector3;
  allCollected: boolean;
}

export function ExitZone({ config, cockroachPos, allCollected }: ExitZoneProps) {
  const glowRef = useRef<THREE.PointLight>(null!);
  const portalRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);
  const { nextLevel } = useGameStore.getState();
  const triggered = useRef(false);

  const hd = config.roomSize.depth / 2;
  const exitZ = -hd + 1.0;
  const exitX = 0;

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (glowRef.current) {
      glowRef.current.intensity = allCollected
        ? 2.5 + Math.sin(timeRef.current * 3) * 0.8
        : 0.4 + Math.sin(timeRef.current * 2) * 0.1;
    }

    if (portalRef.current) {
      portalRef.current.rotation.y = timeRef.current * (allCollected ? 1.5 : 0.5);
      const s = allCollected ? 1 + Math.sin(timeRef.current * 4) * 0.1 : 0.5;
      portalRef.current.scale.setScalar(s);
    }

    if (allCollected && !triggered.current) {
      const dist = cockroachPos.distanceTo(new THREE.Vector3(exitX, 0, exitZ));
      if (dist < 1.5) {
        triggered.current = true;
        nextLevel();
      }
    }
  });

  return (
    <group position={[exitX, 0, exitZ]}>
      {/* Floor glow */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 24]} />
        <meshStandardMaterial
          color={allCollected ? '#00FF88' : '#FF4400'}
          emissive={allCollected ? '#00FF88' : '#FF4400'}
          emissiveIntensity={allCollected ? 0.8 : 0.2}
          transparent
          opacity={allCollected ? 0.7 : 0.3}
        />
      </mesh>

      {/* Portal indicator */}
      <mesh ref={portalRef} position={[0, 1.2, 0]}>
        <torusGeometry args={[0.7, 0.12, 8, 20]} />
        <meshStandardMaterial
          color={allCollected ? '#00FF88' : '#FF4400'}
          emissive={allCollected ? '#00FF88' : '#FF4400'}
          emissiveIntensity={allCollected ? 1.5 : 0.3}
        />
      </mesh>

      {/* Baseboard gap indicator */}
      <mesh position={[0, 0.5, -0.05]}>
        <boxGeometry args={[1.5, 1.0, 0.1]} />
        <meshStandardMaterial
          color={allCollected ? '#00FF88' : '#553300'}
          emissive={allCollected ? '#00FF88' : '#220000'}
          emissiveIntensity={allCollected ? 0.8 : 0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      <pointLight
        ref={glowRef}
        position={[0, 1.5, 0]}
        intensity={allCollected ? 3 : 0.5}
        color={allCollected ? '#00FF88' : '#FF4400'}
        distance={allCollected ? 6 : 3}
        decay={2}
      />
    </group>
  );
}
