import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { useRef } from 'react';
import { PlanetData } from '../types';

export interface CameraTransition {
  inProgress: boolean;
  startTime: number;
  duration: number;
  startPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  startTarget: THREE.Vector3;
  targetTarget: THREE.Vector3;
  followPlanet: boolean;
  followCategory: string;
}

export const useCamera = () => {
  const cameraTransitionRef = useRef<CameraTransition>({
    inProgress: false,
    startTime: 0,
    duration: 1500,
    startPosition: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    targetTarget: new THREE.Vector3(),
    followPlanet: false,
    followCategory: "",
  });

  const startCameraTransition = (
    category: string,
    categoryPlanets: Map<string, PlanetData>,
    cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
    controlsRef: React.MutableRefObject<OrbitControls | null>
  ) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const transition = cameraTransitionRef.current;
    const planetData = categoryPlanets.get(category);
    
    if (!planetData) return;
    
    transition.startPosition = cameraRef.current.position.clone();
    transition.startTarget = controlsRef.current.target.clone();
    
    if (category === "all") {
      transition.targetPosition = new THREE.Vector3(0, 20, 35);
      transition.targetTarget = new THREE.Vector3(0, 0, 0);
      transition.followPlanet = false;
    } else if (planetData.position) {
      const planetPos = planetData.position;
      const orbitAngle = planetData.orbitObject?.rotation.y || 0;
      const offsetDistance = planetData.size * 5;
      
      const cameraOffset = new THREE.Vector3(
        Math.cos(orbitAngle - Math.PI/4) * offsetDistance,
        planetData.size * 3,
        Math.sin(orbitAngle - Math.PI/4) * offsetDistance
      );
      
      transition.targetPosition = planetPos.clone().add(cameraOffset);
      transition.targetTarget = planetPos.clone();
      transition.followPlanet = true;
    } else {
      return;
    }
    
    transition.inProgress = true;
    transition.startTime = 0;
    transition.followCategory = category;
  };

  return {
    cameraTransitionRef,
    startCameraTransition
  };
};