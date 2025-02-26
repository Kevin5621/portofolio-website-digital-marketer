"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import { OrbitControls } from "three/examples/jsm/Addons.js";

interface Project {
  id: string;
  title: string;
  category: "Social Media" | "Video" | "Design";
  thumbnail: string;
  description: string;
  tools: string[];
  results: string[];
}

const projects: Project[] = [
  {
    id: "1",
    title: "Brand Campaign",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  {
    id: "2",
    title: "Binjasimen Samapta",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  {
    id: "3",
    title: "Rumah Bahasa Asing",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  {
    id: "4",
    title: "Kronju",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  {
    id: "5",
    title: "Aerospace",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  {
    id: "6",
    title: "Shinji Film",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  // ... tambahkan proyek lainnya
];

// Map kategori ke planet
interface PlanetData {
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
  
  // Ref for tracking camera transition animation
  const cameraTransitionRef = useRef({
    inProgress: false,
    startTime: 0,
    duration: 1500, // Longer transition for smoothness (1.5 seconds)
    startPosition: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    targetTarget: new THREE.Vector3(),
    followPlanet: false,
    followCategory: "",
  });
  
  // Referensi untuk planet per kategori
  const categoryPlanets = useRef<Map<string, PlanetData>>(new Map([
    ["all", { size: 2, color: 0xffcc33, distance: 0, orbitSpeed: 0, rotationSpeed: 0.002 }],
    ["Social Media", { size: 1.2, color: 0x3366ff, distance: 8, orbitSpeed: 0.002, rotationSpeed: 0.01 }],
    ["Video", { size: 1.5, color: 0xff5533, distance: 12, orbitSpeed: 0.0015, rotationSpeed: 0.008 }],
    ["Design", { size: 1, color: 0x88aa66, distance: 16, orbitSpeed: 0.001, rotationSpeed: 0.012 }]
  ]));

  const categories = ["all", "Social Media", "Video", "Design"];

  // Modify to show no projects when "all" is selected
  const filteredProjects = filter === "all" 
    ? [] 
    : projects.filter(project => project.category === filter);

  // Modifikasi filtered projects untuk paginasi
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage, 
    currentPage * projectsPerPage
  );
  
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Handle category filter change
  useEffect(() => {
    if (!galaxyInitialized) return;
  
    // Focus camera on selected category's planet with smooth transition
    startCameraTransition(filter);
  }, [filter, galaxyInitialized]);
  
  // Initialize Galaxy
  useEffect(() => {
    // Menambahkan delay kecil untuk memastikan DOM sudah siap
    const timer = setTimeout(() => {
      if (galaxyRef.current && !galaxyInitialized) {
        initGalaxy();
        setGalaxyInitialized(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation loop
  useEffect(() => {
    if (!galaxyInitialized) return;

    const animate = (timestamp: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // Animate sun rotation
      if (sunRef.current) {
        sunRef.current.rotation.y += categoryPlanets.current.get("all")?.rotationSpeed || 0.002;
      }
      
      // Animate planet rotations and update positions
      categoryPlanets.current.forEach((planetData, category) => {
        if (category !== "all" && planetData.planetRef && planetData.orbitObject) {
          // Rotate planets around their own axis
          planetData.planetRef.rotation.y += planetData.rotationSpeed;
          
          // Rotate the orbit object around the sun
          planetData.orbitObject.rotation.y += planetData.orbitSpeed;
          
          // Update the planet's position in our data structure
          if (planetData.planetRef) {
            planetData.position = new THREE.Vector3().setFromMatrixPosition(
              planetData.planetRef.matrixWorld
            );
          }
        }
      });
      
      // Handle camera transitions - improved smooth animation
      const transition = cameraTransitionRef.current;
      if (transition.inProgress) {
        if (transition.startTime === 0) {
          transition.startTime = timestamp;
        }
        
        const elapsed = timestamp - transition.startTime;
        const progress = Math.min(elapsed / transition.duration, 1);
        
        // Smoother easing function
        const easeProgress = easeInOutQuintic(progress);
        
        if (transition.followPlanet && transition.followCategory !== "all") {
          // Get the current planet position as it's moving
          const planetData = categoryPlanets.current.get(transition.followCategory);
          if (planetData && planetData.position) {
            // Calculate offset position with a trailing effect
            const planetPos = planetData.position;
            const orbitAngle = planetData.orbitObject?.rotation.y || 0;
            const offsetDistance = planetData.size * 5;
            
            // Position slightly behind planet in its orbit
            const cameraOffset = new THREE.Vector3(
              Math.cos(orbitAngle - Math.PI/4) * offsetDistance,
              planetData.size * 3, // Slightly above
              Math.sin(orbitAngle - Math.PI/4) * offsetDistance
            );
            
            // Gradually update target position to follow planet
            transition.targetPosition = planetPos.clone().add(cameraOffset);
            transition.targetTarget = planetPos.clone();
          }
        }
        
        // Update camera position with smoothing
        cameraRef.current.position.lerpVectors(
          transition.startPosition, 
          transition.targetPosition, 
          easeProgress
        );
        
        // Update controls target (what camera looks at) with smoothing
        if (controlsRef.current) {
          controlsRef.current.target.lerpVectors(
            transition.startTarget,
            transition.targetTarget,
            easeProgress
          );
          controlsRef.current.update();
        }
        
        // End transition when complete
        if (progress >= 1) {
          transition.inProgress = false;
          transition.startTime = 0;
          
          // If we're following a planet, update the camera mode
          if (transition.followPlanet && transition.followCategory !== "all") {
            // Keep updating camera in animate loop after transition
            updateCameraForPlanetFollowing(transition.followCategory);
          } else if (transition.followCategory === "all") {
            // For "all" view, disable auto-rotation
            if (controlsRef.current) {
              controlsRef.current.autoRotate = false;
            }
          }
        }
      } else if (filter !== "all") {
        // Continue to smoothly follow the planet after transition
        updateCameraForPlanetFollowing(filter);
      }

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
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

  // Handle window resize
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

  // Improved easing function for smoother animation
  const easeInOutQuintic = (t: number): number => {
    return t < 0.5 
      ? 16 * t * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 5) / 2;
  };

  // Function to continuously update camera position to follow planet
  const updateCameraForPlanetFollowing = (category: string) => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    if (category === "all") return;
    
    const planetData = categoryPlanets.current.get(category);
    if (!planetData || !planetData.position) return;
    
    // Get current planet position
    const planetPos = planetData.position;
    
    // Calculate a position with slight delay for smoother following
    const orbitAngle = planetData.orbitObject?.rotation.y || 0;
    const offsetDistance = planetData.size * 5;
    
    // Create an offset that keeps camera slightly behind the planet in orbit
    const cameraOffset = new THREE.Vector3(
      Math.cos(orbitAngle - Math.PI/4) * offsetDistance,
      planetData.size * 3, // Slightly above
      Math.sin(orbitAngle - Math.PI/4) * offsetDistance
    );
    
    // Calculate target position for camera
    const targetCamPos = planetPos.clone().add(cameraOffset);
    
    // Smoothly interpolate camera to new position with damping
    cameraRef.current.position.lerp(targetCamPos, 0.05);
    
    // Update where the camera is looking
    controlsRef.current.target.lerp(planetPos, 0.1);
  };

  // Function to start a camera transition with improved smoothness
  const startCameraTransition = (category: string) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const transition = cameraTransitionRef.current;
    const planetData = categoryPlanets.current.get(category);
    
    if (!planetData) return;
    
    // Save current camera state
    transition.startPosition = cameraRef.current.position.clone();
    transition.startTarget = controlsRef.current.target.clone();
    
    // Determine target based on category
    if (category === "all") {
      // View entire system
      transition.targetPosition = new THREE.Vector3(0, 20, 35);
      transition.targetTarget = new THREE.Vector3(0, 0, 0);
      transition.followPlanet = false;
    } else if (planetData.position) {
      // Calculate initial position to view the planet
      const planetPos = planetData.position;
      const orbitAngle = planetData.orbitObject?.rotation.y || 0;
      const offsetDistance = planetData.size * 5;
      
      // Position camera at offset from planet
      const cameraOffset = new THREE.Vector3(
        Math.cos(orbitAngle - Math.PI/4) * offsetDistance,
        planetData.size * 3, // Slightly above
        Math.sin(orbitAngle - Math.PI/4) * offsetDistance
      );
      
      transition.targetPosition = planetPos.clone().add(cameraOffset);
      transition.targetTarget = planetPos.clone();
      transition.followPlanet = true;
    } else {
      return;
    }
    
    // Set up and start the transition
    transition.inProgress = true;
    transition.startTime = 0;
    transition.followCategory = category;
  };

  // Initialize Three.js scene
  const initGalaxy = () => {
    if (!galaxyRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      galaxyRef.current.clientWidth / galaxyRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    camera.position.y = 15;
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(galaxyRef.current.clientWidth, galaxyRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    galaxyRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light (sun-like)
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Create sun (representing "all" category)
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
      
      // Store the mesh reference in the planet data
      sunData.planetRef = sun;
      categoryPlanets.current.set("all", sunData);
    }
    
    // Create planets for each category with click interaction
    categories.forEach(category => {
      if (category === "all") return; // Skip "all" as it's the sun
      
      const planetData = categoryPlanets.current.get(category);
      if (!planetData) return;
      
      createPlanet(category, planetData);
    });
    
    // Add stars
    createStars();
    
    // Add controls with improved damping for smoother movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1; // Increased for smoother motion
    controls.rotateSpeed = 0.5; // Slower rotation for smoother feel
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5; // Slower zoom for more control
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;
    
    // Add raycaster for planet interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Add click event listener to the canvas
    renderer.domElement.addEventListener('click', (event) => {
      // Get mouse position
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Get all meshes in the scene that are planets
      const planetMeshes: THREE.Object3D[] = [];
      categories.forEach(category => {
        const planetData = categoryPlanets.current.get(category);
        if (planetData && planetData.planetRef) {
          planetMeshes.push(planetData.planetRef);
        }
      });
      
      // Check for intersections
      const intersects = raycaster.intersectObjects(planetMeshes);
      
      if (intersects.length > 0) {
        // Find which category this planet belongs to
        for (const [category, data] of categoryPlanets.current.entries()) {
          if (data.planetRef === intersects[0].object) {
            // Set the filter to this category
            setFilter(category);
            setCurrentPage(1); // Reset page when changing categories
            break;
          }
        }
      }
    });
    
    // Helper function to create planets for categories
    function createPlanet(category: string, planetData: PlanetData) {
      const { size, color, distance } = planetData;
      
      // Create a parent object for orbital movement (empty container)
      const orbitObject = new THREE.Object3D();
      scene.add(orbitObject);
      
      // Create the planet
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
      });
      
      const planet = new THREE.Mesh(geometry, material);
      
      // Set initial angle (to spread planets around)
      const initialAngle = (categories.indexOf(category) / categories.length) * Math.PI * 2;
      planetData.initialAngle = initialAngle;
      
      // Position the planet at its orbital distance
      planet.position.x = distance;
      
      // Add the planet to the orbit object (not directly to the scene)
      orbitObject.add(planet);
      
      // Set the initial rotation of the orbit object to spread planets
      orbitObject.rotation.y = initialAngle;
      
      // Store references
      planetData.planetRef = planet;
      planetData.orbitObject = orbitObject;
      planetData.position = new THREE.Vector3(
        Math.cos(initialAngle) * distance,
        0,
        Math.sin(initialAngle) * distance
      );
      
      categoryPlanets.current.set(category, planetData);
      
      // Add orbit visualization
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
      
      // Add planet name label
      addPlanetLabel(planet, category);
    }
    
    // Helper function to add text labels to planets
    function addPlanetLabel(planet: THREE.Mesh, text: string) {
      // Create 2D canvas for the text
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
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create sprite material
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);

        // Cast the geometry to SphereGeometry to access parameters
        if (planet.geometry instanceof THREE.SphereGeometry) {
          sprite.position.y = planet.geometry.parameters.radius * 1.5;
        }

        planet.add(sprite);
      }
    }
    
    // Create stars background
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
    
    // Set initial view
    startCameraTransition("all");
  };

  return (
    <section className="relative min-h-screen">
      <div 
        ref={galaxyRef} 
        className="absolute inset-0 w-full h-full z-0"
      ></div>
      
      <div className="relative z-10 py-20 px-4">
        <h2 className="text-4xl font-space font-bold text-center mb-12 text-white">
          <span className="gradient-text">Featured Works</span>
        </h2>

        {/* Add instruction for users on initial screen */}
        {filter === "all" && (
          <div className="text-center text-white mb-12 animate-pulse">
            <p className="text-xl">Click on any planet to explore projects</p>
          </div>
        )}

        {/* Only show category buttons for non-"all" filter */}
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

        {/* Only render projects if filter is not "all" */}
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
            
            {/* Pagination controls */}
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
}