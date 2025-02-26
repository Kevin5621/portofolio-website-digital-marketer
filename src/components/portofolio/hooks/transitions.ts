import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { PlanetData } from '../types';

export const easeInOutQuintic = (t: number): number => {
  return t < 0.5 
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

export const updateCameraForPlanetFollowing = (
  category: string,
  categoryPlanets: Map<string, PlanetData>,
  controlsRef: React.MutableRefObject<OrbitControls | null>,
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>
) => {
  if (!controlsRef.current || !cameraRef.current) return;
  
  if (category === "all") return;
  
  const planetData = categoryPlanets.get(category);
  if (!planetData || !planetData.position) return;
  
  const planetPos = planetData.position;
  const orbitAngle = planetData.orbitObject?.rotation.y || 0;
  const offsetDistance = planetData.size * 5;
  
  const cameraOffset = new THREE.Vector3(
    Math.cos(orbitAngle - Math.PI/4) * offsetDistance,
    planetData.size * 3,
    Math.sin(orbitAngle - Math.PI/4) * offsetDistance
  );
  
  const targetCamPos = planetPos.clone().add(cameraOffset);
  cameraRef.current.position.lerp(targetCamPos, 0.05);
  controlsRef.current.target.lerp(planetPos, 0.1);
};