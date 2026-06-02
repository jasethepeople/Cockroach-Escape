import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface FollowCameraProps {
  target: THREE.Vector3;
  levelId: number;
}

export function FollowCamera({ target, levelId }: FollowCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  // Alley has narrower field - push camera back more
  const camOffset = levelId === 3
    ? new THREE.Vector3(0, 5, 8)
    : new THREE.Vector3(0, 4.5, 7);

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
