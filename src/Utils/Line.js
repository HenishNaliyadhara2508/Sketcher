import * as THREE from "three";

class Line {
  constructor(scene, camera, plane) {
    this.scene = scene;
    this.camera = camera;
    this.plane = plane;

    this.mouse = new THREE.Vector2(); // Mouse position in normalized device coordinates
    this.raycaster = new THREE.Raycaster(); // Raycaster for mouse picking
    this.isDrawing = false; // To track whether we are drawing the line
    this.startPoint = new THREE.Vector3(0, 0, 0); // Starting point of the line
    this.endPoint = new THREE.Vector3(0, 0, 0); // Ending point of the line
    this.line = null; // Line object to hold the line geometry and material
    this.sphereStart = null; // Sphere for start point
    this.sphereEnd = null; // Sphere for end point (follows the cursor)

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

  // Handle mouse down event (click to start or end drawing)
  handleClick(event) {
    this.updateMousePosition(event);

    // Get the intersection of the mouse with the plane
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        // First click: Start drawing the line
        this.startPoint = intersects[0].point; // Set the start point of the line
        this.isDrawing = true; // Set drawing state to true

        // Remove the previous line if there is one
        if (this.line) {
          this.scene.remove(this.line);
        }

        // Initialize the line geometry and material
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.line = new THREE.Line(geometry, material);
        this.line.position.y = 0.1;
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

        // Finalize the end point by placing the following sphere at the endpoint
        this.endPoint = intersects[0].point; // Set the final endpoint
        this.sphereEnd.position.copy(this.endPoint); // Move the following sphere to the final point
        this.sphereEnd.position.y = 0.1; // Place it at the final point
        // Update the line with the final start and end points
        const points = [this.startPoint, this.endPoint];
        this.line.geometry.setFromPoints(points);
        this.line.geometry.attributes.position.needsUpdate = true;

        // Stop following the cursor, as the drawing is complete
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
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane); // Perform the raycasting against the plane
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
}

export default Line;
