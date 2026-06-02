import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface FollowCameraProps {
  target: THREE.Vector3;
  levelId: number;
}

export function FollowCamera({ target, levelId }: FollowCameraProps) {
  const { camera } = useThree();
  const initialized = useRef(false);

  const camOffset = levelId === 3
    ? new THREE.Vector3(0, 5, 8)
    : new THREE.Vector3(0, 4.5, 7);

  const currentPos = useRef(target.clone().add(camOffset));
  const currentLookAt = useRef(target.clone().add(new THREE.Vector3(0, 0.5, 0)));

  // Snap camera immediately on first render so there's no lerp-from-origin black flash
  useEffect(() => {
    if (!initialized.current) {
      const snap = target.clone().add(camOffset);
      currentPos.current.copy(snap);
      camera.position.copy(snap);
      const look = target.clone().add(new THREE.Vector3(0, 0.5, 0));
      currentLookAt.current.copy(look);
      camera.lookAt(look);
      initialized.current = true;
    }
  });

  useFrame(() => {
    const desired = target.clone().add(camOffset);
    currentPos.current.lerp(desired, 0.08);
    camera.position.copy(currentPos.current);

    const lookTarget = target.clone().add(new THREE.Vector3(0, 0.5, 0));
    currentLookAt.current.lerp(lookTarget, 0.1);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
