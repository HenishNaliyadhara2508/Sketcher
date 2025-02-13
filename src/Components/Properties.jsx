import React from "react";
import InputNumber from "./InputNumber"; // Ensure this is a valid component
import Button from "./Button";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";
import shapeStore from "../Store";  // Ensure to import shapeStore
import { observer } from "mobx-react";

const Properties = observer(() => {
  const selectedShape = shapeStore?.getCurrentEntity(); // Get the currently selected shape
  
  // Extracting points for shapes with Float32Array
  const points = selectedShape?.geometry?.attributes?.position?.array;
  const centerpoint = shapeStore?.getCenter();
  const centerEllipse = shapeStore?.getCenterEllipse();
  console.log(centerEllipse, "centerEllipse");
  const Radius = selectedShape?.geometry?.parameters?.radius;
  const Rx = shapeStore?.getRadiusX();
  const Ry = shapeStore?.getRadiusY();
  console.log(centerpoint, "centerpoint");
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

  return (
    <div className="rounded max-h-screen overflow-y-auto">
      <div className="font-bold">Properties</div>
      {selectedShape ? (
        <>
          <div className="mb-4">{selectedShape.name}</div> {/* Show shape's name */}
          <hr className="my-4" />

          {/* Properties based on selected shape */}
          {selectedShape.name === "Line" && points && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Starting Point</div>
                <InputNumber label="x" value={getCoordinates(0).x} />
                <InputNumber label="y" value={getCoordinates(0).y} />
                <InputNumber label="z" value={getCoordinates(0).z} />
              </div>
              <div className="flex flex-col gap-4">
                <div>Ending Point</div>
                <InputNumber label="x" value={getCoordinates(1).x} />
                <InputNumber label="y" value={getCoordinates(1).y} />
                <InputNumber label="z" value={getCoordinates(1).z} />
              </div>
            </div>
          )}

          {selectedShape.name === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber label="x" value={centerpoint.x}/>
                <InputNumber label="y" value={centerpoint.y}/>
                <InputNumber label="z" value={centerpoint.z}/>
              </div>
              <div>
                <div>Radius</div>
                <InputNumber label="R" value={Radius} />
              </div>
            </div>
          )}

          {selectedShape.name === "Ellipse" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber label="x" value={centerEllipse.x}/>
                <InputNumber label="y" value={centerEllipse.y}/>
                <InputNumber label="z" value={centerEllipse.z}/>
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div>Radius</div>
                <InputNumber label="Rx" value={Rx}/>
                <InputNumber label="Ry" value={Ry}/>
              </div>
            </div>
          )}

          {selectedShape.name === "Polyline" && points && (
            <div>
              {Array.from({ length: (points.length - 6 )/ 3 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-4 mb-3">
                  <div>Point {index + 1}</div>
                  <InputNumber label="x" value={getCoordinates(index).x} />
                  <InputNumber label="y" value={getCoordinates(index).y} />
                  <InputNumber label="z" value={getCoordinates(index).z} />
                </div>
              ))}
            </div>
          )}

          <Button icon={<RxUpdate />} name="Update" />
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
