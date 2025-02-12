import * as THREE from "three";

class Ellipse {
  constructor(scene, camera, plane) {
    this.scene = scene;
    this.camera = camera;
    this.plane = plane;

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.center = null;
    this.radiusX = 0;
    this.radiusY = 0;
    this.ellipse = null;
    this.isDrawing = false;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("click", this.handleMouseDown);
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  removeEventListeners() {
    document.removeEventListener("click", this.handleMouseDown);
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

  handleMouseDown(event) {
    this.updateMousePosition(event);

    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      if (!this.isDrawing) {
        this.center = intersects[0].point;
        this.isDrawing = true;
      } else {
        const mousePos = intersects[0].point;
        this.radiusX = Math.abs(this.center.x - mousePos.x);
        this.radiusY = Math.abs(this.center.z - mousePos.z);
        this.updateEllipse();
        this.createSphereAtCenter(); // Create the sphere at the center of the ellipse
        this.isDrawing = false;
        this.ellipse = null;
        this.removeEventListeners();
      }
    }
  }

  handleMouseMove(event) {
    if (!this.isDrawing || !this.center) return;
    this.updateMousePosition(event);
    const intersects = this.getIntersection();
    if (intersects.length > 0) {
      const mousePos = intersects[0].point;
      this.radiusX = Math.abs(this.center.x - mousePos.x);
      this.radiusY = Math.abs(this.center.z - mousePos.z);
      this.updateEllipse();
    }
  }

  getIntersection() {
    if (!this.plane) {
      console.error("Plane not defined!");
      return [];
    }
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObject(this.plane);
  }

  updateEllipse() {
    if (this.ellipse) {
      const geometry = new THREE.EllipseCurve(
        0,
        0,
        this.radiusX,
        this.radiusY,
        0,
        Math.PI * 2,
        false,
        0
      );
      const points = geometry.getPoints(64);
      this.ellipse.geometry.setFromPoints(points);
      this.ellipse.geometry.attributes.position.needsUpdate = true;
    } else {
      const geometry = new THREE.EllipseCurve(
        0,
        0,
        this.radiusX,
        this.radiusY,
        0,
        Math.PI * 2,
        false,
        0
      );
      const points = geometry.getPoints(64);
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
      const geometryBuffer = new THREE.BufferGeometry().setFromPoints(points);
      this.ellipse = new THREE.LineLoop(geometryBuffer, material);
      this.ellipse.rotation.x = Math.PI * 0.5;
      this.ellipse.position.set(this.center.x, 0.1, this.center.z); // Apply the offset
      this.scene.add(this.ellipse);
    }
  }

  // Create a sphere at the center of the ellipse
  createSphereAtCenter() {
    const sphereRadius = 0.05; // Define the sphere radius
    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red sphere
    const sphere = new THREE.Mesh(geometry, material);

    // Apply a small offset in the Y-direction to avoid Z-fighting
    sphere.position.set(this.center.x, this.center.y + 0.1, this.center.z);

    this.scene.add(sphere); // Add the sphere to the scene
  }
}

export default Ellipse;
