import * as THREE from "three";

class Polyline {
  constructor(scene, camera, plane) {
    this.scene = scene;
    this.camera = camera;
    this.plane = plane;

    this.mouse = new THREE.Vector2(); // Mouse position in normalized device coordinates
    this.raycaster = new THREE.Raycaster(); // Raycaster for mouse picking
    this.points = []; // Store the points of the polyline
    this.isDrawing = false; // Track if a new line segment is being drawn
    this.line = null; // Store the current line object
    this.polyline = []; // Store the lines of the polyline
    this.previousPoint = null; // Keep track of the last point in the polyline
    this.spheres = []; // Store spheres created at click points

    // Bind event listeners
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.addEventListeners();
  }

  // Add mouse event listeners
  addEventListeners() {
    document.addEventListener(
      "click",
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
      "click",
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
    const canvas = document.querySelector("canvas"); // Use document.querySelector to select the canvas
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
        // Start drawing the polyline
        this.startNewPolyline(currentPoint); // Clear previous polyline and start a new one
        this.points.push(currentPoint); // Add the starting point
        this.isDrawing = true;
        this.previousPoint = currentPoint; // Set the starting point
        this.createSphere(currentPoint); // Create a sphere at the start point
      } else {
        // Draw a new line segment from the last point to the current point
        this.points.push(currentPoint);
        this.updatePolyline();
        this.previousPoint = currentPoint; // Update the previous point
        this.createSphere(currentPoint); // Create a sphere at the new point
      }
    }
  }

  // Handle mouse move event (draw line)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.previousPoint) return; // Only update if a line is being drawn

    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane (update line end point)
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const currentPoint = intersects[0].point;
      this.updateLineSegment(currentPoint); // Update the current line segment
    }
    
    
  }

  handleDoubleClick() {
    this.isDrawing = false;
    this.line = null; 
    this.previousPoint = null; 
    this.startPoint = null;
    this.removeEventListeners();
  }

  // Start a new polyline, clearing the old points
  startNewPolyline(currentPoint) {
    this.points = []; // Reset the points array for the new polyline
    this.points.push(currentPoint); // Add the first point of the new polyline
  }

  // Create a sphere at the given point
  createSphere(position) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Apply a small Y-offset to avoid Z-fighting with the polyline
    sphere.position.copy(position);
    sphere.position.y += 0.1; // Apply the same Y-offset as the line

    this.scene.add(sphere); // Add the sphere to the scene
    this.spheres.push(sphere); // Store the sphere
  }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane);
  }

  // Update the current line segment being drawn
  updateLineSegment(currentPoint) {
    if (this.line) {
      // If a line exists, update it to the current mouse position
      this.line.geometry.setFromPoints([this.previousPoint, currentPoint]);
    } else {
      // Create a new line if no line exists yet
      const geometry = new THREE.BufferGeometry().setFromPoints([this.previousPoint, currentPoint]);
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide, linewidth: 5 });
      this.line = new THREE.Line(geometry, material);
      this.line.position.y = 0.1; // Slightly offset the line in the Y direction to avoid Z-fighting
      this.scene.add(this.line);
    }
  }

  // Update the polyline with new segments
  updatePolyline() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const polyline = new THREE.Line(geometry, material);
    polyline.position.y = 0.1; // Apply the same Y-offset as the line
    this.scene.add(polyline);
    this.polyline.push(polyline); // Add the new line segment to the polyline
  }
}

export default Polyline;
