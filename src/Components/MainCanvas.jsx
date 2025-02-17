import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { shapeStore } from "../Store"; // Import the shape store
import Line from "../Utils/Line";
import Circle from "../Utils/Circle";
import Ellipse from "../Utils/Ellipse";
import Polyline from "../Utils/Polyline";
import { observer } from "mobx-react";

const MainCanvas = observer(() => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const planeRef = useRef(null);
  const rendererRef = useRef(null);
  const shapeDrawerRef = useRef(null); // Persist shape drawer across re-renders

  const [mouse] = useState(new THREE.Vector2()); // To store mouse coordinates
  const raycaster = new THREE.Raycaster(); // Raycaster instance

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      shapeStore.setScene(scene); // Set scene in store

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 5, 0); // Adjust camera position
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      cameraRef.current = camera;
      shapeStore.setCamera(camera); // Store the camera reference

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xeeeeee);
      rendererRef.current = renderer;
    }

    if (!planeRef.current) {
      const geometry = new THREE.PlaneGeometry(10000, 10000);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        opacity: 1,
        transparent: false,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI * 0.5;
      sceneRef.current.add(plane);
      planeRef.current = plane;
    }

    const createOrUpdateShape = (shapeType) => {
      let shapeDrawer = shapeDrawerRef.current;

      if (shapeDrawer) {
        shapeDrawer.removeEventListeners();
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

      // Persist shapeDrawer for future re-renders
      shapeDrawerRef.current = shapeDrawer;
    };

    // Ensure shapes are created or updated based on the selected shape in the store
    createOrUpdateShape(shapeStore.selectedShape);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Add click event listener
    window.addEventListener("click", onClick, false);

    function onClick(event) {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.params.Line.threshold = 0.3;
      // Set the raycaster from the camera and mouse position
      raycaster.setFromCamera(mouse, cameraRef.current);

      // Check intersections with objects
      const intersects = raycaster.intersectObjects(shapeStore.shapes, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        console.log("Clicked on:", clickedMesh);
        shapeStore.setEntity(clickedMesh);
      } else {
        console.log("No object clicked");
      }
    }

    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        requestAnimationFrame(animate);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      if (canvas) {
        // canvas.removeEventListener("click", selectShape); // Remove event listener on cleanup
      }
    };
  }, [shapeStore.selectedShape]); // React to changes in selectedShape from the store

  return <canvas ref={canvasRef} className="webgl" />;
});

export default MainCanvas;
