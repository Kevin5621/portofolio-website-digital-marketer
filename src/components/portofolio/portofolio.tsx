import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import { projects } from "./data/projects";
import { Project, PlanetData } from "./types";
import { easeInOutQuintic, updateCameraForPlanetFollowing } from "./hooks/transitions";
import { useCamera } from "./hooks/useCamera";
import { useWarpEffect } from "./hooks/useWarpEffect";

export function PortfolioGrid() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galaxyInitialized, setGalaxyInitialized] = useState(false);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  
  const { cameraTransitionRef, startCameraTransition } = useCamera();
  const { startWarpEffect, updateWarpEffect, isWarping } = useWarpEffect(
    sceneRef.current,
    cameraRef.current,
    rendererRef.current
  );
  
  const categoryPlanets = useRef<Map<string, PlanetData>>(new Map([
    ["all", { size: 2, color: 0xffcc33, distance: 0, orbitSpeed: 0, rotationSpeed: 0.002 }],
    ["Social Media", { size: 1.2, color: 0x3366ff, distance: 8, orbitSpeed: 0.002, rotationSpeed: 0.01 }],
    ["Video", { size: 1.5, color: 0xff5533, distance: 12, orbitSpeed: 0.0015, rotationSpeed: 0.008 }],
    ["Design", { size: 1, color: 0x88aa66, distance: 16, orbitSpeed: 0.001, rotationSpeed: 0.012 }]
  ]));

  const categories = ["all", "Social Media", "Video", "Design"];

  const filteredProjects = filter === "all" 
    ? [] 
    : projects.filter(project => project.category === filter);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage, 
    currentPage * projectsPerPage
  );
  
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  useEffect(() => {
    if (!galaxyInitialized) return;
    startCameraTransition(filter, categoryPlanets.current, cameraRef, controlsRef);
  }, [filter, galaxyInitialized]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (galaxyRef.current && !galaxyInitialized) {
        initGalaxy();
        setGalaxyInitialized(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!galaxyInitialized) return;

    const animate = (timestamp: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      if (sunRef.current) {
        sunRef.current.rotation.y += categoryPlanets.current.get("all")?.rotationSpeed || 0.002;
      }
      
      categoryPlanets.current.forEach((planetData, category) => {
        if (category !== "all" && planetData.planetRef && planetData.orbitObject) {
          planetData.planetRef.rotation.y += planetData.rotationSpeed;
          planetData.orbitObject.rotation.y += planetData.orbitSpeed;
          
          if (planetData.planetRef) {
            planetData.position = new THREE.Vector3().setFromMatrixPosition(
              planetData.planetRef.matrixWorld
            );
          }
        }
      });

      // Check if warp effect is active
      if (!isWarping()) {
        const transition = cameraTransitionRef.current;
        if (transition.inProgress) {
          if (transition.startTime === 0) {
            transition.startTime = timestamp;
          }
          
          const elapsed = timestamp - transition.startTime;
          const progress = Math.min(elapsed / transition.duration, 1);
          
          const easeProgress = easeInOutQuintic(progress);
          
          if (transition.followPlanet && transition.followCategory !== "all") {
            const planetData = categoryPlanets.current.get(transition.followCategory);
            if (planetData && planetData.position) {
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
            }
          }
          
          cameraRef.current.position.lerpVectors(
            transition.startPosition, 
            transition.targetPosition, 
            easeProgress
          );
          
          if (controlsRef.current) {
            controlsRef.current.target.lerpVectors(
              transition.startTarget,
              transition.targetTarget,
              easeProgress
            );
            controlsRef.current.update();
          }
          
          if (progress >= 1) {
            transition.inProgress = false;
            transition.startTime = 0;
            
            if (transition.followPlanet && transition.followCategory !== "all") {
              updateCameraForPlanetFollowing(
                transition.followCategory,
                categoryPlanets.current,
                controlsRef,
                cameraRef
              );
            } else if (transition.followCategory === "all") {
              if (controlsRef.current) {
                controlsRef.current.autoRotate = false;
              }
            }
          }
        } else if (filter !== "all") {
          updateCameraForPlanetFollowing(filter, categoryPlanets.current, controlsRef, cameraRef);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      } else {
        // Update warp effect if active
        updateWarpEffect(timestamp);
      }

      controlsRef.current?.update();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [galaxyInitialized, filter]);

  useEffect(() => {
    if (!galaxyInitialized) return;

    const handleResize = () => {
      if (!galaxyRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = galaxyRef.current.clientWidth;
      const height = galaxyRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [galaxyInitialized]);

  const initGalaxy = () => {
    if (!galaxyRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      galaxyRef.current.clientWidth / galaxyRef.current.clientHeight,
      0.1,
      1000
    );
    
    // Set initial camera position far out for warp effect
    camera.position.set(0, 200, 500);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(galaxyRef.current.clientWidth, galaxyRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    galaxyRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    const sunData = categoryPlanets.current.get("all");
    if (sunData) {
      const sunGeometry = new THREE.SphereGeometry(sunData.size, 32, 32);
      const sunMaterial = new THREE.MeshStandardMaterial({
        color: sunData.color,
        emissive: sunData.color,
        emissiveIntensity: 1
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);
      sunRef.current = sun;
      
      sunData.planetRef = sun;
      categoryPlanets.current.set("all", sunData);
    }
    
    categories.forEach(category => {
      if (category === "all") return;
      
      const planetData = categoryPlanets.current.get(category);
      if (!planetData) return;
      
      createPlanet(category, planetData);
    });
    
    createStars();
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const planetMeshes: THREE.Object3D[] = [];
      categories.forEach(category => {
        const planetData = categoryPlanets.current.get(category);
        if (planetData && planetData.planetRef) {
          planetMeshes.push(planetData.planetRef);
        }
      });
      
      const intersects = raycaster.intersectObjects(planetMeshes);
      
      if (intersects.length > 0) {
        for (const [category, data] of categoryPlanets.current.entries()) {
          if (data.planetRef === intersects[0].object) {
            setFilter(category);
            setCurrentPage(1);
            break;
          }
        }
      }
    });
    
    function createPlanet(category: string, planetData: PlanetData) {
      const { size, color, distance } = planetData;
      
      const orbitObject = new THREE.Object3D();
      scene.add(orbitObject);
      
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
      });
      
      const planet = new THREE.Mesh(geometry, material);
      
      const initialAngle = (categories.indexOf(category) / categories.length) * Math.PI * 2;
      planetData.initialAngle = initialAngle;
      
      planet.position.x = distance;
      
      orbitObject.add(planet);
      
      orbitObject.rotation.y = initialAngle;
      
      planetData.planetRef = planet;
      planetData.orbitObject = orbitObject;
      planetData.position = new THREE.Vector3(
        Math.cos(initialAngle) * distance,
        0,
        Math.sin(initialAngle) * distance
      );
      
      categoryPlanets.current.set(category, planetData);
      
      const orbitGeometry = new THREE.RingGeometry(distance - 0.03, distance + 0.03, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      
      addPlanetLabel(planet, category);
    }
    
    function addPlanetLabel(planet: THREE.Mesh, text: string) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      
      if (context) {
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 40px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);

        if (planet.geometry instanceof THREE.SphereGeometry) {
          sprite.position.y = planet.geometry.parameters.radius * 1.5;
        }

        planet.add(sprite);
      }
    }
    
    function createStars() {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
      });
      
      const starsVertices = [];
      for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);
    }
    
    // Start with warp effect instead of normal transition
    const startPos = new THREE.Vector3(0, 200, 500);
    const endPos = new THREE.Vector3(0, 20, 35);
    const startLookAt = new THREE.Vector3(0, 0, 0);
    const endLookAt = new THREE.Vector3(0, 0, 0);
    
    startWarpEffect(startPos, endPos, startLookAt, endLookAt);
  };

  return (
    <motion.div
    initial={{ scale: 0.3, filter: "blur(30px)", opacity: 0 }}
    animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
    exit={{ scale: 1.5, filter: "blur(15px)", opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="relative w-full h-full"
  >
    <section className="relative min-h-screen">
      <div 
        ref={galaxyRef} 
        className="absolute inset-0 w-full h-full z-0"
      ></div>
      
      <div className="relative z-10 py-20 px-4">
        <h2 className="text-4xl font-space font-bold text-center mb-12 text-white">
          <span className="gradient-text">Featured Works</span>
        </h2>

        {filter === "all" && (
          <div className="text-center text-white mb-12 animate-pulse">
            <p className="text-xl">Click on any planet to explore projects</p>
          </div>
        )}

        {filter !== "all" && (
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className="px-6 py-2 rounded-full transition-all bg-gray-800 text-gray-400 hover:text-white"
            >
              Back to Galaxy
            </button>
            
            {categories.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setFilter(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === category
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {filter !== "all" && (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {paginatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                
                <div className="flex items-center px-4">
                  <span className="text-white">
                    {currentPage} dari {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
  </motion.div>)
}