import React from "react";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { FaRegSave } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const Navbar = ({ onShapeSelect }) => {

  // Handle click event for navbar buttons and stop event propagation
  const handleNavbarClick = (e, shape, icon) => {
    e.stopPropagation(); // Stop click event propagation
    onShapeSelect(shape, icon); // Call the passed onShapeSelect function
  };

  return (
    <div className="flex justify-start gap-2 h-18">
      <div className="flex gap-2 p-2 rounded bg-gray-200">
        <div
          className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
          onClick={(e) => handleNavbarClick(e, "Line", <TbLine />)} // Stop event propagation and pass shape and icon
        >
          <TbLine />
          Line
        </div>
        <div
          className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
          onClick={(e) => handleNavbarClick(e, "Circle", <FaRegCircle />)} // Stop event propagation and pass shape and icon
        >
          <FaRegCircle />
          Circle
        </div>
        <div
          className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
          onClick={(e) => handleNavbarClick(e, "Ellipse", <TbOvalVertical />)} // Stop event propagation and pass shape and icon
        >
          <TbOvalVertical />
          Ellipse
        </div>
        <div
          className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
          onClick={(e) => handleNavbarClick(e, "Polyline", <PiPolygonLight />)} // Stop event propagation and pass shape and icon
        >
          <PiPolygonLight />
          Polyline
        </div>
      </div>
      <div className="btn bg-gray-200 hover:bg-white font-semibold px-4 flex flex-col items-center justify-center rounded">
        <FaRegSave /> Save
      </div>

      <div className="btn bg-gray-200 hover:bg-white font-semibold px-2 rounded flex flex-col items-center justify-center">
        <FiUpload />
        Upload
      </div>
    </div>
  );
};

export default Navbar;
