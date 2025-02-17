import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { shapeStore } from "../Store";
// import shapeToolStore from "../stores/shapeToolStore";

// import sceneStore from "../stores/sceneStore";
import Line from "../Utils/Line";
import Circle from "../Utils/Circle"; // Add other shapes as needed
import Ellipse from "../Utils/Ellipse";
import Polyline from "../Utils/Polyline";

const TOLERANCE = 1;

const MainCanvas = ({ selectedShape }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const planeRef = useRef(null);
  const rendererRef = useRef(null);
  const shapeDrawerRef = useRef(null); // Persist shape drawer across re-renders

  const [mouse] = useState(new THREE.Vector2()); // To store mouse coordinates
  const raycaster = new THREE.Raycaster(); // Raycaster instance

  // Function to initialize or update the shape
  const createOrUpdateShape = (shapeType) => {
    let shapeDrawer = shapeDrawerRef.current;

    if (shapeDrawer) {
      shapeDrawer.removeEventListeners(); // Remove previous listeners
      shapeDrawer.dispose(); // Dispose the old shape (optional cleanup)
    }

    // Create a new shape depending on the selected type
    if (shapeType === "Line") {
      shapeDrawer = new Line(
        sceneRef.current,
        cameraRef.current,
        planeRef.current
      );
    } else if (shapeType === "Circle") {
      shapeDrawer = new Circle(
        sceneRef.current,
        cameraRef.current,
        planeRef.current
      );
    } else if (shapeType === "Ellipse") {
      shapeDrawer = new Ellipse(
        sceneRef.current,
        cameraRef.current,
        planeRef.current
      );
    } else if (shapeType === "Polyline") {
      shapeDrawer = new Polyline(
        sceneRef.current,
        cameraRef.current,
        planeRef.current
      );
    }

    // shapeDrawer.addEventListeners();
    shapeDrawerRef.current = shapeDrawer;
  };

  const selectShape = (event) => {
    // Update mouse coordinates relative to the window
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.params.Line.threshold = TOLERANCE; // Adds tolerance for line/polyline selection
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Directly pass the shapes array from the store
    const allMeshes = shapeStore.shapes; // Assuming shapeStore.shapes is an array of meshes

    console.log(allMeshes, "allMeshes after mapping and flattening");

    // Perform raycasting with the updated array of meshes
    const intersects = raycaster.intersectObjects(allMeshes, true); // Ensure we pass meshes here
    console.log(intersects, "intersects after raycasting");

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      console.log(clickedMesh, "clickedMesh");

      // Set the clicked mesh in the shape store
      shapeStore.setEntity(clickedMesh);
      console.log(shapeStore.Entity(), "shapeStore.entity");
    }
};

  useEffect(() => {
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
      shapeStore.setCamera(camera); // Store the camera reference

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
    canvas.addEventListener("click", selectShape); // Use the selectShape for mouse click

    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        requestAnimationFrame(animate);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (shapeDrawerRef.current) {
        shapeDrawerRef.current.removeEventListeners();
        shapeDrawerRef.current = null; 
      }
      canvas.removeEventListener("click", selectShape); 
    };
  }, [selectedShape]); 

  return <canvas ref={canvasRef} className="webgl" />;
};

export default MainCanvas;
