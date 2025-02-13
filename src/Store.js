import { runInAction } from 'mobx';
// shapeStore.js
import { makeAutoObservable } from "mobx";

class ShapeStore {
  shapes = [];
  camera = null; // Initialize camera as null
  plane = null;
  currentEntity = null;
  center = null;
  centerEllipse = null;
  constructor() {
    makeAutoObservable(this);
    this.selectedShape = null;  // This will hold the currently selected shape
    this.center = { x: 0, y: 0, z: 0 };  // Default center
    this.radius = 0;  // Default radius
    this.radiusX = 0; // For Ellipse (X radius)
    this.radiusY = 0; // For Ellipse (Y radius)
    this.points = []; // Array for line/polyline points
  }

  // Set the currently selected shape
  // setCurrentShape(shape) {
  //   this.selectedShape = shape;
  // }

  // // // Get the currently selected shape
  // getCurrentShape() {
  //   return this.selectedShape;
  // }

  // Get and set methods for center
  getCenter() {
    return this.center;
  }


  setCenter(x, y, z) {
    this.center = { x, y, z };
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  setCenterX(x) {
    this.center.x = x;
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  setCenterY(y) {
    this.center.y = y;
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  setCenterZ(z) {
    this.center.z = z;
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  // Get and set methods for radius
  getRadius() {
    return this.radius;
  }

  setRadius(radius) {
    this.radius = radius;
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  setRadiusX(radiusX) {
    this.radiusX = radiusX;
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  setRadiusY(radiusY) {
    this.radiusY = radiusY;
    if (this.selectedShape?.updateShape) {
      this.selectedShape.updateShape();
    }
  }

  // Update points for Line, Polyline, etc.
  updateShapePoints(shape, points) {
    shape.geometry.attributes.position.array = points;
    shape.geometry.attributes.position.needsUpdate = true; // Notify Three.js that geometry has changed
    if (shape.updateShape) {
      shape.updateShape();
    }
  }

  // Update the currently selected shape's geometry (if necessary)
  updateShape() {
    if (this.selectedShape?.name === "Circle") {
      this.selectedShape.updateCircle();  // Update circle based on radius and center
    } else if (this.selectedShape?.name === "Ellipse") {
      this.selectedShape.updateEllipse();  // Update ellipse based on Rx, Ry, and center
    }
  }

  // Method to set points for Polyline (update an individual point)
  setPoint(index, x, y, z) {
    if (this.selectedShape && this.selectedShape.geometry && this.selectedShape.geometry.attributes) {
      const pointsArray = this.selectedShape.geometry.attributes.position.array;
      const pointIndex = index * 3;
      pointsArray[pointIndex] = x;
      pointsArray[pointIndex + 1] = y;
      pointsArray[pointIndex + 2] = z;
      this.updateShapePoints(this.selectedShape, pointsArray);  // Trigger shape update
    }
  }

  // Method to set the camera reference
  setCamera(camera) {
    this.camera = camera;
  }

  setScene(scene) {
    this.scene = scene;
    console.log(this.scene, "scene");
  }

  setPlane(plane) {
    this.plane = plane;
  }

  // Method to add shapes to the store
  addShape(shape) {
    this.shapes.push(shape);
  }


removeEntity(shape) {
  const removedShape = this.shapes.find((s) => s.uuid === shape.uuid);

  if (removedShape) {
    // Remove from the scene
    if (this.scene) {
      // console.log("Removing shape from scene1...",this.scene);
      this.scene.remove(removedShape); // Actually remove it from the scene
    }

    // Dispose of the shape's resources
    this.disposeShape(removedShape);

    // Update MobX state in a transactional way
    runInAction(() => {
      this.shapes = this.shapes.filter((s) => s.uuid !== shape.uuid);
    });
    console.log(this.scene, "sceneAfter");
  } else {
    console.error("Shape not found in the scene or shapes array.");
  }
}

  disposeShape(shape) {
    if (shape.geometry) {
      shape.geometry.dispose();
      console.log('Geometry disposed:', shape.geometry);
    }
    if (shape.material) {
      shape.material.dispose();
      console.log('Material disposed:', shape.material);
    }
  }
  
  setCenterCircle(center) {
    this.center = center;
  }
  setCenterEllipse(centerEllipse) {
    this.centerEllipse = centerEllipse;
  }
  // setRadius(radius) {
  //   this.radius = radius;
  // }

  // setRadiusX(radiusX) {
  //   this.radiusX = radiusX;
  // }

  // setRadiusY(radiusY) {
  //   this.radiusY = radiusY;
  // }
  getCenterCircle() {
    return this.center;
  }
  getCenterEllipse() {
    return this.centerEllipse;
  }
  // getRadius() { 
  //   return this.radius;
  // }
  getRadiusX() {
    return this.radiusX;
  }

  getRadiusY() {
    return this.radiusY;
  }

  setCurrentEntity(entity) {
    this.currentEntity = entity;
  }

  getCurrentEntity() {
    return this.currentEntity;
  }
  // Method to get the camera reference (if needed)
  getCamera() {
    return this.camera;
  }
  getPlane() {
    return this.plane;
  }
}

const shapeStore = new ShapeStore();
export default shapeStore;
