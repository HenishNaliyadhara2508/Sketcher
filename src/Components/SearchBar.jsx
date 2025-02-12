import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import ShapeSelection from "./ShapeSelection";
import { IoIosArrowDown } from "react-icons/io";

const SearchBar = ({ onShapeSelect }) => {
  // Track the created shapes
  const [shapes, setShapes] = useState([]);

  // Handle when a shape is selected from the navbar
  const handleShapeSelect = (shape) => {
    // Create a new shape object
    const newShape = { id: Date.now(), name: shape };
    setShapes((prevShapes) => [...prevShapes, newShape]);
    onShapeSelect(shape); // Call the provided callback function
  };

  // Handle delete for a shape
  const handleDelete = (id) => {
    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id));
  };

  return (
    <div className="flex flex-col rounded">
      <div className="flex justify-between p-2 rounded">
        <div>List of Created Objects</div>
        <div>
          <IoSearch />
        </div>
      </div>
      <hr />
      <div className="flex justify-between m-2 rounded hover:bg-white">
        <div className="flex gap-1">
          <IoIosArrowDown /> My file 1
        </div>
        <div className="flex justify-between space-x-2">
          <IoEyeOutline />
          <RiDeleteBinLine />
        </div>
      </div>
      
      {/* Shape selection options */}
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<TbLine />} name="Line" onClick={() => handleShapeSelect('Line')} />
      </div>
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<FaRegCircle />} name="Circle" onClick={() => handleShapeSelect('Circle')} />
      </div>
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<TbOvalVertical />} name="Ellipse" onClick={() => handleShapeSelect('Ellipse')} />
      </div>
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<PiPolygonLight />} name="Polyline" onClick={() => handleShapeSelect('Polyline')} />
      </div>

      {/* List of created shapes */}
      <div className="mt-4">
        {shapes.length > 0 ? (
          shapes.map((shape) => (
            <div key={shape.id} className="flex justify-between m-2 rounded hover:bg-white">
              <div>{shape.name}</div>
              <div className="flex space-x-2">
                <IoEyeOutline /> {/* Add the 'view' icon */}
                <RiDeleteBinLine onClick={() => handleDelete(shape.id)} /> {/* Delete the shape */}
              </div>
            </div>
          ))
        ) : (
          <div className="m-2 text-gray-500">No shapes created yet.</div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
