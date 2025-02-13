
import React from 'react'

const InputNumber = ({ label,value }) => {

  return (
    <>
    <div className='flex gap-2 items-center bg-white rounded p-1'>
        <label htmlFor="x">{label}</label>:
        <input type="number" className=' py-2 px-4 rounded w-full' value={value}/>
    </div>
    </>
  )
}

export default InputNumber
