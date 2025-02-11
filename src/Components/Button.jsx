
import React from 'react'

const Button = ({ icon, name }) => {
  return (
    <button className='flex gap-2 btn bg-gray-100 w-full justify-center hover:bg-white border border-gray-300 font-semibold py-2 px-4 rounded my-3'>
      {icon} {name}
    </button>
  )
}

export default Button

