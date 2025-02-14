import React from "react";
import { useState } from "react";

const ColorComponent = () => {
  const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });

  // Function to convert hex to RGB
  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  };

  const handleColorChange = (event) => {
    const hexColor = event.target.value;
    const rgb = hexToRgb(hexColor);
    setRgbColor(rgb);
  };
  return (
    <>
      <div>Color</div>
      <div className=" flex  mt-2 gap-5">
        <div className="w-1/5">
          <input type="color" onChange={handleColorChange} />
        </div>
        <div className="w-2/3 ">
          RGB: ({rgbColor.r}, {rgbColor.g},{rgbColor.b})
        </div>
        <div className=" w-1/5 me-8">
          <input
            className="w-4/5 bg-gray-100"
            type="number"
            min="0"
            max="100"
          />
        </div>
      </div>
    </>
  );
};

export default ColorComponent;
