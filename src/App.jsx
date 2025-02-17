import React, { useState } from "react";
import "./App.css";
import SearchBar from "./Components/SearchBar";
import Navbar from "./Components/Navbar";
import Properties from "./Components/Properties";
import MainCanvas from "./Components/MainCanvas";
import { shapeStore } from "./Store";

function App() {
  // Store the uploaded shapes
  const [uploadedShapes, setUploadedShapes] = useState([]); // Store uploaded shapes

  // Handle the uploaded shapes and update the canvas
  const handleUpload = (shapesData) => {
    shapeStore.uploadShapes(shapesData);
    setUploadedShapes(shapesData); // Store the uploaded shapes
  };

  return (
    <div className="relative">
      <MainCanvas /> {/* Pass selectedShape for drawing */}
      
      <div className="w-full flex rounded h-auto absolute">
        <div className="w-80 m-3 rounded bg-gray-200">
          <SearchBar />
        </div>

        <div className="w-3/5 m-3 bg-white h-0">
          {/* No need to pass handleShapeSelect anymore */}
          <Navbar onUpload={handleUpload} />
        </div>

        <div className="w-92 m-3 p-2 rounded bg-gray-200">
          <Properties />
        </div>
      </div>
    </div>
  );
}

export default App;
