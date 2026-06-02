import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { LevelConfig } from '../types';

interface RoomProps {
  config: LevelConfig;
}

export function Room({ config }: RoomProps) {
  const { width, depth, height } = config.roomSize;
  const hw = width / 2;
  const hd = depth / 2;
  const isAlley = config.id === 3;

  // Build a single canvas texture for the floor instead of hundreds of tiles
  const floorTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const baseColor = config.floorColor;
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    // Draw a grid/tile pattern on the canvas
    const tileCount = 8;
    const tileSize = size / tileCount;
    for (let tx = 0; tx < tileCount; tx++) {
      for (let tz = 0; tz < tileCount; tz++) {
        const accent = (Math.abs(tx + tz) % 3 === 0) || (Math.abs(tx * tz) % 7 === 0);
        if (accent) {
          const c = new THREE.Color(baseColor).multiplyScalar(0.82);
          ctx.fillStyle = `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`;
          ctx.fillRect(tx * tileSize + 1, tz * tileSize + 1, tileSize - 2, tileSize - 2);
        }
      }
    }

    // Grout lines
    ctx.strokeStyle = `rgba(0,0,0,0.35)`;
    ctx.lineWidth = 2;
    for (let i = 1; i < tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(size, i * tileSize);
      ctx.stroke();
    }

    // Random stain spots
    for (let i = 0; i < 12; i++) {
      const sx = (i * 137 % size);
      const sz = (i * 97 % size);
      const sr = 8 + (i * 31 % 20);
      ctx.beginPath();
      ctx.arc(sx, sz, sr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.08 + (i % 5) * 0.03})`;
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 4, depth / 4);
    return tex;
  }, [config.floorColor, width, depth]);

  const wallColor = new THREE.Color(config.wallColor);
  const wallColorDarker = wallColor.clone().multiplyScalar(0.88);

  return (
    <group>
      {/* Single floor plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={floorTexture} roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.95} side={THREE.FrontSide} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, height / 2, hd]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={wallColorDarker} roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={wallColorDarker} roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      {!isAlley && (
        <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={config.ceilingColor} roughness={0.9} side={THREE.FrontSide} />
        </mesh>
      )}

      {/* Baseboard strip — back wall */}
      <mesh position={[0, 0.15, -hd + 0.06]}>
        <boxGeometry args={[width, 0.3, 0.1]} />
        <meshStandardMaterial color={wallColorDarker} roughness={1} />
      </mesh>

      {/* Level-specific props */}
      {config.id === 1 && <KitchenProps hw={hw} hd={hd} />}
      {config.id === 2 && <BedroomProps hw={hw} hd={hd} />}
      {config.id === 3 && <AlleyProps hw={hw} hd={hd} depth={depth} />}
    </group>
  );
}

function KitchenProps({ hw, hd }: { hw: number; hd: number }) {
  return (
    <group>
      {/* Table legs */}
      {([ [-4, -7], [-4, -4], [4, -7], [4, -4] ] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 2.5, z]}>
          <cylinderGeometry args={[0.3, 0.3, 5, 6]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
        </mesh>
      ))}
      {/* Table top */}
      <mesh position={[0, 5, -5.5]}>
        <boxGeometry args={[10, 0.5, 4]} />
        <meshStandardMaterial color="#6B4226" roughness={0.7} />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 2, -hd + 1.5]}>
        <boxGeometry args={[hw * 2 - 4, 4, 2.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>

      {/* Stove */}
      <mesh position={[hw - 3.5, 2.1, -hd + 1.5]}>
        <boxGeometry args={[3, 4.2, 2.6]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Fridge */}
      <mesh position={[-hw + 2, 3.5, -hd + 1.5]}>
        <boxGeometry args={[3.2, 7, 2.5]} />
        <meshStandardMaterial color="#9A9A9A" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Trash bag */}
      <mesh position={[hw - 2, 0.8, 2]}>
        <sphereGeometry args={[1.2, 7, 6]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Overhead light fixture */}
      <mesh position={[0, 7.5, 0]}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#F0E8C0" emissive="#F0E860" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 7, 0]} intensity={5} color="#FFF5D0" distance={22} decay={1.5} />
      <pointLight position={[-5, 6, 3]} intensity={1.5} color="#FFA050" distance={10} decay={2} />
    </group>
  );
}

function BedroomProps({ hw, hd }: { hw: number; hd: number }) {
  return (
    <group>
      {/* Bed frame */}
      <mesh position={[-hw + 5, 1.5, -hd + 5]}>
        <boxGeometry args={[8, 3, 10]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.9} />
      </mesh>
      {/* Mattress */}
      <mesh position={[-hw + 5, 3.1, -hd + 5]}>
        <boxGeometry args={[7.5, 0.5, 9.5]} />
        <meshStandardMaterial color="#8B7B6B" roughness={0.95} />
      </mesh>
      {/* Pillow */}
      <mesh position={[-hw + 5, 3.5, -hd + 1.5]}>
        <boxGeometry args={[5, 0.6, 2.5]} />
        <meshStandardMaterial color="#C8B8A8" roughness={0.9} />
      </mesh>

      {/* Dresser */}
      <mesh position={[hw - 3, 2.5, -hd + 2]}>
        <boxGeometry args={[4.5, 5, 2.5]} />
        <meshStandardMaterial color="#4A3020" roughness={0.8} />
      </mesh>

      {/* Lamp pole */}
      <mesh position={[hw - 3, 6.5, -hd + 2]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 6]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      {/* Lamp shade */}
      <mesh position={[hw - 3, 7.3, -hd + 2]}>
        <coneGeometry args={[0.8, 1, 10]} />
        <meshStandardMaterial color="#D4C490" emissive="#D4C490" emissiveIntensity={0.3} />
      </mesh>
      <pointLight position={[hw - 3, 7.5, -hd + 2]} intensity={3} color="#FFB050" distance={14} decay={1.5} />

      {/* Clothes pile */}
      <mesh position={[2, 0.4, 5]}>
        <sphereGeometry args={[1.3, 6, 5]} />
        <meshStandardMaterial color="#3A2A4A" roughness={1} />
      </mesh>

      {/* Pizza box */}
      <mesh position={[-2, 0.12, 4]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[4, 0.25, 4]} />
        <meshStandardMaterial color="#D4811F" roughness={0.8} />
      </mesh>

      {/* Dim ambient overhead */}
      <pointLight position={[0, 8, 0]} intensity={2} color="#806090" distance={24} decay={1.2} />
    </group>
  );
}

function AlleyProps({ hw, hd, depth }: { hw: number; hd: number; depth: number }) {
  const lightRef = useRef<THREE.PointLight>(null!);
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 5.5 + Math.sin(clock.elapsedTime * 8) * 0.3;
    }
  });

  return (
    <group>
      {/* Dumpsters */}
      {([ [-hw + 2.5, -hd + 5], [hw - 2.5, hd - 8] ] as [number, number][]).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh>
            <boxGeometry args={[3.5, 3.5, 5]} />
            <meshStandardMaterial color="#2A5A2A" roughness={0.7} metalness={0.3} />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[3.7, 0.3, 5.2]} />
            <meshStandardMaterial color="#1A4A1A" roughness={0.7} metalness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Street light pole + glow */}
      <mesh position={[hw - 0.5, 9, -hd + 5]}>
        <cylinderGeometry args={[0.12, 0.18, 18, 6]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.5} />
      </mesh>
      <mesh position={[hw - 0.5, 18.5, -hd + 5]}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#FFDD88" emissive="#FFDD88" emissiveIntensity={0.6} />
      </mesh>
      <pointLight ref={lightRef} position={[hw - 0.5, 17, -hd + 5]} intensity={6} color="#FFD070" distance={22} decay={1.5} />
      <pointLight position={[0, 17, hd - 10]} intensity={4} color="#FFD070" distance={18} decay={1.5} />

      {/* Puddles — just flat dark circles on the floor */}
      {([[-2, -5], [1, 3], [-1, 10]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2 + i * 0.3, 12]} />
          <meshStandardMaterial color="#1A2A3A" roughness={0.05} metalness={0.7} transparent opacity={0.75} />
        </mesh>
      ))}

      {/* Moonlight */}
      <directionalLight position={[0, 20, 0]} intensity={0.5} color="#8090FF" />
    </group>
  );
}
