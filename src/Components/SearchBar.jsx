import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { observer } from "mobx-react";
import shapeStore from "../Store";

import Line from "../Utils/Line";
import Circle from "../Utils/Circle";
import Ellipse from "../Utils/Ellipse";
import Polyline from "../Utils/Polyline";

const SearchBar = observer(() => {
  const shapes = shapeStore.shapes;
  console.log(shapes, "shapes");

  // State for collapsing/expanding the "My file" section
  const [isFileExpanded, setFileExpanded] = useState(false);

  const createShapeInstance = (name) => {
    switch (name) {
      case "Line":
        return new Line();
      case "Circle":
        return new Circle();
      case "Ellipse":
        return new Ellipse();
      case "Polyline":
        return new Polyline();
      default:
        return null;
    }
  };

  const getShapeIcon = (name) => {
    switch (name) {
      case "Line":
        return <TbLine />;
      case "Circle":
        return <FaRegCircle />;
      case "Ellipse":
        return <TbOvalVertical />;
      case "Polyline":
        return <PiPolygonLight />;
      default:
        return null;
    }
  };

  const toggleVisibility = (shape) => {
    // Toggle visibility for the shape
    shape.visible = !shape.visible;

    // For Line, Circle, and Ellipse, check if they have a mesh property and toggle it
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

  // Set the current entity when a shape is clicked
  const handleShapeClick = (shape) => {
    shapeStore.setCurrentEntity(shape); // Set the selected shape as the current entity
  };

  // Handle the toggle for expanding and collapsing the "My file" panel
  const handleToggleFile = () => {
    setFileExpanded((prev) => !prev); // Toggle the file state
  }

  return (
    <div className="flex flex-col rounded">
      <div className="flex justify-between p-2 rounded">
        <div>List of Created Objects</div>
        <div>
          <IoSearch />
        </div>
      </div>
      <hr />

      {/* Collapsible "My file" Section */}
      <div
        className="flex justify-between m-2 rounded hover:bg-white cursor-pointer"
        onClick={handleToggleFile}
      >
        <div className="flex gap-1">
          {isFileExpanded ? "My file (Expanded)" : "My file"}
        </div>
        <div>{isFileExpanded ? <IoIosArrowDown /> : <IoIosArrowDown />}</div>
      </div>

      {/* Expandable/Collapsible Content */}
      {isFileExpanded && (
        <div>
          {/* List of created shapes */}
          <div className="mt-4">
            {shapes.length > 0 ? (
              shapes.map((shape) => {
                const isSelected = shape === shapeStore.getCurrentEntity(); // Check if the shape is selected

                return (
                  <div
                    key={shape.id}
                    className={`flex justify-between m-2 rounded hover:bg-white p-2 ${
                      isSelected ? "bg-blue-500" : "hoever:bg-white"
                    }`}
                    onClick={() => handleShapeClick(shape)} // Set the current entity on click
                  >
                    <div className="flex items-center gap-2">
                      <div>{getShapeIcon(shape.name)}</div>
                      <div>{shape.name}</div>
                    </div>
                    <div className="flex space-x-2">
                      {shape.visible ? (
                        <IoEyeOutline
                          onClick={(e) => {
                            e.stopPropagation(); 
                            toggleVisibility(shape);
                          }}
                        />
                      ) : (
                        <IoEyeOffOutline
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering handleShapeClick
                            toggleVisibility(shape);
                          }}
                        />
                      )}
                      <RiDeleteBinLine
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleShapeClick
                          shapeStore.removeEntity(shape);
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="m-2 text-gray-500">No shapes created yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default SearchBar;
