import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import SearchBar from "./Components/SearchBar";
import Navbar from "./Components/Navbar";
import Properties from "./Components/Properties";
import * as THREE from "three";
import MainCanvas from "./Components/MainCanvas";

function App() {
  const [selectedShape, setSelectedShape] = useState(null);

  const handleShapeSelect = (shape) => {
    setSelectedShape(shape);
  };

  return (
    <div className="relative">
      <MainCanvas />
      <div className="w-full flex rounded min-h-screen absolute top-0 left-0 ">
        <div className="w-80 m-3 rounded bg-gray-200">
          <SearchBar onShapeSelect={handleShapeSelect} />
        </div>
        <div className="w-3/5 m-3 bg-white h-0">
          <Navbar />
        </div>
        <div className="w-92 m-3 p-2 rounded bg-gray-200">
          <Properties selectedShape={selectedShape} />
        </div>
      </div>
    </div>
  );
}

export default App;
