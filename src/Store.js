import { makeAutoObservable } from "mobx";
import * as THREE from "three";

class ShapeStore {
  shapes = [];
  currentEntity = null;
  entityId = null;
  scene = null;
  // ellipseRadiusY = [];
  // ellipseRadiusX = [];
  ellipsesRadiusXY = [];

  constructor() {
    makeAutoObservable(this);
  }

  setScene(scene) {
    this.scene = scene;
    console.log(this.scene, "scene1");
  }

  addShape(shapeMesh) {
    this.shapes.push(shapeMesh);
  }

  resetShapes() {
    this.shapes = [];
  }
  Entity() {
    return this.currentEntity;
  }
  setEntity(inEntity) {
    this.currentEntity = inEntity;
  }
  setCamera(Camera) {
    this.camera = Camera;
  }
  setPlane(plane) {
    this.plane = plane;
  }
  setEllipseRadius(uuid, radiusX, radiusY) {
    // Check if the ellipse already exists in the array by uuid
    const existingEllipse = this.ellipsesRadiusXY.find(
      (ellipse) => ellipse.uuid === uuid
    );

    if (existingEllipse) {
      // If ellipse exists, update the radii
      existingEllipse.radiusX = radiusX;
      existingEllipse.radiusY = radiusY;
    } else {
      // If ellipse does not exist, add a new entry
      this.ellipsesRadiusXY.push({ uuid, radiusX, radiusY });
    }
  }

  // Get method to retrieve ellipse radii using uuid
  getEllipseRadius(uuid) {
    const ellipse = this.ellipsesRadiusXY.find(
      (ellipse) => ellipse.uuid === uuid
    );
    return ellipse ? [ellipse.radiusX, ellipse.radiusY] : null; // Return radii or null if not found
  }

  // Optional: To remove an ellipse's data by uuid
  removeEllipseData(uuid) {
    this.ellipsesRadiusXY = this.ellipsesRadiusXY.filter(
      (ellipse) => ellipse.uuid !== uuid
    );
  }

  // setEllipseRadiusX(uuid, radiusX) {
  //   this.ellipseRadiusX.push({ uuid: radiusX });
  // }

  // getEllipseRadiusX(uuid) {
  //   // Find the object with the matching uuid
  //   const entry = this.ellipseRadiusX.find((entry) => entry.uuid === uuid);

  //   // Return the radiusX value or null if not found
  //   return entry ? entry.uuid : null;
  // }

  // getEllipseRadiusY(uuid) {
  //   // Find the object with the matching uuid
  //   const entry = this.ellipseRadiusY.find((entry) => entry.uuid === uuid);

  //   // Return the radiusX value or null if not found
  //   return entry ? entry.uuid : null;
  // }
  // setEllipseRadiusY(uuid, radiusY) {
  //   this.ellipseRadiusY.push({ uuid: radiusY });
  // }

  hideEntity(entityId) {
    const hideShape = this.shapes.find((e) => e.uuid == entityId);

    // console.log(entityId, "hi");
    if (hideShape) {
      if (hideShape.visible) {
        hideShape.visible = false;
      } else {
        hideShape.visible = true;
      }
    }
  }

  // Remove a shape from the scene and dispose of its geometry/material
  removeEntity(entityId) {
    const removeShape = this.shapes.find((e) => e.uuid == entityId);
    this.removeEllipseData(entityId);
    if (removeShape) {
      if (this.scene) {
        this.scene.remove(removeShape); // Remove shape from the scene
      }
      this.disposeShape(removeShape); // Dispose of geometry and material
      // Remove shape from the shapes array

      console.log(this.scene, "scene2");
      this.shapes = this.shapes.filter((e) => e.uuid !== entityId);
    }
  }

  updateEntity(entityId, updatedProperties) {
    const updateShape = this.shapes.find((e) => e.uuid === entityId);

    if (!updateShape) return; // If no shape is found, exit early

    const {
      color,
      opacity,
      lineStart,
      lineEnd,
      ellipseCenter,
      Rx,
      Ry,
      circleCenter,
      circleRadius,
      polylinePoints,
    } = updatedProperties;

    // Line update
    if (updateShape.name === "Line") {
      const newGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array([...lineStart, ...lineEnd]); // Create a new array with updated line positions
      newGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = newGeometry; // Assign the new geometry

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true; // Ensure material updates
    }

    // Ellipse update
    if (updateShape.name === "Ellipse") {
      updateShape.position.set(
        ellipseCenter.x,
        ellipseCenter.y,
        ellipseCenter.z
      );
      const curve = new THREE.EllipseCurve(
        0,
        0, // center at 0, 0
        Rx,
        Ry, // rx and ry values from updatedProperties
        0,
        Math.PI * 2, // full circle
        false,
        0 // no rotation
      );

      const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(64)
      );

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = ellipseGeometry; // Set the new geometry

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    // Circle update
    if (updateShape.name === "Circle") {
      updateShape.position.set(circleCenter.x, 0.5, circleCenter.z);
      updateShape.geometry.parameters.radius = circleRadius; // Update radius

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = new THREE.CircleGeometry(circleRadius); // Create a new geometry with updated radius

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    // Polyline update
    if (updateShape.name === "Polyline") {
      const pointsArray = polylinePoints.flatMap((point) => [
        point.x,
        point.y,
        point.z,
      ]);
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(pointsArray, 3)
      );

      updateShape.geometry.dispose(); // Dispose of the old geometry
      updateShape.geometry = newGeometry; // Set the new geometry

      // Update color and opacity
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    // Ensure shape visibility is updated
    // updateShape.visible = updateShape.visible;
  }

  // Helper function to dispose of shape's resources
  disposeShape(shape) {
    if (shape.geometry) {
      shape.geometry.dispose(); // Dispose of geometry
    }

    if (shape.material) {
      if (Array.isArray(shape.material)) {
        shape.material.forEach((material) => material.dispose()); // Dispose of all materials if it's an array
      } else {
        shape.material.dispose(); // Dispose of single material
      }
    }
  }

  setRadius(radius) {
    if (this.selectedShape?.name === "Circle") {
      this.selectedShape.radius = radius;
      this.radius = radius;
      this.updateShape(); // Update the circle
    } else if (this.selectedShape?.name === "Ellipse") {
      this.selectedShape.radiusX = radius;
      this.selectedShape.radiusY = radius;
      this.radiusX = radius;
      this.radiusY = radius;
      this.updateShape(); // Update the ellipse
    }
  }

  setRadiusX(radiusX) {
    if (this.selectedShape?.name === "Ellipse") {
      this.selectedShape.radiusX = radiusX;
      this.radiusX = radiusX;
      this.updateShape();
    }
  }

  setRadiusY(radiusY) {
    if (this.selectedShape?.name === "Ellipse") {
      this.selectedShape.radiusY = radiusY;
      this.radiusY = radiusY;
      this.updateShape();
    }
  }
  setCenterCircle(center) {
    this.center = center;
  }

  setCenterEllipse(centerEllipse) {
    this.centerEllipse = centerEllipse;
  }

  getCenterCircle() {
    return this.center;
  }

  getCenterEllipse() {
    return this.centerEllipse;
  }
  getCamera() {
    return this.camera;
  }

  getPlane() {
    return this.plane;
  }
}

export const shapeStore = new ShapeStore();
