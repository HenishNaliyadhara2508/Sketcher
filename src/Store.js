import { runInAction } from 'mobx';
import { makeAutoObservable } from "mobx";
import Circle from './Utils/Circle';
import Ellipse from './Utils/Ellipse';


class ShapeStore {
  shapes = [];
  camera = null;
  plane = null;
  currentEntity = null;
  center = null;
  centerEllipse = null;
  ellipsesRadiusXY = [];
  constructor() {
    makeAutoObservable(this);
    this.selectedShape = null;
    this.center = { x: 0, y: 0, z: 0 };
    this.radius = 0;
    this.radiusX = 0;
    this.radiusY = 0;
    this.points = [];
  }

  setCenter(center) {
    // Check if there's a selected shape
    if (this.selectedShape) {
      // Update the center of the shape
      this.selectedShape.center = center;
      this.center = center;
  
      // Update the shape
      this.updateShape();
    } else {
      console.error("No shape selected. Cannot update center.");
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

  updateShape() {
    console.log("Updating shape: ", this.selectedShape);
  
    if (this.selectedShape) {
      if (this.selectedShape.updateEllipse) {
        console.log("Updating Ellipse");
        this.selectedShape.updateEllipse();
      } else if (this.selectedShape.updateCircle) {
        console.log("Updating Circle");
        this.selectedShape.updateCircle();
      } else {
        console.error("Selected shape does not have update method: ", this.selectedShape);
      }
    } else {
      console.error("No shape selected.");
    }
  }
  

  setCurrentEntity(entity) {
    this.currentEntity = entity;
    this.selectedShape = entity;
    console.log(this.selectedShape, "selected shape");
    
  }

  getCurrentEntity() {
    return this.currentEntity;
  }

  createEllipse(center, radiusX, radiusY) {
    const newEllipse = {
      center,
      radiusX,
      radiusY,
      uuid: this.generateUUID(),
    };
    this.shapes.push(newEllipse);
  }

  updateEllipseRadius(uuid, radiusX, radiusY) {
    const ellipse = this.shapes.find(shape => shape.uuid === uuid);
    if (ellipse) {
      ellipse.radiusX = radiusX;
      ellipse.radiusY = radiusY;
    }
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

  getAllEntities() {
    return this.shapes.map(shape => shape.mesh);
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

  generateUUID() {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getEllipseData(uuid) {
    const ellipse = this.shapes.find(shape => shape.uuid === uuid);
    return ellipse ? { center: ellipse.center, radiusX: ellipse.radiusX, radiusY: ellipse.radiusY } : null;
  }

  setEllipseCenter(uuid, center) {
    const ellipse = this.shapes.find(shape => shape.uuid === uuid);
    if (ellipse) {
      ellipse.center = center;
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

  getRadius() {
    return this.radius;
  }

  getRadiusX() {
    return this.radiusX;
  }

  getRadiusY() {
    return this.radiusY;
  }

  getCenter() {
    return this.center;
  }

  setPoint(index, x, y, z) {
    if (this.selectedShape && this.selectedShape.geometry && this.selectedShape.geometry.attributes) {
      const pointsArray = this.selectedShape.geometry.attributes.position.array;
      const pointIndex = index * 3;
      pointsArray[pointIndex] = x;
      pointsArray[pointIndex + 1] = y;
      pointsArray[pointIndex + 2] = z;
      this.updateShapePoints(this.selectedShape, pointsArray);
    }
  }

  updateShapePoints(shape, points) {
    if (shape.geometry && shape.geometry.attributes.position) {
      shape.geometry.attributes.position.array = points;
      shape.geometry.attributes.position.needsUpdate = true;

      // Update the shape if necessary
      if (shape.updateShape) {
        shape.updateShape();
      }
    }
  }

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

  addShape(shape) {
    this.shapes.push(shape);
  }

  removeEntity(shape) {
    const removedShape = this.shapes.find((s) => s.uuid === shape.uuid);
    this.removeEllipseData(shape);

    if (removedShape) {
      if (this.scene) {
        this.scene.remove(removedShape);
      }
      this.disposeShape(removedShape);
      runInAction(() => {
        this.shapes = this.shapes.filter((s) => s.uuid !== shape.uuid);
      });
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

const shapeStore = new ShapeStore();
export default shapeStore;
