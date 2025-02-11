// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// const MainCanvas = () => {
//   const canvasRef = useRef(null);
//   const [points, setPoints] = useState([]); // Stores all points for multiple lines
//   const [tempLine, setTempLine] = useState(null); // Temporary line for dynamic drawing
//   const [isDrawing, setIsDrawing] = useState(false); // Track if drawing is in progress
//   const sceneRef = useRef(new THREE.Scene());
//   const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
//   const rendererRef = useRef(null);
//   const raycasterRef = useRef(new THREE.Raycaster());
//   const pointerRef = useRef(new THREE.Vector2());

//   useEffect(() => {
//     const scene = sceneRef.current;
//     const camera = cameraRef.current;
//     const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
//     rendererRef.current = renderer;

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xeeeeee);

//     // Plane for intersection
//     const geometry = new THREE.PlaneGeometry(1000, 1000);
//     const material = new THREE.MeshBasicMaterial({
//       color: 0xffffff,
//       side: THREE.DoubleSide,
//     });
//     const plane = new THREE.Mesh(geometry, material);
//     plane.rotation.x = -Math.PI / 2;
//     scene.add(plane);

//     camera.position.set(0, 5, 5);
//     camera.lookAt(0, 0, 0);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };

//     animate();

//     return () => {
//       renderer.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     const handlePointerDown = (event) => {
//       pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
//       pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

//       raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);

//       const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

//       if (intersects.length > 0) {
//         const point = intersects[0].point;

//         // Add a small sphere at the clicked point
//         const sphereGeometry = new THREE.SphereGeometry(0.05, 64, 64 );
//         const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//         const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//         sphere.position.copy(point);
//         sceneRef.current.add(sphere);

//         // Update points state
//         setPoints((prevPoints) => {
//           const newPoints = [...prevPoints, point];
//           return newPoints;
//         });

//         setIsDrawing(true); // Start drawing
//       }
//     };

//     const handlePointerMove = (event) => {
//       if (isDrawing) {
//         pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
//         pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

//         raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);

//         const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

//         if (intersects.length > 0) {
//           const point = intersects[0].point;

//           // Get the last point from the points array
//           const lastPoint = points[points.length - 1];

//           // Create or update the temporary line
//           if (tempLine) {
//             // Update the existing temporary line
//             const lineGeometry = new THREE.BufferGeometry().setFromPoints([lastPoint, point]);
//             tempLine.geometry = lineGeometry;
//           } else {
//             // Create a new temporary line
//             const lineGeometry = new THREE.BufferGeometry().setFromPoints([lastPoint, point]);
//             const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
//             const line = new THREE.Line(lineGeometry, lineMaterial);
//             sceneRef.current.add(line);
//             setTempLine(line); // Store the temporary line reference
//           }
//         }
//       }
//     };

//     const handlePointerUp = () => {
//       if (isDrawing) {
//         setIsDrawing(false); // Stop drawing
//         setTempLine(null); // Reset the temporary line
//       }
//     };

//     document.addEventListener("pointerdown", handlePointerDown);
//     document.addEventListener("pointermove", handlePointerMove);
//     document.addEventListener("pointerup", handlePointerUp);

//     return () => {
//       document.removeEventListener("pointerdown", handlePointerDown);
//       document.removeEventListener("pointermove", handlePointerMove);
//       document.removeEventListener("pointerup", handlePointerUp);
//     };
//   }, [points, isDrawing, tempLine]);

//   return <canvas ref={canvasRef} className="webgl" />;
// };

// export default MainCanvas;
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const MainCanvas = () => {
  const canvasRef = useRef(null);
  const [centerPoint, setCenterPoint] = useState(null); // Center of the circle
  const [isDrawing, setIsDrawing] = useState(false); // Track if drawing is in progress
  const [isFirstClick, setIsFirstClick] = useState(true); // Flag for first click
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const circleRef = useRef(null); // Reference to the current circle object

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee);

    // Plane for intersection
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const handleMouseClick = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);

      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

      if (intersects.length > 0) {
        const point = intersects[0].point;

        if (isFirstClick) {
          // Set the center point on the first click
          setCenterPoint(point); // Set the center of the circle
          setIsFirstClick(false); // Switch to second click state

          // Add a small sphere at the center point (just for visualization)
          const sphereGeometry = new THREE.SphereGeometry(0.01, 32, 32);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.copy(point);
          sceneRef.current.add(sphere);
        } else {
          const radius = centerPoint.distanceTo(point);

          const circleGeometry = new THREE.CircleGeometry(radius, 128);
          const circleMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
          });
          const circle = new THREE.Mesh(circleGeometry, circleMaterial);
          circle.position.copy(centerPoint);
          circle.rotation.x = -Math.PI / 2; 
          sceneRef.current.add(circle);

          
          setIsFirstClick(true);
          setCenterPoint(null);
        }
      }
    };

    const handleMouseMove = (event) => {
      if (!isFirstClick && centerPoint) {
        pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);

        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

        if (intersects.length > 0) {
          const point = intersects[0].point;

          const radius = centerPoint.distanceTo(point);

          if (circleRef.current) {
            circleRef.current.scale.set(radius, radius, radius);
            circleRef.current.geometry.dispose();
            circleRef.current.geometry = new THREE.CircleGeometry(radius, 128);
            circleRef.current.position.copy(centerPoint);
          } else {
            const circleGeometry = new THREE.CircleGeometry(radius, 128);
            const circleMaterial = new THREE.MeshBasicMaterial({
              color: 0x0000ff,
              side: THREE.DoubleSide,
            });
            const circle = new THREE.Mesh(circleGeometry, circleMaterial);
            circle.position.copy(centerPoint);
            circle.rotation.x = -Math.PI / 2; 
            sceneRef.current.add(circle);
            circleRef.current = circle; 
          }
        }
      }
    };

    document.addEventListener("click", handleMouseClick);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("click", handleMouseClick);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [centerPoint, isFirstClick]);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default MainCanvas;

