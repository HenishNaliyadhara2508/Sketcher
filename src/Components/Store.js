import { makeAutoObservable } from "mobx";

class ShapeStore {
  selectedShape = "";

  constructor() {
    makeAutoObservable(this); // This makes `selectedShape` observable and actions available
  }

  setSelectedShape(shape) {
    this.selectedShape = shape; // This is the action that updates the selected shape
  }
}

const shapeStore = new ShapeStore(); // Instantiate the store
export default shapeStore; // Export the store instance
