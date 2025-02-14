import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import shapeStore from "../Store";
import Line from "../Utils/Line";
import Circle from "../Utils/Circle";  // Add other shapes as needed
import Ellipse from "../Utils/Ellipse";
import Polyline from "../Utils/Polyline";

const MainCanvas = ({ selectedShape }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const planeRef = useRef(null);
  const rendererRef = useRef(null);
  const shapeDrawerRef = useRef(null); // Persist shape drawer across re-renders

  const [mouse] = useState(new THREE.Vector2()); // To store mouse coordinates
  const raycaster = useRef(new THREE.Raycaster()); // Raycaster instance

  // Function to initialize or update the shape
  const createOrUpdateShape = (shapeType) => {
    let shapeDrawer = shapeDrawerRef.current;

    if (shapeDrawer) {
      shapeDrawer.removeEventListeners(); // Remove previous listeners
      shapeDrawer.dispose(); // Dispose the old shape (optional cleanup)
    }

    // Create a new shape depending on the selected type
    if (shapeType === "Line") {
      shapeDrawer = new Line(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (shapeType === "Circle") {
      shapeDrawer = new Circle(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (shapeType === "Ellipse") {
      shapeDrawer = new Ellipse(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (shapeType === "Polyline") {
      shapeDrawer = new Polyline(sceneRef.current, cameraRef.current, planeRef.current);
    }

    shapeDrawer.addEventListeners(); 
    shapeDrawerRef.current = shapeDrawer; 
  };

  const handleMouseClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster's position
    raycaster.current.update(); 

    // Cast the ray to see which object is intersected
    const intersects = raycaster.current.intersectObjects(shapeStore.getAllEntities());
    console.log(shapeStore.getAllEntities(), "shapeStore.getAllEntities()");
    console.log(intersects, "intersects");

    if (intersects.length > 0) {
      const selected = intersects[0].object;  
      shapeStore.setCurrentEntity(selected);  
    }
  };

  useEffect(() => {
    // Initialize scene and camera
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      shapeStore.setScene(scene);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 5, 0);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      cameraRef.current = camera;
      shapeStore.setCamera(camera);  // Store the camera reference

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xeeeeee);
      rendererRef.current = renderer;
    }

    // Set up the plane if not already present
    if (!planeRef.current) {
      const geometry = new THREE.PlaneGeometry(10000, 10000);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = 0;
      sceneRef.current.add(plane);
      planeRef.current = plane;
    }

    // Call the function to create or update the shape based on the selectedShape prop
    createOrUpdateShape(selectedShape);

    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleMouseClick);

    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        requestAnimationFrame(animate);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup on component unmount or when selectedShape changes
    return () => {
      if (shapeDrawerRef.current) {
        shapeDrawerRef.current.removeEventListeners();
        shapeDrawerRef.current = null; // Nullify the reference to cleanup resources
      }
      canvas.removeEventListener("click", handleMouseClick);  // Remove event listener on cleanup
    };
  }, [selectedShape]); // Re-run only if selectedShape changes

  return <canvas ref={canvasRef} className="webgl" />;
};

export default MainCanvas;
