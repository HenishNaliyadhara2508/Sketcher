import React, { useState } from "react";
import "./App.css";
import SearchBar from "./Components/SearchBar";
import Navbar from "./Components/Navbar";
import Properties from "./Components/Properties";
import MainCanvas from "./Components/MainCanvas";

function App() {
  const [selectedShape, setSelectedShape] = useState(""); // Store the selected shape
  const [createdShapes, setCreatedShapes] = useState([]); // Store created shapes for the list in SearchBar

  const handleShapeSelect = (shape) => {
    setSelectedShape(shape); // Set the selected shape
  };

  const handleShapeCreated = (shape) => {
    // Add the shape to the created shapes list
    setCreatedShapes((prevShapes) => [...prevShapes, shape]);
  };

  return (
    <div className="relative">
      <MainCanvas
        selectedShape={selectedShape}
        onShapeCreated={handleShapeCreated} // Pass handler to add shapes to SearchBar
      />
      
      <div className="w-full flex rounded min-h-screen absolute ">
        <div className="w-80 m-3 rounded bg-gray-200">
          <SearchBar createdShapes={createdShapes} />
        </div>

        <div className="w-3/5 m-3 bg-white h-0">
          <Navbar setShape={handleShapeSelect} /> {/* Pass setSelectedShape for Navbar */}
        </div>

        <div className="w-92 m-3 p-2 rounded bg-gray-200">
          <Properties selectedShape={selectedShape} />
        </div>
      </div>
    </div>
  );
}

export default App;
