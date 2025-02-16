import React from "react";
import {shapeStore} from "../Store";

const Button = ({ icon, name, entityID, handleClick }) => {


  const handleButtonClick = (id) => {
    handleClick(id);
    console.log(shapeStore.shapes, "shapes in button");
  };
  return (
    <>
      <div
        className="flex gap-2 btn bg-gray-100 w-full justify-center hover:bg-white border border-gray-300 font-semibold py-2 px-4 rounded my-3"
        onClick={() => {
          handleButtonClick(entityID);
        }}
      >
        <div>{icon}</div>
        <div>{name}</div>
      </div>
    </>
  );
};

export default Button;
