import React from "react";
import Button from "./Button";
import InputNumber from "./InputNumber";
import ColorComponent from "./ColorComponent";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import  {shapeStore}  from "../Store";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";

// import * as THREE from "three";

const Properties = observer(() => {
  const entity = shapeStore.Entity();
  console.log(
    entity?.material.color.r,
    entity?.material.color.g,
    entity?.material.color.b,
    "color"
  );
  
  const [circleCenter, setCircleCenter] = useState({ x: 0, y: 0, z: 0 });
  const [circleRadius, setCircleRadius] = useState(null);
  const [ellipseCenter, setEllipseCenter] = useState({ x: 0, y: 0, z: 0 });
  const [Rx, setRx] = useState(null);
  const [Ry, setRy] = useState(null);
  const [lineStart, setLineStart] = useState([]); //{ x: 0, y: 0, z: 0 }
  const [lineEnd, setLineEnd] = useState([]); //{ x: 0, y: 0, z: 0 }
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [opacity, setOpacity] = useState(null);

  // setColor([entity.material.color.r,entity.material.color.g,entity.material.color.b])
  useEffect(() => {
    if (entity?.name === "Circle") {
      setCircleCenter(entity.center);
      setCircleRadius(entity.geometry.parameters.radius);
      // circleRadius = entity.geometry.parameters.radius;
      // circleCenter = entity.center;
    }
    if (entity?.name === "Ellipse") {
      const ellipseRadius = shapeStore.getEllipseRadius(entity?.uuid);
      console.log(ellipseRadius, "ellipse-radius");
      setEllipseCenter(entity.position);
      setRx(ellipseRadius[0]);
      setRy(ellipseRadius[1]);
      // ellipseCenter = entity.position;
      // ellipseRadius = shapeStore.getEllipseRadius(entity?.uuid);
      // Rx = ellipseRadius[0];
      // Ry = ellipseRadius[1];

      // console.log(shapeStore.getEllipseRadius(entity?.uuid), "radius");
    }
    if (entity?.name === "Line") {
      setLineStart(entity.geometry.attributes.position.array.slice(0, 3));
      setLineEnd(entity.geometry.attributes.position.array.slice(3, 6));
      console.log(lineStart, "start", lineEnd, "end");
    }

    if (entity?.name === "Polyline") {
      const points = entity.geometry.attributes.position.array;
      const polylinePoints = Array.from({
        length: (points.length - 6) / 3,
      }).map((_, index) => ({
        x: points[index * 3],
        y: points[index * 3 + 1],
        z: points[index * 3 + 2],
      }));
      setPolylinePoints(polylinePoints);
    }
    if (entity?.material) {
      const { r, g, b } = entity.material.color;
      setColor({
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      });
      //g: entity?.material.color.g * 255
    }
    if (entity?.material) {
      const opacity = Math.round(entity.material?.opacity * 100);
      setOpacity(opacity);
    }
  }, [entity]);
  // console.log(color, "color");
  // console.log(entity, "entity in right side");

  //handler
  const handleLineStartChange = (axis, value) => {
    const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    setLineStart((prevState) => {
      const newStart = [...prevState]; // Make a copy of the array
      newStart[axisIndex] = value; // Update the corresponding axis
      return newStart;
    });

    // setLineStart((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handleLineEndChange = (axis, value) => {
    const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    setLineEnd((prevState) => {
      const newEnd = [...prevState]; // Make a copy of the array
      newEnd[axisIndex] = value; // Update the corresponding axis
      return newEnd;
    });
    // setLineEnd((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handlePolylinePointChange = (index, axis, value) => {
    const updatedPoints = [...polylinePoints];
    updatedPoints[index][axis] = value;
    setPolylinePoints(updatedPoints);
  };

  const handleCircleCenterChange = (axis, value) => {
    setCircleCenter((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handleEllipseCenterChange = (axis, value) => {
    setEllipseCenter((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handleCircleRadiusChange = (value) => {
    setCircleRadius(value);
  };

  const handleEllipseRadiusXChange = (value) => {
    setRx(value);
  };

  const handleEllipseRadiusYChange = (value) => {
    setRy(value);
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  };

  const handleColor = (value) => {
    setColor(value);
    // if (entity?.material) {
    //   entity.material.color.setRGB(value.r / 255, value.g / 255, value.b / 255);
    // }
  };

  const handleOpacity = (value) => {
    setOpacity(Math.max(0, Math.min(100, value)));

    // setOpacity(value)
  };
  const handleHide = (id) => {
    shapeStore.hideEntity(id);
  };

  const handleRemove = (id) => {
    shapeStore.removeEntity(id);
    shapeStore.setEntity(null);
  };

  const handleUpdate = (entityId) => {
    const updatedProperties = {
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
    };

    shapeStore.updateEntity(entityId, updatedProperties); // Pass the updated properties to the store
  };

  // const handleUpdate = (id) => {
  //   shapeStore.updateEntity(id); // Pass the ID of the selected entity to update its properties
  // };

  // const points = entity?.geometry.attributes.position.array;

  // const getCoordinates = (index) => {
  //   if (points && points.length >= index * 3 + 3) {
  //     return {
  //       x: points[index * 3],
  //       y: points[index * 3 + 1],
  //       z: points[index * 3 + 2],
  //     };
  //   }
  //   return { x: 0, y: 0, z: 0 };
  // };

  return (
    //container flex-col absolute right-0 top-0 z-10 m-5 p-5 bg-gray-200 mx-3   min-h-screen rounded-xl w-[25%]
    <div className="rounded max-h-screen overflow-auto rounded-xl ">
      <div className="font-bold text-2xl">Properties</div>
      {entity ? (
        <>
          <div className="mb-4 text-l">{entity.name}</div>{" "}
          {/* Show shape's name */}
          <hr className="my-4" />
          {/* Properties based on selected shape */}
          {entity.name === "Line" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Starting Point</div>
                <InputNumber
                  label="x"
                  value={lineStart[0]} //{lineStart.x}
                  onChange={(value) => handleLineStartChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={lineStart[1]} //{lineStart.y}
                  onChange={(value) => handleLineStartChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={lineStart[2]} //{lineStart.z}
                  onChange={(value) => handleLineStartChange("z", value)}
                />
                {/* <InputNumber label="x" value={getCoordinates(0).x} />
                <InputNumber label="y" value={getCoordinates(0).y} />
                <InputNumber label="z" value={getCoordinates(0).z} /> */}
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl">Ending Point</div>
                <InputNumber
                  label="x"
                  value={lineEnd[0]} //{lineEnd.x}
                  onChange={(value) => handleLineEndChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={lineEnd[1]} //{lineEnd.y}
                  onChange={(value) => handleLineEndChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={lineEnd[2]} //{lineEnd.z}
                  onChange={(value) => handleLineEndChange("z", value)}
                />
                {/* <InputNumber label="x" value={getCoordinates(1).x} />
                <InputNumber label="y" value={getCoordinates(1).y} />
                <InputNumber label="z" value={getCoordinates(1).z} /> */}
              </div>
            </div>
          )}
          {entity.name === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Center</div>
                <InputNumber
                  label="x"
                  value={circleCenter.x}
                  onChange={(value) => handleCircleCenterChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={circleCenter.y}
                  onChange={(value) => handleCircleCenterChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={circleCenter.z}
                  onChange={(value) => handleCircleCenterChange("z", value)}
                />
                {/* <InputNumber label="x" value={circleCenter.x} />
                <InputNumber label="y" value={circleCenter.y} />
                <InputNumber label="z" value={circleCenter.z} /> */}
              </div>

              <div>
                <div className="text-xl">Radius</div>
                <InputNumber
                  label="R"
                  value={circleRadius}
                  onChange={handleCircleRadiusChange}
                />
                {/* <InputNumber label="R" value={circleRadius} /> */}
              </div>
            </div>
          )}
          {entity.name === "Ellipse" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Center</div>
                <InputNumber
                  label="x"
                  value={ellipseCenter.x}
                  onChange={(value) => handleEllipseCenterChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={ellipseCenter.y}
                  onChange={(value) => handleEllipseCenterChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={ellipseCenter.z}
                  onChange={(value) => handleEllipseCenterChange("z", value)}
                />
                {/* <InputNumber label="x" value={ellipseCenter.x} />
                <InputNumber label="y" value={ellipseCenter.y} />
                <InputNumber label="z" value={ellipseCenter.z} /> */}
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div className="text-xl">Radius</div>
                <InputNumber
                  label="Rx"
                  value={Rx}
                  onChange={handleEllipseRadiusXChange}
                />
                <InputNumber
                  label="Ry"
                  value={Ry}
                  onChange={handleEllipseRadiusYChange}
                />
                {/* <InputNumber label="Rx" value={Rx} />
                <InputNumber label="Ry" value={Ry} /> */}
              </div>
            </div>
          )}
          {entity.name === "Polyline" && (
            <div>
              {polylinePoints.map((point, index) => (
                <div key={index} className="flex flex-col gap-4 mb-3">
                  <div className="text-xl">Point {index + 1}</div>
                  <InputNumber
                    label="x"
                    value={point.x}
                    onChange={(value) =>
                      handlePolylinePointChange(index, "x", value)
                    }
                  />
                  <InputNumber
                    label="y"
                    value={point.y}
                    onChange={(value) =>
                      handlePolylinePointChange(index, "y", value)
                    }
                  />
                  <InputNumber
                    label="z"
                    value={point.z}
                    onChange={(value) =>
                      handlePolylinePointChange(index, "z", value)
                    }
                  />
                </div>
              ))}
              {/* {Array.from({ length: (points.length - 6) / 3 }).map(
                (_, index) => (
                  <div key={index} className="flex flex-col gap-4 mb-3">
                    <div className="text-xl">Point {index + 1}</div>
                    <InputNumber label="x" value={getCoordinates(index).x} />
                    <InputNumber label="y" value={getCoordinates(index).y} />
                    <InputNumber label="z" value={getCoordinates(index).z} />
                  </div>
                )
              )} */}
            </div>
          )}
          <Button
            icon={<RxUpdate />}
            name="Update"
            entityID={entity.uuid}
            handleClick={handleUpdate}
          />
          <div className="text-xl">Color</div>
          <ColorComponent
            value={rgbToHex(color.r, color.g, color.b)}
            setColor={(value) => {
              handleColor(value);
            }}
            opacity={opacity}
            handleOpacity={handleOpacity}
          />
          {/* <div>
            <input type="color" />
          </div> */}
          <Button
            icon={<GrFormViewHide />}
            name="Hide"
            entityID={entity.uuid}
            handleClick={handleHide}
          />
          <Button
            icon={<RiDeleteBinLine />}
            name="Delete"
            entityID={entity.uuid}
            handleClick={handleRemove}
          />
        </>
      ) : (
        <div className="text-xl flex bg-transparent items-center">Select a shape to see its properties.</div>
      )}
    </div>
  );
});

export default Properties;