import React from 'react'
import { FaCheck, FaXmark } from 'react-icons/fa6'
const StockAvailabillity = ({stock, inStock}: {stock: number; inStock: number}) => (
  <p className='text-xl flex gap-x-2 max-[500px]:justify-center'>Availability:
    {inStock === 1 ? <span className='text-green-500 flex items-center gap-x-1'>In stock <FaCheck /></span> : <span className='text-red-500 flex items-center gap-x-1'>Out of stock <FaXmark /></span>}
  </p>
)
export default StockAvailabillity
