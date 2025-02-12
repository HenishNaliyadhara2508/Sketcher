import React from "react";
import { FaRegSave } from "react-icons/fa";
import { TbLine, TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

// Reusable Button component
const ShapeButton = ({ icon, label, onClick }) => {
  return (
    <div
      className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
      onClick={onClick}
    >
      {icon}
      {label}
    </div>
  );
};

const Navbar = ({ setShape }) => {
  // Prevent event propagation on click inside the Navbar
  const handleNavbarClick = (e) => {
    e.stopPropagation(); // Stops the event from propagating to the canvas
  };

  return (
    <div
      className="flex justify-start gap-2 h-18"
      onClick={handleNavbarClick} // Ensure any click on the navbar doesn't propagate to canvas
    >
      <div className="flex gap-2 p-2 rounded bg-gray-200">
        {/* Shape Buttons */}
        <ShapeButton
          icon={<TbLine />}
          label="Line"
          onClick={() => setShape("line")}
        />
        <ShapeButton
          icon={<FaRegCircle />}
          label="Circle"
          onClick={() => setShape("circle")}
        />
        <ShapeButton
          icon={<TbOvalVertical />}
          label="Ellipse"
          onClick={() => setShape("ellipse")}
        />
        <ShapeButton
          icon={<PiPolygonLight />}
          label="Polyline"
          onClick={() => setShape("polyline")}
        />
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
