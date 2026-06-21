import { incentives } from '@/lib/utils'
import React from 'react'
const Incentives = () => (
  <div className="py-20 bg-gray-50">
    <h2 className='text-4xl font-bold text-center text-gray-900 mb-4'>Why Choose Us</h2>
    <p className="text-center text-gray-500 text-lg mb-14">The catering experience you deserve</p>
    <div className="mx-auto max-w-screen-2xl py-4 sm:px-2 lg:px-4">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-12 gap-y-10 px-8 lg:max-w-none lg:grid-cols-3">
        {incentives.map((incentive) => (
          <div key={incentive.name} className="text-center flex flex-col items-center gap-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <img width={36} height={36} src={incentive.imageSrc} alt={incentive.name} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{incentive.name}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{incentive.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
export default Incentives
