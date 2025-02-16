import React, { useState } from "react";
import "./App.css";
import SearchBar from "./Components/SearchBar";
import Navbar from "./Components/Navbar";
import Properties from "./Components/Properties";
import MainCanvas from "./Components/MainCanvas";

function App() {
  const [selectedShape, setSelectedShape] = useState(""); // Store the selected shape for drawing
  // const [createdShapes, setCreatedShapes] = useState([]); // Store created shapes for the list in SearchBar

  // Handle when a shape is selected in the Navbar for drawing
  const handleShapeSelect = (shape) => {
    setSelectedShape(shape); // Set the selected shape for drawing

  };

  return (
    <div className="relative">
      <MainCanvas selectedShape={selectedShape} /> {/* Pass selectedShape for drawing */}
      
      <div className="w-full flex rounded h-auto absolute">
        <div className="w-80 m-3 rounded bg-gray-200">
          <SearchBar />
        </div>

        <div className="w-3/5 m-3 bg-white h-0">
          <Navbar onShapeSelect={handleShapeSelect} />
        </div>

        <div className="w-92 m-3 p-2 rounded bg-gray-200">
          <Properties  
          />
        </div>
      </div>
    </div>
  );
}

export default App;
