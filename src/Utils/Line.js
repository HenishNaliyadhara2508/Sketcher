import * as THREE from "three";

export class Line {
  constructor(startPoint, scene) {
    this.startPoint = startPoint;
    this.endPoint = startPoint; // Initialize with startPoint to draw a line
    this.scene = scene;

    this.createLine();
  }

  createLine() {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([this.startPoint, this.endPoint]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });  // Red line for better visibility
    this.line = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(this.line);
  }

  updateLine(newEndPoint) {
    this.endPoint = newEndPoint;
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([this.startPoint, this.endPoint]);
    this.line.geometry.dispose();  // Clean up old geometry
    this.line.geometry = lineGeometry;  // Update with new geometry
  }
}
