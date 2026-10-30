import React from 'react'
import { FaCheckCircle, FaFlask, FaTruck, FaLock } from 'react-icons/fa'

const trustItems = [
  { label: 'Authentic', Icon: FaCheckCircle },
  { label: 'Certified Rudraksha', Icon: FaFlask },
  { label: 'Pan-India Delivery', Icon: FaTruck },
  { label: 'Secure Payment', Icon: FaLock },
]

const TrustStrip = () => {
  return (
    <section className="bg-[#FFF6DE] py-3 sm:py-5" aria-label="Store trust highlights">
      <ul className="mx-auto flex w-full max-w-7xl items-start justify-between gap-1 px-2 sm:w-[92%] sm:gap-3 sm:px-0">
        {trustItems.map(({ label, Icon }) => (
          <li key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-amber-200/80 sm:h-10 sm:w-10">
              <Icon className="text-base sm:text-lg" aria-hidden />
            </span>
            <span className="text-[10px] font-semibold leading-tight text-stone-700 sm:text-sm">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TrustStrip
