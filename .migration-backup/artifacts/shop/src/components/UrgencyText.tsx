import React from 'react'
const UrgencyText = ({stock}: {stock: number}) => (
  <p className='text-green-500 text-xl max-[500px]:text-lg'>Hurry up! only <span className='bg-green-500 text-white text-xl px-2 rounded max-[500px]:text-lg'>{stock}</span> products left in stock!</p>
)
export default UrgencyText
