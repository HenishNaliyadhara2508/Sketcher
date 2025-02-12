import * as THREE from "three";

export class Circle {
  constructor(scene, camera, plane) {
    this.radius = 0;
    this.scene = scene;
    this.camera = camera;
    this.plane = plane;

    this.mouse = new THREE.Vector2(); // Mouse position in normalized device coordinates
    this.raycaster = new THREE.Raycaster(); // Raycaster for mouse picking
    this.isDrawing = false; // Track if the circle is being drawn
    this.center = null; // Center of the circle
    this.circle = null; // The circle object
    this.sphere = null; // Sphere at the center

    // Bind event listeners
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    // Add event listeners
    this.addEventListeners();
  }

  // Add event listeners
  addEventListeners() {
    document.addEventListener("click", this.handleClick);
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  // Remove event listeners
  removeEventListeners() {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("mousemove", this.handleMouseMove);
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

  // Handle click event (start drawing circle or finalize it)
  handleClick(event) {
    this.updateMousePosition(event);

    const intersects = this.getIntersection();
    console.log(intersects)
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        // On first click, set the center point
        this.center = intersects[0].point;
        console.log(this.center, "center");
        this.isDrawing = true; // Set drawing state to true
      } else {
        // On second click, finalize the circle (finish drawing)
        this.radius = this.center.distanceTo(intersects[0].point);
        this.updateCircle(); // Update the circle to finalize it
        this.createSphereAtCenter(); // Create a sphere at the center of the circle
        this.isDrawing = false;
        this.circle = null; // Reset drawing state
        this.removeEventListeners();
      }
    }
  }

  // Handle mouse move event (dynamically update the circle radius)
  handleMouseMove(event) {
    if (!this.isDrawing || !this.center) return; // Only update if we have a center

    this.updateMousePosition(event);

    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      // Update the radius as the mouse moves
      this.radius = this.center.distanceTo(intersects[0].point);
      this.updateCircle(); // Update the circle in real-time
    }
  }

  // Get the intersection between the mouse and the plane
  getIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera); // Set ray origin from camera
    return this.raycaster.intersectObject(this.plane); // Get intersection with the plane
  }

  // Update circle geometry with the new radius
  updateCircle() {
    const offsetY = 0.1; // Small offset to avoid Z-fighting

    if (this.circle) {
      this.circle.geometry = new THREE.RingGeometry(
        this.radius - 0.01,
        this.radius,
        32
      );
    } else {
      const geometry = new THREE.RingGeometry(
        this.radius - 0.01,
        this.radius,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
      });
      this.circle = new THREE.Mesh(geometry, ringMaterial);
      this.circle.position.set(this.center.x, this.center.y + offsetY, this.center.z); // Apply the offset
      this.circle.rotation.x = Math.PI / 2; // Rotate to make it lie flat on the plane
      this.scene.add(this.circle);
    }
  }

  // Create a sphere at the center of the circle
  createSphereAtCenter() {
    const sphereRadius = 0.05; // Define the sphere radius
    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red sphere
    this.sphere = new THREE.Mesh(geometry, material);
    
    // Apply a small offset in the Y-direction to avoid Z-fighting
    this.sphere.position.set(this.center.x, this.center.y + 0.1, this.center.z);
    
    this.scene.add(this.sphere); // Add the sphere to the scene
  }
}

export default Circle;
