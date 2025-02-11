import React from "react";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import ShapeSelection from "./ShapeSelection";
import { IoIosArrowDown } from "react-icons/io";

const SearchBar = ({ onShapeSelect }) => {
  return (
    <div className="flex flex-col rounded">
      <div className="flex justify-between p-2 rounded">
        <div>List of Created Objects</div>
        <div>
          <IoSearch />
        </div>
      </div>
      <hr />
      <div className="flex justify-between m-2 rounded hover:bg-white">
      
        <div className="flex gap-1"><IoIosArrowDown /> My file 1</div>
        <div className="flex justify-between space-x-2">
          <IoEyeOutline />
          <RiDeleteBinLine />
        </div>
      </div>
      {/* Shape options */}
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<TbLine />} name="Line" onClick={() => onShapeSelect('Line')} />
      </div>
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<FaRegCircle />} name="Circle" onClick={() => onShapeSelect('Circle')} />
      </div>
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<TbOvalVertical />} name="Ellipse" onClick={() => onShapeSelect('Ellipse')} />
      </div>
      <div className="ml-8 hover:bg-white rounded ">
        <ShapeSelection icon={<PiPolygonLight />} name="Polyline" onClick={() => onShapeSelect('Polyline')} />
      </div>
    </div>
  );
};

export default SearchBar;
