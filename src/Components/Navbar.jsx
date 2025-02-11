import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { TbLine, TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const Navbar = ({ setDrawingTool }) => {
  const handleToolChange = (tool) => {
    setDrawingTool(tool); // Set the selected drawing tool
  };

  return (
    <>
      <div className="flex justify-start gap-2 h-12">
        <div className="flex gap-2 p-2 rounded bg-gray-200">
          <div
            className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
            onClick={() => handleToolChange("line")}
          >
            <TbLine />
            Line
          </div>
          <div
            className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
            onClick={() => handleToolChange("circle")}
          >
            <FaRegCircle />
            Circle
          </div>
          <div
            className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
            onClick={() => handleToolChange("ellipse")}
          >
            <TbOvalVertical />
            Ellipse
          </div>
          <div
            className="btn bg-gray-200 hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center"
            onClick={() => handleToolChange("polygon")}
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
    </>
  );
};

export default Navbar;
