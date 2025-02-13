import * as THREE from "three";
import shapeStore from "../Store";

class Polyline {
  constructor(scene, camera,plane) {
    this.scene = scene;
    this.camera = shapeStore.getCamera();
    this.plane = plane;

    this.mouse = new THREE.Vector2(); 
    this.raycaster = new THREE.Raycaster();
    this.points = []; // Store the points of the polyline
    this.isDrawing = false; // Track if a new line segment is being drawn
    this.line = null; // Store the current line object
    this.polyline = null; // Store the polyline
    this.previousPoint = null; // Keep track of the last point in the polyline

    // Bind event listeners
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.addEventListeners();
  }

  // Add mouse event listeners
  addEventListeners() {
    document.addEventListener(
      "mousedown",
      this.handleMouseDown
    );
    document.addEventListener(
      "mousemove",
      this.handleMouseMove
    );
    document.addEventListener(
      "dblclick",
      this.handleDoubleClick
    ); // Listen for double-click to finalize
  }

  // Remove event listeners (cleanup)
  removeEventListeners() {
    document.removeEventListener(
      "mousedown",
      this.handleMouseDown
    );
    document.removeEventListener(
      "mousemove",
      this.handleMouseMove
    );
    document.removeEventListener(
      "dblclick",
      this.handleDoubleClick
    );
  }

  // Update mouse position (from normalized device coordinates to world space)
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

  // Handle mouse down event (start new line segment or add to polyline)
  handleMouseDown(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (start or end point of the line)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const currentPoint = intersects[0].point;

      if (!this.isDrawing) {
        // Start drawing the polyline with the first point
        this.startNewPolyline(currentPoint);
        this.isDrawing = true;
      } else {
        // Add a new line segment from the last point to the current point
        this.addLineSegment(currentPoint);
      }

      this.previousPoint = currentPoint; // Update the previous point
    }
  }

  handleMouseMove(event) {
    if (!this.isDrawing || !this.previousPoint) return; // Only update if a line is being drawn

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update line end point)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const currentPoint = intersects[0].point;
      this.updateLastLineSegment(currentPoint); // Update the current line segment
    }
  }

  // Handle double-click event to finalize the polyline
  handleDoubleClick() {
    this.isDrawing = false; // Stop drawing new line segments
    shapeStore.addShape(this.polyline); // Add the final polyline to the scene
    this.removeEventListeners(); // Remove event listeners
  }

  // Start a new polyline with the first point
  startNewPolyline(startPoint) {
    this.points = [startPoint]; // Start with the first point
    this.createPolyline(); // Create the polyline object
  }

  // Create the polyline object
  createPolyline() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    this.polyline = new THREE.Line(geometry, material);
    this.polyline.position.y = 0.5;
    this.polyline.name = "Polyline";
    this.scene.add(this.polyline); // Add the polyline to the scene
  }

  // Add a new line segment to the polyline
  addLineSegment(currentPoint) {
    this.points.push(currentPoint); // Add the new point to the points array
    this.updatePolyline(); // Update the polyline geometry with the new point
  }

  // Update the polyline's geometry with the current points
  updatePolyline() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.polyline.geometry.dispose(); // Dispose of old geometry to free memory
    this.polyline.geometry = geometry; // Update the geometry of the polyline
  }

  // Update the last line segment being drawn dynamically as the mouse moves
  updateLastLineSegment(currentPoint) {
    if (this.points.length > 0) {
      // Update the last segment
      this.points[this.points.length - 1] = currentPoint;
      this.updatePolyline();
    }
  }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane); // Check for intersection with the plane
  }
}

export default Polyline;

