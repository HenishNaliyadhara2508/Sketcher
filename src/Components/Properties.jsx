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
    if (selectedShape && points) {
      const initialCoordinates = [];
      for (let i = 0; i < points.length / 3; i++) {
        initialCoordinates.push(getCoordinates(i));
      }
      setTempCoordinates(initialCoordinates);
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
      setCenterCoordinates((prev) => {
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

    if (value === "") {
      setRadius(0);
      shapeStore.setRadius(0);
    } else if (!isNaN(floatValue)) {
      setRadius(floatValue);
      shapeStore.setRadius(floatValue);
    }
  }, []);

  const handleChangeRadius = useCallback((value, isX = false) => {
    const floatValue = parseFloat(value);

    if (value === "") {
      if (isX) {
        setRadiusX(0);
        shapeStore.setRadiusX(0);
      } else {
        setRadiusY(0);
        shapeStore.setRadiusY(0);
      }
    } else if (!isNaN(floatValue)) {
      if (isX) {
        setRadiusX(floatValue);
        shapeStore.setRadiusX(floatValue);
      } else {
        setRadiusY(floatValue);
        shapeStore.setRadiusY(floatValue);
      }
    }
  }, []);

 
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
        console.log("Geometry updated.");
      } else {
        console.log("No changes detected. Skipping update.");
      }
    } else {
      console.log("Selected shape or geometry not found.");
    }
  }, [tempCoordinates, selectedShape]);

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
          
          <ColorComponent />
          
          <Button icon={<GrFormViewHide />} name="Hide" />
          <Button icon={<RiDeleteBinLine />} name="Delete" />
        </>
      ) : (
        <div>Select a shape to see its properties.</div>
      )}
    </div>
  );
});

export default Properties;
