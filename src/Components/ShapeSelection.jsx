import React from 'react'
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

const ShapeSelection = ({icon, name, onClick}) => {
  return (
    <div className="flex justify-between m-2" onClick={onClick}>
            <div className="flex gap-1 ">
              {icon} {name}
            </div>
            <div className="flex justify-between space-x-2 ">
              <IoEyeOutline />
              <RiDeleteBinLine />
            </div>
          </div>
  )
}

export default ShapeSelection