import * as THREE from 'three';
import { useMemo } from 'react';
import type { LevelConfig } from '../types';

interface RoomProps {
  config: LevelConfig;
}

function FloorTile({ x, z, color, accent }: { x: number; z: number; color: string; accent: boolean }) {
  return (
    <mesh position={[x, 0, z]} receiveShadow>
      <boxGeometry args={[1, 0.05, 1]} />
      <meshStandardMaterial color={accent ? new THREE.Color(color).multiplyScalar(0.88) : color} roughness={0.9} metalness={0.0} />
    </mesh>
  );
}

export function Room({ config }: RoomProps) {
  const { width, depth, height } = config.roomSize;
  const hw = width / 2;
  const hd = depth / 2;

  const floorTiles = useMemo(() => {
    const tiles = [];
    for (let xi = -Math.floor(hw); xi < Math.ceil(hw); xi++) {
      for (let zi = -Math.floor(hd); zi < Math.ceil(hd); zi++) {
        const accent = (Math.abs(xi + zi) % 3 === 0) || (Math.abs(xi * zi) % 7 === 0);
        tiles.push({ x: xi + 0.5, z: zi + 0.5, accent });
      }
    }
    return tiles;
  }, [hw, hd]);

  const isAlley = config.id === 3;

  return (
    <group>
      {/* Floor tiles */}
      {floorTiles.map((tile, i) => (
        <FloorTile key={i} x={tile.x} z={tile.z} color={config.floorColor} accent={tile.accent} />
      ))}

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]} receiveShadow castShadow>
        <boxGeometry args={[width, height, 0.3]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.95} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, height / 2, hd]} receiveShadow castShadow>
        <boxGeometry args={[width, height, 0.3]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, height, depth]} />
        <meshStandardMaterial color={new THREE.Color(config.wallColor).multiplyScalar(0.9)} roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, height, depth]} />
        <meshStandardMaterial color={new THREE.Color(config.wallColor).multiplyScalar(0.9)} roughness={0.95} />
      </mesh>

      {/* Ceiling (if not alley) */}
      {!isAlley && (
        <mesh position={[0, height, 0]} receiveShadow>
          <boxGeometry args={[width, 0.2, depth]} />
          <meshStandardMaterial color={config.ceilingColor} roughness={0.9} />
        </mesh>
      )}

      {/* Baseboards */}
      <mesh position={[0, 0.15, -hd + 0.15]}>
        <boxGeometry args={[width, 0.3, 0.1]} />
        <meshStandardMaterial color={new THREE.Color(config.wallColor).multiplyScalar(0.7)} roughness={1} />
      </mesh>
      <mesh position={[0, 0.15, hd - 0.15]}>
        <boxGeometry args={[width, 0.3, 0.1]} />
        <meshStandardMaterial color={new THREE.Color(config.wallColor).multiplyScalar(0.7)} roughness={1} />
      </mesh>

      {/* Level-specific props */}
      {config.id === 1 && <KitchenProps roomSize={config.roomSize} />}
      {config.id === 2 && <BedroomProps roomSize={config.roomSize} />}
      {config.id === 3 && <AlleyProps roomSize={config.roomSize} />}
    </group>
  );
}

function KitchenProps({ roomSize }: { roomSize: LevelConfig['roomSize'] }) {
  const hw = roomSize.width / 2;
  const hd = roomSize.depth / 2;

  return (
    <group>
      {/* Table (massive from cockroach perspective) */}
      {/* Table legs */}
      {[[-4, -7], [-4, -4], [4, -7], [4, -4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.5, z]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 5, 8]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
        </mesh>
      ))}
      {/* Table top */}
      <mesh position={[0, 5, -5.5]} castShadow>
        <boxGeometry args={[10, 0.5, 4]} />
        <meshStandardMaterial color="#6B4226" roughness={0.7} />
      </mesh>

      {/* Counter / cabinet at back */}
      <mesh position={[0, 2, -hd + 1.5]} castShadow receiveShadow>
        <boxGeometry args={[roomSize.width - 4, 4, 2.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>

      {/* Stove (box shape) */}
      <mesh position={[hw - 3.5, 2.1, -hd + 1.5]} castShadow>
        <boxGeometry args={[3, 4.2, 2.6]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Refrigerator */}
      <mesh position={[-hw + 2, 3.5, -hd + 1.5]} castShadow>
        <boxGeometry args={[3.2, 7, 2.5]} />
        <meshStandardMaterial color="#9A9A9A" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Trash bag on floor */}
      <mesh position={[hw - 2, 0.8, 2]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Water stain on floor */}
      <mesh position={[2, 0.03, 3]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#4A3A2A" roughness={1} transparent opacity={0.6} />
      </mesh>

      {/* Mouse trap */}
      <mesh position={[-3, 0.07, -hd + 3]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <boxGeometry args={[1.5, 2.5, 0.15]} />
        <meshStandardMaterial color="#B8860B" roughness={0.7} />
      </mesh>

      {/* Cracked tile crack on floor */}
      <mesh position={[1, 0.04, 1]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <planeGeometry args={[3, 0.08]} />
        <meshStandardMaterial color="#2A2A2A" roughness={1} />
      </mesh>

      {/* Overhead light fixture */}
      <pointLight position={[0, 7, 0]} intensity={4} color="#FFF5D0" distance={20} decay={1.5} castShadow />
      <mesh position={[0, 7.5, 0]}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#F0E8C0" emissive="#F0E860" emissiveIntensity={0.3} />
      </mesh>
      {/* Flickering effect bulb */}
      <pointLight position={[-5, 7, 3]} intensity={1.5} color="#FFA050" distance={12} decay={2} />
    </group>
  );
}

function BedroomProps({ roomSize }: { roomSize: LevelConfig['roomSize'] }) {
  const hw = roomSize.width / 2;
  const hd = roomSize.depth / 2;

  return (
    <group>
      {/* Bed */}
      <mesh position={[-hw + 5, 1.5, -hd + 5]} castShadow>
        <boxGeometry args={[8, 3, 10]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.9} />
      </mesh>
      {/* Mattress */}
      <mesh position={[-hw + 5, 3.1, -hd + 5]} castShadow>
        <boxGeometry args={[7.5, 0.5, 9.5]} />
        <meshStandardMaterial color="#8B7B6B" roughness={0.95} />
      </mesh>
      {/* Pillow */}
      <mesh position={[-hw + 5, 3.5, -hd + 1.5]} castShadow>
        <boxGeometry args={[5, 0.6, 2.5]} />
        <meshStandardMaterial color="#C8B8A8" roughness={0.9} />
      </mesh>

      {/* Dresser */}
      <mesh position={[hw - 3, 2.5, -hd + 2]} castShadow>
        <boxGeometry args={[4.5, 5, 2.5]} />
        <meshStandardMaterial color="#4A3020" roughness={0.8} />
      </mesh>

      {/* Lamp on dresser */}
      <mesh position={[hw - 3, 6.5, -hd + 2]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[hw - 3, 7.3, -hd + 2]}>
        <coneGeometry args={[0.8, 1, 12]} />
        <meshStandardMaterial color="#D4C490" emissive="#D4C490" emissiveIntensity={0.2} />
      </mesh>
      <pointLight position={[hw - 3, 7.5, -hd + 2]} intensity={3} color="#FFB050" distance={14} decay={1.5} />

      {/* Moonlight window glow */}
      <rectAreaLight
        position={[hw - 0.5, 5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={4}
        height={5}
        intensity={2}
        color="#4060FF"
      />

      {/* Clothes pile on floor */}
      <mesh position={[2, 0.4, 5]} castShadow>
        <sphereGeometry args={[1.3, 6, 4]} />
        <meshStandardMaterial color="#3A2A4A" roughness={1} />
      </mesh>

      {/* Pizza box on floor */}
      <mesh position={[-2, 0.12, 4]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <boxGeometry args={[4, 4, 0.25]} />
        <meshStandardMaterial color="#D4811F" roughness={0.8} />
      </mesh>

      {/* Dim overhead */}
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#80608A" distance={22} decay={1.2} castShadow />
    </group>
  );
}

function AlleyProps({ roomSize }: { roomSize: LevelConfig['roomSize'] }) {
  const hw = roomSize.width / 2;
  const hd = roomSize.depth / 2;

  const dumpsterPositions = useMemo(() => [
    { x: -hw + 2.5, z: -hd + 5 },
    { x: hw - 2.5, z: hd - 8 },
  ], [hw, hd]);

  const lightPositions = useMemo(() => [
    { x: hw - 0.5, z: -hd + 5 },
    { x: hw - 0.5, z: hd - 10 },
  ], [hw, hd]);

  return (
    <group>
      {/* Dumpsters */}
      {dumpsterPositions.map((pos, i) => (
        <group key={i} position={[pos.x, 0, pos.z]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 3.5, 5]} />
            <meshStandardMaterial color="#2A5A2A" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Lid */}
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[3.7, 0.3, 5.2]} />
            <meshStandardMaterial color="#1A4A1A" roughness={0.7} metalness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Fire escape ladder */}
      <mesh position={[hw - 0.5, 8, 0]} castShadow>
        <boxGeometry args={[0.2, 16, 3]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.6} metalness={0.6} />
      </mesh>
      {/* Rungs */}
      {[-10, -7, -4, -1, 2, 5, 8, 11].map((z, i) => (
        <mesh key={i} position={[hw - 0.5, 4, z]} castShadow>
          <boxGeometry args={[0.5, 0.15, 3]} />
          <meshStandardMaterial color="#222" roughness={0.7} metalness={0.5} />
        </mesh>
      ))}

      {/* Street light glow */}
      {lightPositions.map((pos, i) => (
        <group key={i} position={[pos.x, 0, pos.z]}>
          <mesh position={[0, 9, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 18, 6]} />
            <meshStandardMaterial color="#333" roughness={0.8} metalness={0.5} />
          </mesh>
          <mesh position={[0, 18.5, 0]}>
            <boxGeometry args={[1.2, 0.6, 1.2]} />
            <meshStandardMaterial color="#FFDD88" emissive="#FFDD88" emissiveIntensity={0.5} />
          </mesh>
          <pointLight position={[0, 17, 0]} intensity={6} color="#FFD070" distance={20} decay={1.5} castShadow />
        </group>
      ))}

      {/* Puddles */}
      {[[-2, -5], [1, 3], [-1, 10], [3, -15]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1 + i * 0.3, 16]} />
          <meshStandardMaterial color="#1A2A3A" roughness={0.05} metalness={0.8} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Cracked concrete lines */}
      {[0.5, -1.2, 2.1, -3.5].map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0]} rotation={[-Math.PI / 2, 0, i * 0.5]}>
          <planeGeometry args={[0.06, roomSize.depth - 2]} />
          <meshStandardMaterial color="#252525" roughness={1} />
        </mesh>
      ))}

      {/* Moon glow from above */}
      <directionalLight position={[0, 20, 0]} intensity={0.4} color="#8090FF" castShadow />
    </group>
  );
}
