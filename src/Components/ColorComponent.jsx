import React, { useState, useEffect } from "react";

const ColorComponent = ({ value, setColor }) => {
  const [hexColor, setHexColor] = useState(value);

  useEffect(() => {
    setHexColor(value); // Sync color input with parent color state
  }, [value]);

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    let r = 0,
      g = 0,
      b = 0;
    // 3 digits
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
  };

  const handleChange = (event) => {
    const newHexColor = event.target.value;
    setHexColor(newHexColor);

    const { r, g, b } = hexToRgb(newHexColor);
    setColor({ r, g, b });
  };

  return (
    <div className="flex mt-2 gap-5">
      <div className="w-1/5">
        <input type="color" value={hexColor} onChange={handleChange} />
      </div>
      <div className="w-2/3">
        RGB: ({hexToRgb(hexColor).r}, {hexToRgb(hexColor).g},
        {hexToRgb(hexColor).b})
      </div>
      <div className="w-1/5 me-8">
        <input className="w-4/5 bg-gray-100" type="number" min="0" max="100" />
      </div>
    </div>
  );
};

export default ColorComponent;
