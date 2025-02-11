
import React from 'react'

const InputNumber = ({ label }) => {

  return (
    <>
    <div className='flex gap-2 items-center'>
        <label htmlFor="x">{label}</label>:
        <input type="number" className='bg-white py-2 px-4 rounded w-full' placeholder='1'/>
    </div>
    </>
  )
}

export default InputNumber
