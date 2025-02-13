import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import shapeStore from "../Store";
import Line from "../Utils/Line";
import Circle from "../Utils/Circle";  // Add other shapes as needed
import Ellipse from "../Utils/Ellipse";
import Polyline from "../Utils/Polyline";

const MainCanvas = ({selectedShape}) => {
 
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const planeRef = useRef(null);
  const rendererRef = useRef(null);
  const shapeDrawerRef = useRef(null);

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

      // Set the camera in the shapeStore
      shapeStore.setCamera(camera);  // Store the camera reference

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xeeeeee);
      rendererRef.current = renderer;
      // Store the renderer if necessary
    }

    // Ensure plane is set up only once
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

    // Shape drawer setup
    let shapeDrawer = null;

    if (selectedShape === "Line") {
      console.log(planeRef.current);
      shapeDrawer = new Line(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (selectedShape === "Circle") {
      shapeDrawer = new Circle(sceneRef.current, cameraRef.current, planeRef.current);
    } else if (selectedShape === "Ellipse") {
      shapeDrawer = new Ellipse(sceneRef.current, cameraRef.current, planeRef.current);
    } 
    else if(selectedShape === "Polyline") {
      shapeDrawer = new Polyline(sceneRef.current, cameraRef.current, planeRef.current);
      console.log(shapeDrawer, "shapeDrawer");
    }

    // Cleanup previous shape if any
    if (shapeDrawerRef.current) {
      shapeDrawerRef.current.removeEventListeners();  // Remove old shape listeners
      // You can add additional cleanup logic here, if necessary
    }

    // Assign new shape to shapeDrawerRef
    if (shapeDrawer) {
      shapeDrawer.addEventListeners();
      shapeDrawerRef.current = shapeDrawer;
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      // Cleanup shape on component unmount or selectedShape change
      if (shapeDrawerRef.current) {
        shapeDrawerRef.current.removeEventListeners();
        shapeDrawerRef.current = null;
      }

      // Additional cleanup can be done here if necessary (e.g., disposing resources)
    };
  }, [selectedShape]);  // Re-run if the selected shape changes

  return <canvas ref={canvasRef} className="webgl" />;
};

export default MainCanvas;
