import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import type { CollectibleItem, LevelConfig } from '../types';

interface CollectibleProps {
  item: CollectibleItem;
  levelId: number;
  cockroachPos: THREE.Vector3;
  onCollect: (id: string) => void;
}

function FoodCrumb({ item, cockroachPos, onCollect }: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  const collected = useRef(false);

  useFrame((_, delta) => {
    if (collected.current) return;
    timeRef.current += delta;

    if (meshRef.current) {
      meshRef.current.position.y = item.position[1] + Math.sin(timeRef.current * 2) * 0.06;
      meshRef.current.rotation.y = timeRef.current * 1.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 3) * 0.15);
    }

    const dist = cockroachPos.distanceTo(new THREE.Vector3(item.position[0], 0, item.position[2]));
    if (dist < 0.6) {
      collected.current = true;
      onCollect(item.id);
    }
  });

  if (item.collected) return null;

  return (
    <group position={[item.position[0], 0, item.position[2]]}>
      {/* Glow ring on floor */}
      <mesh ref={glowRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.45, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} transparent opacity={0.5} />
      </mesh>
      {/* Crumb */}
      <mesh ref={meshRef} position={[0, item.position[1], 0]} castShadow>
        <dodecahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#D4A055" roughness={0.8} metalness={0.1} emissive="#604020" emissiveIntensity={0.2} />
      </mesh>
      {/* Point light for glow */}
      <pointLight position={[0, 0.5, 0]} intensity={0.8} color="#FFD060" distance={2.5} decay={2} />
    </group>
  );
}

function PizzaFragment({ item, cockroachPos, onCollect }: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  const collected = useRef(false);

  useFrame((_, delta) => {
    if (collected.current) return;
    timeRef.current += delta;
    if (meshRef.current) {
      meshRef.current.position.y = item.position[1] + Math.sin(timeRef.current * 2) * 0.05;
      meshRef.current.rotation.y = timeRef.current;
    }
    const dist = cockroachPos.distanceTo(new THREE.Vector3(item.position[0], 0, item.position[2]));
    if (dist < 0.6) {
      collected.current = true;
      onCollect(item.id);
    }
  });

  if (item.collected) return null;

  return (
    <group position={[item.position[0], 0, item.position[2]]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#FF8C00" emissive="#FF4400" emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      <mesh ref={meshRef} position={[0, item.position[1], 0]} castShadow>
        <cylinderGeometry args={[0, 0.22, 0.12, 4]} />
        <meshStandardMaterial color="#D4801F" roughness={0.7} emissive="#803010" emissiveIntensity={0.2} />
      </mesh>
      <pointLight position={[0, 0.4, 0]} intensity={0.7} color="#FF8040" distance={2.5} decay={2} />
    </group>
  );
}

function GarbageScrap({ item, cockroachPos, onCollect }: CollectibleProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  const collected = useRef(false);

  useFrame((_, delta) => {
    if (collected.current) return;
    timeRef.current += delta;
    if (meshRef.current) {
      meshRef.current.position.y = item.position[1] + Math.sin(timeRef.current * 1.5) * 0.06;
      meshRef.current.rotation.y = timeRef.current * 0.8;
    }
    const dist = cockroachPos.distanceTo(new THREE.Vector3(item.position[0], 0, item.position[2]));
    if (dist < 0.65) {
      collected.current = true;
      onCollect(item.id);
    }
  });

  if (item.collected) return null;

  return (
    <group position={[item.position[0], 0, item.position[2]]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#80FF40" emissive="#40FF00" emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      <group ref={meshRef} position={[0, item.position[1], 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.15, 0.35]} />
          <meshStandardMaterial color="#607040" roughness={0.9} emissive="#203010" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.1, 0.08, -0.05]} rotation={[0.3, 0.5, 0.2]}>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#504030" roughness={0.95} />
        </mesh>
      </group>
      <pointLight position={[0, 0.5, 0]} intensity={0.7} color="#80FF40" distance={2.5} decay={2} />
    </group>
  );
}

interface CollectiblesProps {
  items: CollectibleItem[];
  levelId: number;
  cockroachPos: THREE.Vector3;
  onCollect: (id: string) => void;
}

export function Collectibles({ items, levelId, cockroachPos, onCollect }: CollectiblesProps) {
  return (
    <group>
      {items.filter((item) => !item.collected).map((item) => {
        const props = { item, levelId, cockroachPos, onCollect };
        if (levelId === 1) return <FoodCrumb key={item.id} {...props} />;
        if (levelId === 2) return <PizzaFragment key={item.id} {...props} />;
        if (levelId === 3) return <GarbageScrap key={item.id} {...props} />;
        return null;
      })}
    </group>
  );
}
