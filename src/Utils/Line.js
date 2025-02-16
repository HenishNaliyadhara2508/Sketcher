import * as THREE from "three";
import {shapeStore} from "../Store";

class Line {
  scene;
  camera;
  plane;
  
  constructor(scene, camera, plane) {
    this.scene = scene;
    this.plane = plane;
    this.camera = camera;  // Get camera from store
    
    

    // Other initialization logic
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.isDrawing = false;
    this.startPoint = new THREE.Vector3(0, 0, 0);
    this.endPoint = new THREE.Vector3(0, 0, 0);
    this.line = null;
    this.sphereStart = null;
    this.sphereEnd = null;
    this.points = [];

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.addEventListeners();
  }
  // Add event listeners to the canvas
  addEventListeners() {
    document.addEventListener("click", this.handleClick);
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  // Remove event listeners when done
  removeEventListeners() {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("mousemove", this.handleMouseMove);
  }

  updateMousePosition(event) {
    const canvas = document.querySelector("canvas");
    const boundingBox = canvas.getBoundingClientRect(); // Get the bounding box of the canvas

    // Calculate mouse position relative to the canvas
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;

    // Normalize the mouse position to NDC (-1 to 1) for Three.js raycaster
    this.mouse.x = (offsetX / boundingBox.width) * 2 - 1;
    this.mouse.y = -(offsetY / boundingBox.height) * 2 + 1;
  }

  handleClick(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        this.startPoint = intersects[0].point;
        this.isDrawing = true; // Set drawing state to true

        // Remove the previous line if there is one
        if (this.line) {
          this.scene.remove(this.line);
        }

        // Initialize the line geometry and material
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 ,side: THREE.DoubleSide, });
        this.line = new THREE.Line(geometry, material);
        this.line.position.y = 0.1;
        shapeStore.addShape(this.line);
        this.line.name = "Line";
        this.scene.add(this.line); // Add the new line to the scene

        // Create a sphere at the start point to indicate the start of the line
        const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        this.sphereStart = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphereStart.position.copy(this.startPoint);
        this.sphereStart.position.y = 0.1;
        this.scene.add(this.sphereStart); // Add to the scene

        // Create a sphere that will follow the cursor (this will become the end point)
        this.sphereEnd = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphereEnd.position.copy(this.startPoint);
        this.sphereEnd.position.y = 0.1; // Initially place it at the start point
        this.scene.add(this.sphereEnd); // Add to the scene
      } else {
        // Second click: Stop drawing the line
        this.isDrawing = false;

        this.endPoint = intersects[0].point;
        this.sphereEnd.position.copy(this.endPoint); // Move the following sphere to the final point
        this.sphereEnd.position.y = 0.1; // Place it at the final point

        const points = [this.startPoint, this.endPoint];
        this.line.geometry.setFromPoints(points);
        this.line.geometry.attributes.position.needsUpdate = true;

        // this.points = this.extractPointsFromGeometry(this.line.geometry);

        // console.log(this.points); // Log points

        this.removeEventListeners();
      }
    }
  }

  // Handle mouse move event to draw the line
  handleMouseMove(event) {
    if (this.isDrawing) {
      this.updateMousePosition(event);

      // Get the intersection of the mouse with the plane
      const intersects = this.getIntersection();
      if (intersects.length > 0) {
        this.endPoint = intersects[0].point; // Update the endpoint of the line

        // Update the line geometry with the new points (start and end)
        const points = [this.startPoint, this.endPoint];
        this.line.geometry.setFromPoints(points);
        this.line.geometry.attributes.position.needsUpdate = true; // Notify THREE.js that geometry has changed

        // Move the sphereEnd to follow the cursor
        if (this.sphereEnd) {
          this.sphereEnd.position.copy(intersects[0].point);
          this.sphereEnd.position.y = 0.1;
        }
      }
    }
  }

  // Get intersection of the ray with the plane
  getIntersection() {
    if (!this.camera || !(this.camera instanceof THREE.PerspectiveCamera)) {
      // console.error("Invalid camera type or camera is undefined", this.camera);
      return [];
    }
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const intersects = this.raycaster.intersectObject(this.plane);
    return intersects;
  }
  

  // External method to update the line's start and end points
  updateLinePoints(startingPoint, endingPoint) {
    this.startPoint.set(startingPoint.x, startingPoint.y, startingPoint.z);
    this.endPoint.set(endingPoint.x, endingPoint.y, endingPoint.z);

    // Update the line geometry
    const points = [this.startPoint, this.endPoint];
    if (this.line) {
      this.line.geometry.setFromPoints(points);
      this.line.geometry.attributes.position.needsUpdate = true; // Notify THREE.js that geometry has changed
    }
  }

  // Method to extract the points from the geometry's position attribute
  // extractPointsFromGeometry(geometry) {
  //   const positionAttribute = geometry.attributes.position;
  //   const points = [];

  //   for (let i = 0; i < positionAttribute.count; i++) {
  //     points.push({
  //       x: positionAttribute.getX(i),
  //       y: positionAttribute.getY(i),
  //       z: positionAttribute.getZ(i),
  //     });
  //   }

  //   return points;
  // }
}

export default Line;
