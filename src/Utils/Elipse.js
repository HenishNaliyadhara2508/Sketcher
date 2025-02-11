import * as THREE from "three";

export class Ellipse {
  constructor(centerPoint, radiusX, radiusY, scene) {
    this.centerPoint = centerPoint;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.scene = scene;

    this.createEllipse();
  }

  createEllipse() {
    const ellipseGeometry = new THREE.EllipseGeometry(this.radiusX, this.radiusY, 32);
    const ellipseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.ellipse = new THREE.Mesh(ellipseGeometry, ellipseMaterial);
    this.ellipse.position.copy(this.centerPoint);
    this.scene.add(this.ellipse);
  }
}
