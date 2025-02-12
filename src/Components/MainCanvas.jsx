import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Line from "../Utils/Line";
import Circle from "../Utils/Circle";
import Ellipse from "../Utils/Ellipse";
import Polyline from "../Utils/Polyline";

const MainCanvas = ({ selectedShape }) => {
  const shape =selectedShape
  const canvasRef = useRef(null);
  const sceneRef = useRef(null); // To store the scene persistently
  const rendererRef = useRef(null); // To store the renderer persistently
  const cameraRef = useRef(null); // To store the camera persistently
  const planeRef = useRef(null); // To store the plane persistently
  const shapeDrawerRef = useRef(null); // To keep track of the current shape drawer

  useEffect(() => {
    // Create scene and renderer only once
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 5, 0); // Camera is above the plane
      camera.lookAt(new THREE.Vector3(0, 0, 0)); // Camera looks at the center of the plane
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xeeeeee); // Set the background color persistently
      rendererRef.current = renderer;
    }

    // Only create the plane once
    if (!planeRef.current) {
      const geometry = new THREE.PlaneGeometry(1000, 1000);
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

    // If there's an existing shapeDrawer, remove it and its event listeners
    if (shapeDrawerRef.current) {
      shapeDrawerRef.current.removeEventListeners();
    }

    // Clear any previous shape drawer and instantiate new one
    let shapeDrawer = null;
    if (shape === "line") {
      shapeDrawer = new Line(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (shape === "circle") {
      shapeDrawer = new Circle(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (shape === "ellipse") {
      shapeDrawer = new Ellipse(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (shape === "polyline") {
      shapeDrawer = new Polyline(sceneRef.current, cameraRef.current, planeRef.current);
    }

    if (shapeDrawer) {
      shapeDrawer.addEventListeners();
      shapeDrawerRef.current = shapeDrawer; // Update the current shape drawer
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Cleanup on unmount or when shape changes
    return () => {
      if (shapeDrawerRef.current) {
        shapeDrawerRef.current.removeEventListeners();
        shapeDrawerRef.current = null; // Reset the shape drawer reference
      }
    };
  }, [shape]); // Re-run when the selectedShape changes

  return <canvas ref={canvasRef} className="webgl" />;
};

export default MainCanvas;
