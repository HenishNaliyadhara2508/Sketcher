import React, { useState, useEffect } from "react";
import InputNumber from "./InputNumber"; // Ensure this is a valid component
import Button from "./Button";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";
import shapeStore from "../Store"; // Ensure to import shapeStore
import { observer } from "mobx-react";

const Properties = observer(() => {
  const selectedShape = shapeStore?.getCurrentEntity(); // Get the currently selected shape

  // Extracting points for shapes with Float32Array
  const points = selectedShape?.geometry?.attributes?.position?.array;
  const centerpoint = selectedShape?.center;
  const Radius = selectedShape?.geometry?.parameters?.radius;
  const Rx = shapeStore?.getRadiusX();
  const Ry = shapeStore?.getRadiusY();

  // Initialize temporary coordinates state dynamically based on points length
  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [centerCoordinates, setCenterCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [radius, setRadius] = useState(0);
  const [radiusX, setRadiusX] = useState(0);
  const [radiusY, setRadiusY] = useState(0);

  // Function to get the coordinates from the points array
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

  // Set initial coordinates in state when selectedShape or points change
  useEffect(() => {
    if (selectedShape && points) {
      const initialCoordinates = [];
      for (let i = 0; i < points.length / 3; i++) {
        initialCoordinates.push(getCoordinates(i));
      }
      setTempCoordinates(initialCoordinates);
    }

    if (selectedShape?.name === "Circle" || selectedShape?.name === "Ellipse") {
      setCenterCoordinates({
        x: centerpoint?.x || 0,
        y: centerpoint?.y || 0,
        z: centerpoint?.z || 0,
      });
      if (selectedShape?.name === "Circle") {
        setRadius(Radius || 0);
      } else if (selectedShape?.name === "Ellipse") {
        setRadiusX(Rx || 0);
        setRadiusY(Ry || 0);
      }
    }
  }, [selectedShape, points, centerpoint, Radius, Rx, Ry]);

  // Handlers to update shape properties when input values change
  const handleCoordinateChange = (index, axis, newValue) => {
    const floatValue = parseFloat(newValue); // Convert the input to a number

    // Ensure the value is a valid number
    if (isNaN(floatValue)) return; // Do not update if it's not a valid number

    const updatedCoordinates = [...tempCoordinates];

    // Update the respective point's coordinate based on the axis (x, y, z)
    updatedCoordinates[index][axis] = floatValue;

    setTempCoordinates(updatedCoordinates); // Set updated coordinates in the temporary state
  };

  const handleChangeCenter = (axis, value) => {
    console.log(axis, value);
    const floatValue = parseFloat(value);  // Convert input to a number
    
    if (isNaN(floatValue)) return;  // If the value is invalid (NaN), return
  
    // Update the center values for Circle or Ellipse in shapeStore
    if (selectedShape?.name === "Circle" || selectedShape?.name === "Ellipse") {
      setCenterCoordinates(prev => {
        const updatedCenter = { ...prev };
        updatedCenter[axis] = floatValue;
        return updatedCenter;
      });
  
      // Optionally, trigger update on shape to reflect the change
      selectedShape?.updateShape();
    }
  };
  
  const handleChangeRadius = (value, isX = false) => {
    const floatValue = parseFloat(value);  // Convert input to a number
    
    if (isNaN(floatValue)) return;  // If the value is invalid (NaN), return
    
    // Update radius for Circle or Ellipse in shapeStore
    if (selectedShape?.name === "Circle") {
      setRadius(floatValue);
      shapeStore.setRadius(floatValue);  // Update Radius for Circle
      selectedShape?.updateShape();  // Optionally trigger update for shape
    } else if (selectedShape?.name === "Ellipse") {
      if (isX) {
        setRadiusX(floatValue);
        shapeStore.setRadiusX(floatValue);  // Update Rx for Ellipse
      } else {
        setRadiusY(floatValue);
        shapeStore.setRadiusY(floatValue);  // Update Ry for Ellipse
      }
      selectedShape?.updateShape();  // Optionally trigger update for shape
    }
  };
  

  const handleUpdate = () => {
    // Flatten the updated coordinates into a single array for polyline
    const updatedPoints = tempCoordinates.flatMap((point) => [
      point.x, point.y, point.z,
    ]);

    // Update the points in shape's geometry
    shapeStore.updateShapePoints(selectedShape, updatedPoints);
  };

  return (
    <div className="rounded max-h-screen overflow-y-scroll">
      <div className="font-bold">Properties</div>
      {selectedShape ? (
        <>
          <div className="mb-4">{selectedShape.name}</div>{" "}
          {/* Show shape's name */}
          <hr className="my-4" />
          {/* Properties based on selected shape */}
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
          {selectedShape?.name === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber
                  label="x"
                  value={centerCoordinates.x || 0}
                  onChange={(e) => handleChangeCenter("x", e.target.value)}
                  allowClear={false}
                />
                <InputNumber
                  label="y"
                  value={centerCoordinates.y || 0}
                  onChange={(e) => handleChangeCenter("y", e.target.value)}
                  allowClear={false}
                />
                <InputNumber
                  label="z"
                  value={centerCoordinates.z || 0}
                  onChange={(e) => handleChangeCenter("z", e.target.value)}
                  allowClear={false}
                />
              </div>
              <div>
                <div>Radius</div>
                <InputNumber
                  label="R"
                  value={radius || 0}
                  onChange={(e) => handleChangeRadius(e.target.value)}
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
                  onChange={(e) => handleChangeCenter("x", e.target.value)}
                  allowClear={false}
                />
                <InputNumber
                  label="y"
                  value={centerCoordinates.y || 0}
                  onChange={(e) => handleChangeCenter("y", e.target.value)}
                  allowClear={false}
                />
                <InputNumber
                  label="z"
                  value={centerCoordinates.z || 0}
                  onChange={(e) => handleChangeCenter("z", e.target.value)}
                  allowClear={false}
                />
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div>Radius</div>
                <InputNumber
                  label="Rx"
                  value={radiusX || 0}
                  onChange={(e) => handleChangeRadius(e.target.value, true)}
                  allowClear={false}
                />
                <InputNumber
                  label="Ry"
                  value={radiusY || 0}
                  onChange={(e) => handleChangeRadius(e.target.value, false)}
                  allowClear={false}
                />
              </div>
            </div>
          )}

          {selectedShape.name === "Polyline" && points && (
            <div>
              {tempCoordinates.map((point, index) => (
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
          <div>Color</div>
          <div>
            <input type="color" />
          </div>
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
