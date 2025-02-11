import * as THREE from "three";

export class Polyline {
  constructor(points, scene) {
    this.points = points;
    this.scene = scene;

    this.createPolyline();
  }

  createPolyline() {
    const polylineGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
    const polylineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    this.polyline = new THREE.Line(polylineGeometry, polylineMaterial);
    this.scene.add(this.polyline);
  }

  addPoint(point) {
    this.points.push(point);
    const polylineGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.polyline.geometry.dispose();
    this.polyline.geometry = polylineGeometry;
  }
}
