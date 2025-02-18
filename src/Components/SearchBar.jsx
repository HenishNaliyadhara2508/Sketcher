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
import { shapeStore } from "../Store";
// Assuming this component is used to display shape info

const SearchBar = observer(() => {
  const shapes = shapeStore.shapes;
  const [searchTerm, setSearchTerm] = useState("");
  const [isFileExpanded, setFileExpanded] = useState(false);

  // Filter shapes based on the search term
  const filteredShapes = shapes.filter((shape) =>
    shape.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search term change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update search term state on input change
  };

  // Handle shape click to set it as the current entity
  const handleShapeClick = (shape) => {
    shapeStore.setEntity(shape);
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

    if (shape.mesh) {
      shape.mesh.visible = shape.visible;
    }

    if (shape.line) {
      shape.line.visible = shape.visible;
    }

    if (shape.group) {
      shape.group.visible = shape.visible;
    }
  };
  // Handle expanding/collapsing the "My file" section
  const handleToggleFile = () => {
    setFileExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col rounded min-h-[94vh]">
        <div className="mx-2 text-xl">List of Created Objects</div>
      <div className="flex justify-between p-2 rounded gap-2">
      
        
          <IoSearch className="text-xl items-center"/>
        
        <input
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          placeholder="Search for shapes..."
          value={searchTerm}
          onChange={handleSearch} // Handle search input change
        />
        
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
            {searchTerm === "" // If no search term, show all shapes
              ? shapes.map((shape) => {
                  const isSelected = shape === shapeStore.Entity();

                  return (
                    <div
                      key={shape.id}
                      className={`flex justify-between m-2 rounded hover:bg-white p-2 ${
                        isSelected ? "bg-blue-500" : ""
                      }`}
                      onClick={() => handleShapeClick(shape)}
                    >
                      <div className="flex items-center gap-2">
                        {/* Shape icon and name */}
                        <div>{getShapeIcon(shape.name)}</div>
                        <div>{shape.name}</div>
                        {/* Show shape number */}
                        <div className="ml-2 text-gray-500">
                          {console.log(shapeStore.getShapeNumberByNameAndUUID(
                            shape.name,
                            shape.uuid
                          ))
                          }
                        </div>
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
                              e.stopPropagation();
                              toggleVisibility(shape);
                            }}
                          />
                        )}
                        <RiDeleteBinLine
                          onClick={(e) => {
                            e.stopPropagation();
                            shapeStore.removeEntity(shape.uuid);
                            shapeStore.setEntity(null);
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              : filteredShapes.map((shape) => {
                  const isSelected = shape === shapeStore.Entity();

                  return (
                    <div
                      key={shape.id}
                      className={`flex justify-between m-2 rounded hover:bg-white p-2 ${
                        isSelected ? "bg-blue-500" : ""
                      }`}
                      onClick={() => handleShapeClick(shape)}
                    >
                      <div className="flex items-center gap-2">
                        {/* Shape icon and name */}
                        <div>{getShapeIcon(shape.name)}</div>
                        <div>{shape.name}</div>
                        {/* Show shape number */}
                        <div className="ml-2 text-gray-500">
                          {shapeStore.getShapeNumberByNameAndUUID(
                            shape.name,
                            shape.uuid
                          )}
                        </div>
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
                              e.stopPropagation();
                              toggleVisibility(shape);
                            }}
                          />
                        )}
                        <RiDeleteBinLine
                          onClick={(e) => {
                            e.stopPropagation();
                            shapeStore.removeEntity(shape.uuid);
                            shapeStore.setEntity(null);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
});

export default SearchBar;
