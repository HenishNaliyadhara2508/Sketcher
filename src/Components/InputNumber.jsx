import React from 'react'

const InputNumber = ({ label, value, onChange }) => {

  const handleChange = (e) => {
    const newValue = e.target.value;
    // Check if the new value is a valid number or empty string
    if (newValue === "" || !isNaN(newValue)) {
      onChange(newValue); // Pass the new value to the parent component
    }
  };

  return (
    <div className='flex gap-2 items-center bg-white rounded p-1 px-2'>
      <label>{label}</label>:
      <input
        type="number"
        className=' py-2 px-4 rounded w-full'
        value={value != null ? value : ""} // Handling both undefined and null
        onChange={handleChange}
      />
    </div>
  );
};

export default InputNumber;
