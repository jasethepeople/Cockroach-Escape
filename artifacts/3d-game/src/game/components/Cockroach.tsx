import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGameStore } from '../store';
import type { LevelConfig } from '../types';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

interface CockroachProps {
  config: LevelConfig;
  onPositionChange: (pos: THREE.Vector3) => void;
}

const SPEED = 5.5;
const ROTATION_SPEED = 8;
const LEG_COUNT = 3;

export function Cockroach({ config, onPositionChange }: CockroachProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const velocity = useRef(new THREE.Vector3());
  const targetAngle = useRef(0);
  const legTime = useRef(0);
  const [, getState] = useKeyboardControls<Controls>();
  const phase = useGameStore((s) => s.phase);
  const invincible = useGameStore((s) => s.invincible);

  const { width, depth } = config.roomSize;
  const wallMargin = 0.8;
  const minX = -width / 2 + wallMargin;
  const maxX = width / 2 - wallMargin;
  const minZ = -depth / 2 + wallMargin;
  const maxZ = depth / 2 - wallMargin;

  // Leg refs (6 legs: 3 left, 3 right)
  const legRefs = useRef<(THREE.Mesh | null)[]>(Array(6).fill(null));

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0.12, depth / 2 - 2.5);
    }
  }, [config, depth]);

  useFrame((_, delta) => {
    if (phase !== 'playing') return;
    const controls = getState();
    const moving = controls.forward || controls.back || controls.left || controls.right;

    // Movement
    const dir = new THREE.Vector3();
    if (controls.forward) dir.z -= 1;
    if (controls.back) dir.z += 1;
    if (controls.left) dir.x -= 1;
    if (controls.right) dir.x += 1;

    if (dir.lengthSq() > 0) {
      dir.normalize();
      velocity.current.lerp(dir.multiplyScalar(SPEED), Math.min(delta * 12, 1));
      targetAngle.current = Math.atan2(dir.x, dir.z);
    } else {
      velocity.current.lerp(new THREE.Vector3(), Math.min(delta * 14, 1));
    }

    // Smooth rotation
    if (moving && groupRef.current) {
      const current = groupRef.current.rotation.y;
      let diff = targetAngle.current - current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y += diff * Math.min(ROTATION_SPEED * delta, 1);
    }

    // Apply movement
    if (groupRef.current) {
      const newX = Math.max(minX, Math.min(maxX, groupRef.current.position.x + velocity.current.x * delta));
      const newZ = Math.max(minZ, Math.min(maxZ, groupRef.current.position.z + velocity.current.z * delta));
      groupRef.current.position.x = newX;
      groupRef.current.position.z = newZ;

      // Scurry animation - body bobs slightly
      const speed = velocity.current.length();
      if (speed > 0.5) {
        legTime.current += delta * speed * 2;
        groupRef.current.position.y = 0.12 + Math.sin(legTime.current * 4) * 0.015;
      }

      // Animate legs
      if (legRefs.current) {
        for (let i = 0; i < 6; i++) {
          const leg = legRefs.current[i];
          if (!leg) continue;
          const side = i < 3 ? 1 : -1;
          const row = i % 3;
          const phase_offset = row * (Math.PI * 2 / 3) + (i < 3 ? 0 : Math.PI);
          const swing = Math.sin(legTime.current * 6 + phase_offset) * 0.25 * Math.min(speed / SPEED, 1);
          leg.rotation.x = swing;
          leg.rotation.z = side * (0.4 + Math.abs(swing) * 0.3);
        }
      }

      onPositionChange(groupRef.current.position.clone());
    }
  });

  const bodyColor = invincible ? '#FF4444' : '#5C3A15';
  const wingColor = invincible ? '#CC2222' : '#3A2008';
  const headColor = invincible ? '#FF6666' : '#6B4420';

  const legPositionsLeft: [number, number, number][] = [
    [0.32, 0.0, -0.3],
    [0.32, 0.0, 0.0],
    [0.32, 0.0, 0.3],
  ];
  const legPositionsRight: [number, number, number][] = [
    [-0.32, 0.0, -0.3],
    [-0.32, 0.0, 0.0],
    [-0.32, 0.0, 0.3],
  ];

  return (
    <group ref={groupRef} position={[0, 0.12, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.7, 4, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Wing covers (elytra) */}
      <mesh position={[0, 0.06, 0.05]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.68]} />
        <meshStandardMaterial color={wingColor} roughness={0.2} metalness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.01, -0.55]} castShadow>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color={headColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.1, 0.06, -0.65]}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.06, -0.65]}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.1, 0.06, -0.69]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.1, 0.06, -0.69]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Antennae */}
      <mesh position={[0.08, 0.08, -0.72]} rotation={[0.4, 0.3, 0.2]}>
        <cylinderGeometry args={[0.012, 0.006, 0.7, 4]} />
        <meshStandardMaterial color="#2A1A08" />
      </mesh>
      <mesh position={[-0.08, 0.08, -0.72]} rotation={[0.4, -0.3, -0.2]}>
        <cylinderGeometry args={[0.012, 0.006, 0.7, 4]} />
        <meshStandardMaterial color="#2A1A08" />
      </mesh>

      {/* Left legs */}
      {legPositionsLeft.map((pos, i) => (
        <mesh
          key={`ll${i}`}
          ref={(el) => { legRefs.current[i] = el; }}
          position={pos}
          rotation={[0, 0, 0.5]}
          castShadow
        >
          <capsuleGeometry args={[0.025, 0.28, 2, 4]} />
          <meshStandardMaterial color="#3A2208" roughness={0.6} />
        </mesh>
      ))}

      {/* Right legs */}
      {legPositionsRight.map((pos, i) => (
        <mesh
          key={`rl${i}`}
          ref={(el) => { legRefs.current[i + 3] = el; }}
          position={pos}
          rotation={[0, 0, -0.5]}
          castShadow
        >
          <capsuleGeometry args={[0.025, 0.28, 2, 4]} />
          <meshStandardMaterial color="#3A2208" roughness={0.6} />
        </mesh>
      ))}

      {/* Subtle point light on cockroach for visibility */}
      <pointLight position={[0, 0.5, 0]} intensity={0.4} color="#FF8040" distance={3} decay={2} />
    </group>
  );
}
