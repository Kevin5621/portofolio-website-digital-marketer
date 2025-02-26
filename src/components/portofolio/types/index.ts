import * as THREE from 'three';

export interface Project {
    id: string;
    title: string;
    category: "Social Media" | "Video" | "Design";
    thumbnail: string;
    description: string;
    tools: string[];
    results: string[];
  }
  
  export interface PlanetData {
    size: number;
    color: number;
    distance: number;
    orbitSpeed: number;
    rotationSpeed: number;
    planetRef?: THREE.Mesh;
    orbitObject?: THREE.Object3D;
    position?: THREE.Vector3;
    initialAngle?: number;
  }