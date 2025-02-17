import { makeAutoObservable } from "mobx";
import * as THREE from "three";

class ShapeStore {
  shapes = [];
  currentEntity = null;
  entityId = null;
  scene = null;
  ellipsesRadiusXY = [];
  selectedShape = null;
  constructor() {
    makeAutoObservable(this);
  }

  setScene(scene) {
    this.scene = scene;
    console.log(this.scene, "scene1");
  }

  addShape(shapeMesh) {
    // Check if the shape already exists in the shapes array
    const existingShape = this.shapes.find((e) => e.uuid === shapeMesh.uuid);
    if (!existingShape) {
      this.shapes.push(shapeMesh);
    } else {
      console.log("Shape already exists:", shapeMesh);
    }
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
    const existingEllipse = this.ellipsesRadiusXY.find(
      (ellipse) => ellipse.uuid === uuid
    );

    if (existingEllipse) {
      existingEllipse.radiusX = radiusX;
      existingEllipse.radiusY = radiusY;
    } else {
      this.ellipsesRadiusXY.push({ uuid, radiusX, radiusY });
    }
  }

  getEllipseRadius(uuid) {
    const ellipse = this.ellipsesRadiusXY.find(
      (ellipse) => ellipse.uuid === uuid
    );
    return ellipse ? [ellipse.radiusX, ellipse.radiusY] : null;
  }

  removeEllipseData(uuid) {
    this.ellipsesRadiusXY = this.ellipsesRadiusXY.filter(
      (ellipse) => ellipse.uuid !== uuid
    );
  }

  hideEntity(entityId) {
    const hideShape = this.shapes.find((e) => e.uuid == entityId);
    if (hideShape) {
      hideShape.visible = !hideShape.visible;
    }
  }

  removeEntity(entityId) {
    const removeShape = this.shapes.find((e) => e.uuid == entityId);
    // this.removeEllipseData(entityId);
    if (removeShape) {
      if (this.scene) {
        this.scene.remove(removeShape);
      }
      this.disposeShape(removeShape);
      this.shapes = this.shapes.filter((e) => e.uuid !== entityId);
    }
  }

  updateEntity(entityId, updatedProperties) {
    const updateShape = this.shapes.find((e) => e.uuid === entityId);
    if (!updateShape) return;
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

    if (updateShape.name === "Line") {
      const newGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array([...lineStart, ...lineEnd]);
      newGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      updateShape.geometry.dispose();
      updateShape.geometry = newGeometry;
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    if (updateShape.name === "Ellipse") {
      updateShape.position.set(
        ellipseCenter.x,
        ellipseCenter.y,
        ellipseCenter.z
      );
      const curve = new THREE.EllipseCurve(
        0,
        0,
        Rx,
        Ry,
        0,
        Math.PI * 2,
        false,
        0
      );
      const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(64)
      );
      updateShape.geometry.dispose();
      updateShape.geometry = ellipseGeometry;
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

    if (updateShape.name === "Circle") {
      updateShape.position.set(circleCenter.x, 0.5, circleCenter.z);
      updateShape.geometry.parameters.radius = circleRadius;
      updateShape.geometry.dispose();
      updateShape.geometry = new THREE.CircleGeometry(circleRadius);
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }

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
      updateShape.geometry.dispose();
      updateShape.geometry = newGeometry;
      updateShape.material.color.setRGB(
        color.r / 255,
        color.g / 255,
        color.b / 255
      );
      updateShape.material.opacity = opacity / 100;
      updateShape.material.needsUpdate = true;
    }
  }

  disposeShape(shape) {
    if (shape.geometry) {
      shape.geometry.dispose();
    }

    if (shape.material) {
      if (Array.isArray(shape.material)) {
        shape.material.forEach((material) => material.dispose());
      } else {
        shape.material.dispose();
      }
    }
  }

  setRadius(radius) {
    if (this.selectedShape?.name === "Circle") {
      this.selectedShape.radius = radius;
      this.radius = radius;
      this.updateShape();
    } else if (this.selectedShape?.name === "Ellipse") {
      this.selectedShape.radiusX = radius;
      this.selectedShape.radiusY = radius;
      this.radiusX = radius;
      this.radiusY = radius;
      this.updateShape();
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

  setSelectedShape(shape){
    this.selectedShape = shape
  }
  // Export all shapes as JSON
  exportShapesToJSON() {
    if (!Array.isArray(this.shapes) || this.shapes.length === 0) {
      console.error("No shapes to export.");
      return;
    }

    const shapesData = this.shapes.map((shape) => {
      const shapeData = extractShapeData(shape, this); // Extract basic properties
      addShapeGeometry(shapeData, shape, this); // Add specific geometry details
      return shapeData;
    });

    const jsonString = JSON.stringify(shapesData, null, 2);
    console.log(jsonString); // Log the JSON data for debugging

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes.json"; // Define the download file name
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL
  }
  resetShapes() {
    this.shapes.forEach((shape) => {
      this.scene.remove(shape); // Remove shape from the scene
      shape.geometry.dispose();
      shape.material.dispose();
    });
  }

  uploadAllEntity(shapesData) {
    if (!this.scene) {
      console.error("Scene is not defined.");
      return; // Exit early if the scene is not available
    }

    // First, remove all shapes from the scene except for camera, renderer, and plane
    if (this.scene) {
      this.scene.traverse((object) => {
        // Check if the object or any of its children is named "Plane"
        let isPlanePresent = false;

        // Check the current object
        if (object.name === "Plane") {
          isPlanePresent = true;
        }

        // Check all children of the object
        if (object.children && object.children.length > 0) {
          object.children.forEach((child) => {
            if (child.name === "Plane") {
              isPlanePresent = true;
            }
          });
        }

        // Only remove objects that are not "Camera", "Renderer", or "Plane" (or their children)
        if (
          object.name !== "Camera" &&
          object.name !== "Renderer" &&
          !isPlanePresent
        ) {
          this.scene.remove(object);
          this.disposeShape(object); // Dispose of the shape resources
        }
      });
    }

    // Clear out the shapes array
    this.shapes = [];
    this.ellipsesRadiusXY = [];

    // Now, add the shapes back to the scene from the JSON data
    shapesData.forEach((shapeData) => {
      const { name, color, opacity, ...specificProperties } = shapeData;
      let newShape;

      // Create the shape based on the name
      if (name === "Line") {
        if (
          !Array.isArray(specificProperties.lineStart) ||
          !Array.isArray(specificProperties.lineEnd)
        ) {
          console.error("invalid lineStart and lineend:", shapeData);
          return;
        }
        const lineGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
          ...specificProperties.lineStart,
          ...specificProperties.lineEnd,
        ]);
        lineGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        const lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Line(lineGeometry, lineMaterial);
        newShape.name = "Line";
      } else if (name === "Circle") {
        const circleGeometry = new THREE.CircleGeometry(
          specificProperties.circleRadius
        );
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Mesh(circleGeometry, circleMaterial);

        newShape.center = { ...specificProperties.circleCenter };
        newShape.position.set(newShape.center.x, 0.5, newShape.center.z);
        // newShape.position.set(...specificProperties.circleCenter);
        newShape.rotation.x = -Math.PI * 0.5;
        newShape.name = "Circle";
      } else if (name === "Ellipse") {
        const ellipseGeometry = new THREE.EllipseCurve(
          0,
          0, // center
          specificProperties.Rx,
          specificProperties.Ry, // radii
          0,
          Math.PI * 2 // full circle
        ).getPoints(64);

        const ellipseBufferGeometry = new THREE.BufferGeometry().setFromPoints(
          ellipseGeometry
        );
        const ellipseMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Line(ellipseBufferGeometry, ellipseMaterial);
        console.log(...specificProperties.ellipseCenter, "ellipse-center");
        newShape.position.set(...specificProperties.ellipseCenter);
        newShape.rotation.x = Math.PI * 0.5;

        newShape.name = "Ellipse";
        this.setEllipseRadius(
          newShape.uuid,
          specificProperties.Rx,
          specificProperties.Ry
        );
      } else if (name === "Polyline") {
        const polylineGeometry = new THREE.BufferGeometry();
        const points = new Float32Array(specificProperties.polylinePoints);
        polylineGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(points, 3)
        );
        const polylineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          opacity,
        });
        newShape = new THREE.Line(polylineGeometry, polylineMaterial);
        newShape.name = "Polyline";
      }

      // Add the new shape to the scene and the shapes array
      if (newShape) {
        this.scene.add(newShape);
        this.shapes.push(newShape);
      }
    });
  }


  

  // uploadShapes(shapesData) {
  //   this.resetShapes(); // Clear existing shapes
  //   this.shapes = [];
  //   this.ellipsesRadiusXY = [];
    
  //   shapesData.forEach((shapeData) => {
  //     // Check if the shape already exists by UUID
  //     let existingShape = this.getShapeByUUID(shapeData.uuid);
  //     if (existingShape) {
  //       console.log(`Shape with UUID ${shapeData.uuid} already exists, skipping creation.`);
  //       return; // Skip this shape if it already exists
  //     }
  
  //     // Create the material first
  //     const material = new THREE.MeshBasicMaterial({
  //       color: new THREE.Color(shapeData.material ? shapeData.material.color : 0x000000),
  //       opacity: shapeData.material ? shapeData.material.opacity / 100 : 1,
  //       transparent: shapeData.material && shapeData.material.opacity < 1,
  //     });
  
  //     let geometry;
  
  //     if (shapeData.name === "Line") {
  //       const positions = new Float32Array([
  //         shapeData.start[0],
  //         shapeData.start[1],
  //         shapeData.start[2],
  //         shapeData.end[0],
  //         shapeData.end[1],
  //         shapeData.end[2],
  //       ]);
  //       geometry = new THREE.BufferGeometry();
  //       geometry.setAttribute(
  //         "position",
  //         new THREE.BufferAttribute(positions, 3)
  //       );
  //     } else if (shapeData.name === "Polyline") {
  //       const pointsArray = [];
  //       if (shapeData.points) {
  //         Object.values(shapeData.points).forEach((point) => {
  //           pointsArray.push(point);
  //         });
  //       }
  //       geometry = new THREE.BufferGeometry();
  //       geometry.setAttribute(
  //         "position",
  //         new THREE.Float32BufferAttribute(pointsArray, 3)
  //       );
  //     } else if (shapeData.name === "Circle") {
  //       if (shapeData.radius) {
  //         geometry = new THREE.CircleGeometry(shapeData.radius, 32);
  //       } else {
  //         console.error("Circle shape missing radius");
  //         return; // Skip this shape if radius is missing
  //       }
  //     } else if (shapeData.name === "Ellipse") {
  //       // Create Ellipse Geometry
  //       if (shapeData.radiusX && shapeData.radiusY) {
  //         const curve = new THREE.EllipseCurve(
  //           0, 0, // Center of the ellipse (x, y)
  //           shapeData.radiusX, // Major radius
  //           shapeData.radiusY, // Minor radius
  //           0, Math.PI * 2, // Start and End angle (full ellipse)
  //           false, 0 // Clockwise, rotation
  //         );
  //         this.setEllipseRadius(shapeData.uuid, shapeData.radiusX, shapeData.radiusY);
  //         const points = curve.getPoints(64); // Get 64 points to represent the ellipse
  //         geometry = new THREE.BufferGeometry().setFromPoints(points);
  //       } else {
  //         console.error("Ellipse shape missing radiusX or radiusY");
  //         return; // Skip this shape if it doesn't have the necessary properties
  //       }
  //     } else {
  //       return; // Unknown shape type, skip
  //     }
  
  //     // Create the mesh
  //     const mesh = new THREE.Mesh(geometry, material);
  //     mesh.position.set(shapeData.position.x, 0.2, shapeData.position.z); // Ensure proper position
  //     mesh.uuid = shapeData.uuid; // Ensure unique UUID
  //     mesh.name = shapeData.name;
  //     mesh.center = shapeData.center;
  //     mesh.rotation.x = -Math.PI * 0.5 // Save center if applicable
  //     console.log(mesh)
  //     // Add the mesh to the scene and store the shape
  //     this.scene.add(mesh);
  //     this.addShape(mesh);
  //     // this.shapes.push(mesh); // Add to shapes array
  //   });
  // }
  
  uploadShapes(shapesData) {
    this.resetShapes(); // Clear existing shapes
    this.shapes = [];
    this.ellipsesRadiusXY = [];
    
    shapesData.forEach((shapeData) => {
      // Check if the shape already exists by UUID
      let existingShape = this.getShapeByUUID(shapeData.uuid);
      if (existingShape) {
        console.log(`Shape with UUID ${shapeData.uuid} already exists, skipping creation.`);
        return; // Skip this shape if it already exists
      }
  
      // Create the material first
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(shapeData.material ? shapeData.material.color : 0x000000),
        opacity: shapeData.material ? shapeData.material.opacity / 100 : 1,
        transparent: shapeData.material && shapeData.material.opacity < 1,
      });

      let geometry;
      let mesh;

      // Handle shape-specific creation
      if (shapeData.name === "Line") {
        const positions = new Float32Array([
          shapeData.start[0],
          shapeData.start[1],
          shapeData.start[2],
          shapeData.end[0],
          shapeData.end[1],
          shapeData.end[2],
        ]);
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        
        // Create the mesh for Line
        mesh = new THREE.Line(geometry, material);
        mesh.position.y = 0.2
        
      } else if (shapeData.name === "Polyline") {
        const pointsArray = [];
        if (shapeData.points) {
          Object.values(shapeData.points).forEach((point) => {
            pointsArray.push(point);
          });
        }
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(pointsArray, 3));

        // Create the mesh for Polyline
        mesh = new THREE.Line(geometry, material);
        mesh.position.y = 0.2

      } else if (shapeData.name === "Circle") {
        if (shapeData.radius) {
          geometry = new THREE.CircleGeometry(shapeData.radius, 32);
        } else {
          console.error("Circle shape missing radius");
          return; // Skip this shape if radius is missing
        }
        
        // Create the mesh for Circle
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(shapeData.position.x, 0.5, shapeData.position.z); // Set position
        mesh.rotation.x = - Math.PI * 0.5
      } else if (shapeData.name === "Ellipse") {
        if (shapeData.radiusX && shapeData.radiusY) {
          const curve = new THREE.EllipseCurve(
            0, 0,
            shapeData.radiusX, // Major radius
            shapeData.radiusY, // Minor radius
            0, Math.PI * 2, // Start and End angle (full ellipse)
            false, 0 // Clockwise, rotation
          );
          this.setEllipseRadius(shapeData.uuid, shapeData.radiusX, shapeData.radiusY);
          const points = curve.getPoints(64); // Get 64 points to represent the ellipse
          geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Create the mesh for Ellipse
          mesh = new THREE.Line(geometry, material);
          mesh.position.set(shapeData.position.x, 0.5, shapeData.position.z); // Set position
          mesh.rotation.x = - Math.PI * 0.5
        } else {
          console.error("Ellipse shape missing radiusX or radiusY");
          return; // Skip this shape if it doesn't have the necessary properties
        }

      } else {
        console.error(`Unknown shape type: ${shapeData.name}`);
        return; // Skip unknown shape types
      }

      // Ensure that each shape has its own mesh with the correct properties
      mesh.uuid = shapeData.uuid; // Ensure unique UUID
      mesh.name = shapeData.name; // Set shape name
      mesh.center = shapeData.center; // Save center if applicable

      // Add the mesh to the scene and store the shape
      this.scene.add(mesh);
      this.addShape(mesh);
    });
  }


  getShapeByUUID(uuid) {
    return this.shapes.find((shape) => shape.uuid === uuid);
  }
}

export const shapeStore = new ShapeStore();

function extractShapeData(shape, shapeStore) {
  const { uuid, name, material, position, rotation } = shape;
  const shapeData = {
    uuid,
    name,
    material: material
      ? { color: material.color, opacity: material.opacity }
      : null, // Extract color and opacity
    position: {
      x: position.x,
      y: position.y,
      z: position.z,
    },
    rotation: {
      x: rotation.x,
      y: rotation.y,
      z: rotation.z,
    },
  };

  // Add specific shape data based on the shape type (Line, Ellipse, Circle, Polyline)
  if (shape.name === "Ellipse") {
    const [radiusX, radiusY] = shapeStore.getEllipseRadius(shape.uuid); // Get radiusX and radiusY from the store
    shapeData.radiusX = radiusX; // Extract radiusX of Ellipse
    shapeData.radiusY = radiusY; // Extract radiusY of Ellipse
  }

  return shapeData;
}

// Function to add specific geometry details (e.g., radius, points)
function addShapeGeometry(shapeData, shape, shapeStore) {
  if (shape.name === "Line") {
    shapeData.start = shape.geometry.attributes.position.array.slice(0, 3);
    shapeData.end = shape.geometry.attributes.position.array.slice(3, 6);
  } else if (shape.name === "Ellipse") {
    shapeData.center = shape.center; // Get the center of the ellipse
    const [radiusX, radiusY] = shapeStore.getEllipseRadius(shape.uuid); // Get radiusX and radiusY from the store
    shapeData.radiusX = radiusX; // Get the radiusX of the ellipse
    shapeData.radiusY = radiusY; // Get the radiusY of the ellipse
    shapeData.opacity = shape.material ? shape.material.opacity : 1; // Include opacity in Ellipse
  } else if (shape.name === "Circle") {
    shapeData.center = shape.center;
    shapeData.radius = shape.geometry.parameters.radius;
    shapeData.opacity = shape.material ? shape.material.opacity : 1; // Include opacity in Circle
  } else if (shape.name === "Polyline") {
    shapeData.points = shape.geometry.attributes.position.array;
    shapeData.opacity = shape.material ? shape.material.opacity : 1; // Include opacity in Polyline
  }
}
