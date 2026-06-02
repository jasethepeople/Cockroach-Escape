import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import type { Obstacle } from '../types';

interface ObstaclesProps {
  obstacles: Obstacle[];
  cockroachPos: THREE.Vector3;
}

function ShoeObstacle({ obstacle, cockroachPos }: { obstacle: Obstacle; cockroachPos: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const shadowRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(obstacle.phase);
  const { takeDamage } = useGameStore.getState();

  useFrame((_, delta) => {
    timeRef.current += delta * obstacle.speed;
    const t = (Math.sin(timeRef.current) + 1) / 2;
    const y = t * 9 + 0.75;
    if (meshRef.current) {
      meshRef.current.position.y = y;
      meshRef.current.rotation.x = t * 0.3;
    }
    if (shadowRef.current) {
      const scale = Math.max(0.2, 1 - t * 0.7);
      shadowRef.current.scale.set(scale, 1, scale);
      (shadowRef.current.material as THREE.MeshStandardMaterial).opacity = (1 - t) * 0.5;
    }

    // Damage check — shoe hits near bottom of stroke
    if (y < 1.8) {
      const dist = cockroachPos.distanceTo(new THREE.Vector3(obstacle.position[0], 0, obstacle.position[2]));
      if (dist < 1.6) {
        takeDamage();
      }
    }
  });

  return (
    <group position={[obstacle.position[0], 0, obstacle.position[2]]}>
      {/* Shoe sole shadow on floor */}
      <mesh
        ref={shadowRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[obstacle.size[0] / 2, obstacle.size[2] / 2, 1]}
      >
        <circleGeometry args={[1, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.3} roughness={1} />
      </mesh>
      {/* Shoe body */}
      <mesh ref={meshRef} position={[0, 4, 0]} castShadow>
        <boxGeometry args={obstacle.size} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.05} />
      </mesh>
    </group>
  );
}

function CanObstacle({ obstacle, cockroachPos }: { obstacle: Obstacle; cockroachPos: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null!);
  const timeRef = useRef(obstacle.phase);
  const { takeDamage } = useGameStore.getState();

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = Math.sin(timeRef.current * obstacle.speed + obstacle.phase);

    if (groupRef.current) {
      if (obstacle.axis === 'x') {
        groupRef.current.position.x = obstacle.position[0] + t * obstacle.range;
        groupRef.current.rotation.z = timeRef.current * obstacle.speed * 1.5;
      } else {
        groupRef.current.position.z = obstacle.position[2] + t * obstacle.range;
        groupRef.current.rotation.x = timeRef.current * obstacle.speed * 1.5;
      }

      const pos = groupRef.current.position;
      const dist = cockroachPos.distanceTo(new THREE.Vector3(pos.x, 0, pos.z));
      if (dist < 0.9) {
        takeDamage();
      }
    }
  });

  return (
    <group ref={groupRef} position={[obstacle.position[0], obstacle.size[1] / 2, obstacle.position[2]]}>
      <mesh castShadow>
        <cylinderGeometry args={[obstacle.size[0] / 2, obstacle.size[0] / 2, obstacle.size[1], 12]} />
        <meshStandardMaterial color="#C0A050" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, obstacle.size[1] / 2 + 0.05, 0]}>
        <cylinderGeometry args={[obstacle.size[0] / 2 - 0.05, obstacle.size[0] / 2 - 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

function SlipperObstacle({ obstacle, cockroachPos }: { obstacle: Obstacle; cockroachPos: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(obstacle.phase);
  const { takeDamage } = useGameStore.getState();

  useFrame((_, delta) => {
    timeRef.current += delta * obstacle.speed;
    const t = (Math.sin(timeRef.current) + 1) / 2;
    const y = t * 7 + 0.5;

    if (meshRef.current) {
      meshRef.current.position.y = y;
      meshRef.current.rotation.z = Math.sin(timeRef.current) * 0.2;
    }

    if (y < 1.5) {
      const dist = cockroachPos.distanceTo(new THREE.Vector3(obstacle.position[0], 0, obstacle.position[2]));
      if (dist < 2.0) takeDamage();
    }
  });

  return (
    <group position={[obstacle.position[0], 0, obstacle.position[2]]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0.2]} scale={[obstacle.size[0] / 2, obstacle.size[2] / 2, 1]}>
        <circleGeometry args={[1, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.25} roughness={1} />
      </mesh>
      <mesh ref={meshRef} position={[0, 3, 0]} castShadow>
        <boxGeometry args={obstacle.size} />
        <meshStandardMaterial color="#5B8FA8" roughness={0.9} />
      </mesh>
    </group>
  );
}

function NewspaperObstacle({ obstacle, cockroachPos }: { obstacle: Obstacle; cockroachPos: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Group>(null!);
  const timeRef = useRef(obstacle.phase);
  const { takeDamage } = useGameStore.getState();

  useFrame((_, delta) => {
    timeRef.current += delta * obstacle.speed;
    const swing = Math.sin(timeRef.current);
    const rotX = swing * 1.2;
    const y = (Math.abs(swing)) * 5 + 0.3;

    if (meshRef.current) {
      meshRef.current.position.y = y;
      meshRef.current.rotation.x = rotX;
    }

    if (y < 1.0) {
      const dist = cockroachPos.distanceTo(new THREE.Vector3(obstacle.position[0], 0, obstacle.position[2]));
      if (dist < 2.0) takeDamage();
    }
  });

  return (
    <group position={[obstacle.position[0], 0, obstacle.position[2]]}>
      <group ref={meshRef} position={[0, 2.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={obstacle.size} />
          <meshStandardMaterial color="#E8D8B8" roughness={0.95} />
        </mesh>
        {/* Newsprint lines */}
        {[-1.2, -0.4, 0.4, 1.2].map((z, i) => (
          <mesh key={i} position={[0, 0.21, z]}>
            <boxGeometry args={[obstacle.size[0] - 0.2, 0.05, 0.15]} />
            <meshStandardMaterial color="#888880" roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RatObstacle({ obstacle, cockroachPos }: { obstacle: Obstacle; cockroachPos: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null!);
  const timeRef = useRef(obstacle.phase);
  const { takeDamage } = useGameStore.getState();

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = Math.sin(timeRef.current * obstacle.speed);

    if (groupRef.current) {
      groupRef.current.position.x = obstacle.position[0] + t * obstacle.range;
      groupRef.current.rotation.y = t > 0 ? 0 : Math.PI;
      // Slight body bob while running
      groupRef.current.position.y = 0.4 + Math.abs(Math.sin(timeRef.current * obstacle.speed * 3)) * 0.08;

      const pos = groupRef.current.position;
      const dist = cockroachPos.distanceTo(new THREE.Vector3(pos.x, 0, pos.z));
      if (dist < 1.2) takeDamage();
    }
  });

  return (
    <group ref={groupRef} position={[obstacle.position[0], 0.4, obstacle.position[2]]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.6, 1.8, 4, 8]} />
        <meshStandardMaterial color="#4A3A2A" roughness={0.95} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.3, -1.3]} castShadow>
        <sphereGeometry args={[0.55, 8, 6]} />
        <meshStandardMaterial color="#4A3A2A" roughness={0.95} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.25, -1.8]}>
        <sphereGeometry args={[0.18, 6, 5]} />
        <meshStandardMaterial color="#D06060" roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.22, 0.5, -1.55]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#FF2020" emissive="#FF2020" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.22, 0.5, -1.55]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#FF2020" emissive="#FF2020" emissiveIntensity={0.5} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.35, 0.75, -1.3]}>
        <sphereGeometry args={[0.22, 6, 5]} />
        <meshStandardMaterial color="#5A1A1A" roughness={0.95} />
      </mesh>
      <mesh position={[-0.35, 0.75, -1.3]}>
        <sphereGeometry args={[0.22, 6, 5]} />
        <meshStandardMaterial color="#5A1A1A" roughness={0.95} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, -0.1, 1.4]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.02, 2.5, 6]} />
        <meshStandardMaterial color="#3A2A1A" roughness={0.9} />
      </mesh>
    </group>
  );
}

function RainDropObstacle({ obstacle, cockroachPos }: { obstacle: Obstacle; cockroachPos: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const splashRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(obstacle.phase);
  const { takeDamage } = useGameStore.getState();

  useFrame((_, delta) => {
    timeRef.current += delta * obstacle.speed;
    const t = (timeRef.current % 2.5) / 2.5;
    const y = (1 - t) * 15 + 0.1;

    if (meshRef.current) {
      meshRef.current.position.y = y;
      meshRef.current.scale.y = 1 + t * 0.5;
    }

    if (splashRef.current) {
      if (t > 0.9) {
        const splashT = (t - 0.9) / 0.1;
        splashRef.current.scale.set(splashT * 2.5, 1, splashT * 2.5);
        (splashRef.current.material as THREE.MeshStandardMaterial).opacity = (1 - splashT) * 0.6;
      } else {
        splashRef.current.scale.set(0.01, 1, 0.01);
      }
    }

    if (y < 1.0) {
      const dist = cockroachPos.distanceTo(new THREE.Vector3(obstacle.position[0], 0, obstacle.position[2]));
      if (dist < 1.0) takeDamage();
    }
  });

  return (
    <group position={[obstacle.position[0], 0, obstacle.position[2]]}>
      <mesh ref={meshRef} position={[0, 8, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#4080FF" roughness={0.1} metalness={0.2} transparent opacity={0.8} />
      </mesh>
      <mesh ref={splashRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.8, 12]} />
        <meshStandardMaterial color="#4080FF" transparent opacity={0.5} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function Obstacles({ obstacles, cockroachPos }: ObstaclesProps) {
  return (
    <group>
      {obstacles.map((obs) => {
        switch (obs.type) {
          case 'shoe':
            return <ShoeObstacle key={obs.id} obstacle={obs} cockroachPos={cockroachPos} />;
          case 'can':
            return <CanObstacle key={obs.id} obstacle={obs} cockroachPos={cockroachPos} />;
          case 'slipper':
            return <SlipperObstacle key={obs.id} obstacle={obs} cockroachPos={cockroachPos} />;
          case 'newspaper':
            return <NewspaperObstacle key={obs.id} obstacle={obs} cockroachPos={cockroachPos} />;
          case 'rat':
            return <RatObstacle key={obs.id} obstacle={obs} cockroachPos={cockroachPos} />;
          case 'rain':
            return <RainDropObstacle key={obs.id} obstacle={obs} cockroachPos={cockroachPos} />;
          default:
            return null;
        }
      })}
    </group>
  );
}
