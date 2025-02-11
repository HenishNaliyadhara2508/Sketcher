import * as THREE from 'three';

export class Circle {
  constructor(centerPoint, radius, scene) {
    this.centerPoint = centerPoint;
    this.radius = radius;
    this.scene = scene;
    this.circle = null;
    this.createCircle();
  }

  // Create the circle geometry and mesh
  createCircle() {
    const circleGeometry = new THREE.CircleGeometry(this.radius, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    this.circle = new THREE.Mesh(circleGeometry, circleMaterial);
    this.circle.position.copy(this.centerPoint);
    this.circle.rotation.x = -Math.PI / 2; // Rotate to match the plane's rotation
    this.scene.add(this.circle);
  }

  // Update the circle with a new radius (without removing the old one)
  updateRadius(newRadius) {
    this.radius = newRadius;
    this.createCircle(); // Recreate the circle with the new radius
  }
}