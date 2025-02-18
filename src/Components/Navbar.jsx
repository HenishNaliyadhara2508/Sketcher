import React from "react";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { FaRegSave } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { shapeStore } from "../Store";

const Navbar = ({ onUpload }) => {
  // Handle click event for navbar buttons and stop event propagation
  const handleNavbarClick = (e, shape) => {
    e.stopPropagation(); // Stop click event propagation
    shapeStore.setSelectedShape(shape); // Set selected shape in the store
  };

  // Handle save button click event
  const handleSaveClick = (e) => {
    e.stopPropagation();
    shapeStore.exportShapesToJSON(); // Export shapes as JSON using the shapeStore
  };

  // Handle file upload button click event
  const handleUploadClick = (e) => {
    e.stopPropagation();
    document.getElementById("fileUploadInput").click(); // Trigger the hidden file input
  };

  // Handle file input change event (when the user selects a file)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Parse the JSON file
          const data = JSON.parse(event.target.result);
  
          // If the data is an array of arrays, flatten it into a single array
          const flattenedData = Array.isArray(data[0]) ? data.flat() : data;
  
          // Filter out invalid shapes (e.g., shapes with no name or uuid)
          const validShapes = flattenedData.filter(
            (shape) => shape.name && shape.uuid
          );
  
          // Remove duplicates based on UUID using a Set
          const uniqueShapes = [];
          const seenUUIDs = new Set();
          for (const shape of validShapes) {
            if (!seenUUIDs.has(shape.uuid)) {
              seenUUIDs.add(shape.uuid);
              uniqueShapes.push(shape);
            }
          }
  
          // Call the onUpload function with the cleaned data
          if (typeof onUpload === "function") {
            onUpload(uniqueShapes);
          } else {
            console.error("onUpload is not a function!");
          }
        } catch (error) {
          console.error("Error parsing or processing the JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = null;
  };

  // Helper function to check if a shape is the selected one
  const isSelected = (shape) => shapeStore.selectedShape === shape;
  console.log(isSelected)

  return (
    <div className="flex justify-start gap-2 h-18">
      <div className="flex gap-2 p-2 rounded bg-gray-200">
        <div
          className={`btn hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center ${isSelected(
            "Line"
          ) ? "bg-blue-500 text-white" : ""}`}
          onClick={(e) => handleNavbarClick(e, "Line")}
        >
          <TbLine />
          Line
        </div>
        <div
          className={`btn  hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center ${isSelected(
            "Circle"
          ) ? "bg-blue-500 text-white" : ""}`}
          onClick={(e) => handleNavbarClick(e, "Circle")}
        >
          <FaRegCircle />
          Circle
        </div>
        <div
          className={`btn hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center ${isSelected(
            "Ellipse"
          ) ? "bg-blue-500 text-white" : ""}`}
          onClick={(e) => handleNavbarClick(e, "Ellipse")}
        >
          <TbOvalVertical />
          Ellipse
        </div>
        <div
          className={`btn hover:bg-white font-semibold py-2 px-4 rounded flex flex-col items-center justify-center ${isSelected(
            "Polyline"
          ) ? "bg-blue-500 text-white" : ""}`}
          onClick={(e) => handleNavbarClick(e, "Polyline")}
        >
          <PiPolygonLight />
          Polyline
        </div>
      </div>
      <div
        className="btn bg-gray-200 hover:bg-white font-semibold px-4 flex flex-col items-center justify-center rounded"
        onClick={handleSaveClick} // Add save button click handler
      >
        <FaRegSave /> Save
      </div>

      {/* Upload button that triggers file input */}
      <div
        className="btn bg-gray-200 hover:bg-white font-semibold px-2 rounded flex flex-col items-center justify-center"
        onClick={handleUploadClick} // Add upload button click handler
      >
        <FiUpload />
        Upload
      </div>

      {/* Hidden file input for uploading JSON file */}
      <input
        id="fileUploadInput"
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange} // Handle file input change
      />
    </div>
  );
};

export default Navbar;
