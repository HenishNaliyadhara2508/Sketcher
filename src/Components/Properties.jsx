import React from "react";
import InputNumber from "./InputNumber"; // Make sure this is a valid component
import Button from "./Button";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";

const Properties = ({ selectedShape }) => {
  const [startingPoint, setStartingPoint] = React.useState({
    x: 1,
    y: 1,
    z: 1,
  });
  const [endingPoint, setEndingPoint] = React.useState({ x: 1, y: 1, z: 1 });
  const [center, setCenter] = React.useState({ x: 1, y: 1, z: 1 });
  const [radius, setRadius] = React.useState(1);
  const [radiusX, setRadiusX] = React.useState(1);
  const [radiusY, setRadiusY] = React.useState(1);

  const updateStartingPoint = (key, value) =>
    setStartingPoint({ ...startingPoint, [key]: value });
  const updateEndingPoint = (key, value) =>
    setEndingPoint({ ...endingPoint, [key]: value });
  const updateCenter = (key, value) => setCenter({ ...center, [key]: value });
  const updateRadius = (value) => setRadius(value);
  const updateRadiusX = (value) => setRadiusX(value);
  const updateRadiusY = (value) => setRadiusY(value);

  return (
    <div className="rounded">
      <div className="font-bold">Properties</div>
      {selectedShape ? (
        <>
          <div className="mb-4">{selectedShape}</div>
          <hr className="my-4" />

          {selectedShape === "Line" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Starting Point</div>
                <InputNumber
                  label="x"
                  onChange={(value) => updateStartingPoint("x", value)}
                />
                <InputNumber
                  label="y"
                  onChange={(value) => updateStartingPoint("y", value)}
                />
                <InputNumber
                  label="z"
                  onChange={(value) => updateStartingPoint("z", value)}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>Ending Point</div>
                <InputNumber
                  label="x"
                  onChange={(value) => updateEndingPoint("x", value)}
                />
                <InputNumber
                  label="y"
                  onChange={(value) => updateEndingPoint("y", value)}
                />
                <InputNumber
                  label="z"
                  onChange={(value) => updateEndingPoint("z", value)}
                />
              </div>
            </div>
          )}

          {selectedShape === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber
                  label="x"
                  onChange={(value) => updateCenter("x", value)}
                />
                <InputNumber
                  label="y"
                  onChange={(value) => updateCenter("y", value)}
                />
                <InputNumber
                  label="z"
                  onChange={(value) => updateCenter("z", value)}
                />
              </div>
              <div>
                <InputNumber label={radius} onChange={updateRadius} />
              </div>
            </div>
          )}

          {selectedShape === "Ellipse" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div>Center</div>
                <InputNumber
                  label="x"
                  onChange={(value) => updateCenter("x", value)}
                />
                <InputNumber
                  label="y"
                  onChange={(value) => updateCenter("y", value)}
                />
                <InputNumber
                  label="z"
                  onChange={(value) => updateCenter("z", value)}
                />
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div>Radius</div>
                <InputNumber label="Rx" onChange={updateRadiusX} />

                <InputNumber label="Ry" onChange={updateRadiusY} />
              </div>
            </div>
          )}

          {selectedShape === "Polyline" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div> Point 1</div>
                <InputNumber
                  label="x"
                  value={startingPoint.x}
                  onChange={(value) => updateStartingPoint("x", value)}
                />
                <InputNumber
                  label="y"
                  value={startingPoint.y}
                  onChange={(value) => updateStartingPoint("y", value)}
                />
                <InputNumber
                  label="z"
                  value={startingPoint.z}
                  onChange={(value) => updateStartingPoint("z", value)}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>Point n</div>
                <InputNumber
                  label="x"
                  value={endingPoint.x}
                  onChange={(value) => updateEndingPoint("x", value)}
                />
                <InputNumber
                  label="y"
                  value={endingPoint.y}
                  onChange={(value) => updateEndingPoint("y", value)}
                />
                <InputNumber
                  label="z"
                  value={endingPoint.z}
                  onChange={(value) => updateEndingPoint("z", value)}
                />
              </div>
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
};

export default Properties;
