import React, { useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import InputNumber from "./InputNumber"; // Ensure this is a valid component
import Button from "./Button";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";
import shapeStore from "../Store"; // Ensure to import shapeStore
import { observer } from "mobx-react";
import ColorComponent from "./ColorComponent";

const Properties = observer(() => {
  const selectedShape = shapeStore?.getCurrentEntity(); // Get the currently selected shape
  const EllipseRadiusXY = shapeStore?.getEllipseRadius(selectedShape?.uuid)
  // Extracting points for shapes with Float32Array
  const points = selectedShape?.geometry?.attributes?.position?.array;
  const centerCircle = selectedShape?.center;
  const centerEllipse = selectedShape?.center;
  const Radius = selectedShape?.geometry?.parameters?.radius;
  const Rx = EllipseRadiusXY?.[0];
  const Ry = EllipseRadiusXY?.[1];

  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [centerCoordinates, setCenterCoordinates] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [radius, setRadius] = useState(0);
  const [radiusX, setRadiusX] = useState(0);
  const [radiusY, setRadiusY] = useState(0);
  const [shapeColor, setShapeColor] = useState({ r: 0, g: 0, b: 0 });

  
  const getCoordinates = (index) => {
    if (points && points.length >= index * 3 + 3) {
      return {
        x: points[index * 3],
        y: points[index * 3 + 1],
        z: points[index * 3 + 2],
      };
    }
    return { x: 0, y: 0, z: 0 };
  };

  useEffect(() => {
    if (selectedShape) {
      console.log("Selected Shape: ", selectedShape);
      console.log("Current Center: ", centerCircle || centerEllipse);
      console.log("Current Radius: ", Radius || Rx);
    }
    if (selectedShape && points) {
      const initialCoordinates = [];
      for (let i = 0; i < points.length / 3; i++) {
        initialCoordinates.push(getCoordinates(i));
      }
      setTempCoordinates(initialCoordinates);
    }
    if(selectedShape?.material) {
      setShapeColor({
        r: selectedShape.material.color.r * 255,
        g: selectedShape.material.color.g * 255,
        b: selectedShape.material.color.b * 255,
      });
    }
    if (selectedShape?.name === "Circle" || selectedShape?.name === "Ellipse") {
      if (selectedShape?.name === "Circle") {
        setCenterCoordinates({
          x: centerCircle?.x || 0,
          y: centerCircle?.y || 0,
          z: centerCircle?.z || 0,
        });
        setRadius(Radius || 0);
      } else if (selectedShape?.name === "Ellipse") {
        setCenterCoordinates({
          x: centerEllipse?.x || 0,
          y: centerEllipse?.y || 0,
          z: centerEllipse?.z || 0,
        });
        setRadiusX(Rx || 0);
        setRadiusY(Ry || 0);
      }
    }
  }, [selectedShape, points, centerCircle, centerEllipse, Radius, Rx, Ry]);

  const handleCoordinateChange = useCallback(
    (index, axis, newValue) => {
      const floatValue = parseFloat(newValue);

      if (isNaN(floatValue) && newValue !== "") return;

      const updatedCoordinates = [...tempCoordinates];
      updatedCoordinates[index][axis] = isNaN(floatValue) ? 0 : floatValue;

      setTempCoordinates(updatedCoordinates);
    },
    [tempCoordinates]
  );

  const handleChangeCenter = useCallback((axis, value) => {
    const floatValue = parseFloat(value);

    if (value === "") {
      setCenterCoordinates(
        (prev) => {
        const updatedCenter = { ...prev };
        updatedCenter[axis] = 0;
        return updatedCenter;
      });
      shapeStore.setCenter(axis, 0);
    } else if (!isNaN(floatValue)) {
      setCenterCoordinates((prev) => {
        const updatedCenter = { ...prev };
        updatedCenter[axis] = floatValue;
        return updatedCenter;
      });
      shapeStore.setCenter(axis, floatValue);
    }
  }, []);

  const handleChangeCircleRadius = useCallback((value) => {
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
      setRadius(floatValue);
      shapeStore.setRadius(floatValue); // Set the radius in the store
    }
  }, []);
  
  const handleChangeRadius = useCallback((value, isX = false) => {
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
      if (isX) {
        setRadiusX(floatValue);
        shapeStore.setRadiusX(floatValue); // Set the X radius in the store
      } else {
        setRadiusY(floatValue);
        shapeStore.setRadiusY(floatValue); // Set the Y radius in the store
      }
    }
  }, []);
  
  const rgbToHex = (r, g, b) => {
  const toHex = (x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return '#' + toHex(r) + toHex(g) + toHex(b);
};

  const setColor = (rgb) => {
    setShapeColor(rgb);
    if (selectedShape?.material) {
      selectedShape.material.color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255); 
    }
  };
  const toggleVisibility = (shape) => {
    shape.visible = !shape.visible;

    if (shape.mesh) {
      shape.mesh.visible = shape.visible;
    }

    // For Polyline, check if it has a 'line' property and toggle its visibility
    if (shape.line) {
      shape.line.visible = shape.visible;
    }

    // You can also add checks for other specific properties, like spheres or extra components in case the shape is more complex
    if (shape.sphereStart) {
      shape.sphereStart.visible = shape.visible;
    }

    if (shape.sphereEnd) {
      shape.sphereEnd.visible = shape.visible;
    }

    // If you are using any group, you can toggle its visibility as well
    if (shape.group) {
      shape.group.visible = shape.visible;
    }
  };

  const handleUpdate = useCallback(() => {
    console.log("Update clicked");
  
    if (selectedShape && selectedShape.geometry) {
      const geometry = selectedShape.geometry;
      const updatedPoints = tempCoordinates.flatMap((point) => [
        point.x,
        point.y,
        point.z,
      ]);
  
      const pointsChanged =
        updatedPoints.length !== geometry.attributes.position.array.length ||
        updatedPoints.some(
          (value, index) => value !== geometry.attributes.position.array[index]
        );
  
      if (pointsChanged) {
        const newPositionAttribute = new THREE.BufferAttribute(
          new Float32Array(updatedPoints),
          3
        );
  
        geometry.setAttribute("position", newPositionAttribute);
        geometry.attributes.position.needsUpdate = true;
  
        // For Circle or Ellipse, also update the center and radius accordingly
        if (selectedShape.name === "Circle") {
          const center = centerCircle; // Using the center coordinates for the circle
          geometry.parameters.radius = radius; // Update the radius
          geometry.parameters.center = center; // Update the center
          console.log("Circle updated with new center and radius.");
        } else if (selectedShape.name === "Ellipse") {
          const center = centerEllipse; // Using the center coordinates for the ellipse
          geometry.parameters.radiusX = radiusX; // Update the X radius
          geometry.parameters.radiusY = radiusY; // Update the Y radius
          geometry.parameters.center = center; // Update the center
          console.log("Ellipse updated with new center and radii.");
        }
  
        console.log("Geometry updated.");
      } else {
        console.log("No changes detected. Skipping update.");
      }
    } else {
      console.log("Selected shape or geometry not found.");
    }
  }, [tempCoordinates, selectedShape, centerCircle, centerEllipse, radius, radiusX, radiusY]);
  

  return (
    <div className="rounded max-h-screen overflow-y-scroll">
      <div className="font-bold">Properties</div>

      {selectedShape ? (
        <>
          <div className="mb-4">{selectedShape.name}</div>

          <hr className="my-4" />

          {selectedShape.name === "Line" && points && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Starting Point</div>
                <InputNumber
                  label="x"
                  value={tempCoordinates[0]?.x || 0}
                  onChange={(newValue) =>
                    handleCoordinateChange(0, "x", newValue)
                  }
                />
                <InputNumber
                  label="y"
                  value={tempCoordinates[0]?.y || 0}
                  onChange={(newValue) =>
                    handleCoordinateChange(0, "y", newValue)
                  }
                />
                <InputNumber
                  label="z"
                  value={tempCoordinates[0]?.z || 0}
                  onChange={(newValue) =>
                    handleCoordinateChange(0, "z", newValue)
                  }
                />
              </div>

              <div className="flex flex-col gap-4">
                <div>Ending Point</div>
                <InputNumber
                  label="x"
                  value={tempCoordinates[1]?.x || 0}
                  onChange={(newValue) =>
                    handleCoordinateChange(1, "x", newValue)
                  }
                />
                <InputNumber
                  label="y"
                  value={tempCoordinates[1]?.y || 0}
                  onChange={(newValue) =>
                    handleCoordinateChange(1, "y", newValue)
                  }
                />
                <InputNumber
                  label="z"
                  value={tempCoordinates[1]?.z || 0}
                  onChange={(newValue) =>
                    handleCoordinateChange(1, "z", newValue)
                  }
                />
              </div>
            </div>
          )}

          {selectedShape.name === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber
                  label="x"
                  value={centerCoordinates.x || 0}
                  onChange={(newValue) => handleChangeCenter("x", newValue)}
                  allowClear={false}
                />
                <InputNumber
                  label="y"
                  value={centerCoordinates.y || 0}
                  onChange={(newValue) => handleChangeCenter("y", newValue)}
                  allowClear={false}
                />
                <InputNumber
                  label="z"
                  value={centerCoordinates.z || 0}
                  onChange={(newValue) => handleChangeCenter("z", newValue)}
                  allowClear={false}
                />
              </div>
              <div>
                <div>Radius</div>
                <InputNumber
                  label="R"
                  value={radius || 0}
                  onChange={handleChangeCircleRadius}
                  allowClear={false}
                />
              </div>
            </div>
          )}

          {selectedShape?.name === "Ellipse" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber
                  label="x"
                  value={centerCoordinates.x || 0}
                  onChange={(newValue) => handleChangeCenter("x", newValue)}
                  allowClear={false}
                />
                <InputNumber
                  label="y"
                  value={centerCoordinates.y || 0}
                  onChange={(newValue) => handleChangeCenter("y", newValue)}
                  allowClear={false}
                />
                <InputNumber
                  label="z"
                  value={centerCoordinates.z || 0}
                  onChange={(newValue) => handleChangeCenter("z", newValue)}
                  allowClear={false}
                />
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div>Radius</div>
                <InputNumber
                  label="Rx"
                  value={radiusX || 0}
                  onChange={(newValue) => handleChangeRadius(newValue, true)}
                  allowClear={false}
                />
                <InputNumber
                  label="Ry"
                  value={radiusY || 0}
                  onChange={(newValue) => handleChangeRadius(newValue, false)}
                  allowClear={false}
                />
              </div>
            </div>
          )}

          {selectedShape.name === "Polyline" && points && (
            <div>
              {tempCoordinates
                .slice(0, tempCoordinates.length - 2)
                .map((point, index) => (
                  <div key={index} className="flex flex-col gap-4 mb-3">
                    <div>Point {index + 1}</div>

                    <InputNumber
                      label="x"
                      value={point.x}
                      onChange={(newValue) =>
                        handleCoordinateChange(index, "x", newValue)
                      }
                    />
                    <InputNumber
                      label="y"
                      value={point.y}
                      onChange={(newValue) =>
                        handleCoordinateChange(index, "y", newValue)
                      }
                    />
                    <InputNumber
                      label="z"
                      value={point.z}
                      onChange={(newValue) =>
                        handleCoordinateChange(index, "z", newValue)
                      }
                    />
                  </div>
                ))}
            </div>
          )}

          <Button icon={<RxUpdate />} name="Update" onClick={handleUpdate} />
          
          <ColorComponent value={rgbToHex(shapeColor.r, shapeColor.g, shapeColor.b)} setColor={setColor} />

          
          <Button icon={<GrFormViewHide />} name="Hide" onClick={() => toggleVisibility(selectedShape)}/>
          <Button icon={<RiDeleteBinLine />} name="Delete" onClick={() => shapeStore.removeEntity(selectedShape)} />
        </>
      ) : (
        <div>Select a shape to see its properties.</div>
      )}
    </div>
  );
});

export default Properties;
