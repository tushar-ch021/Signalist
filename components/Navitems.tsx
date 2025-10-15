'use client'
import NAV_ITEMS from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import React from 'react'

const Navitems = () => {
    const pathname=usePathname()
    const isActive=(path:string)=>{
        if(path === '/'){
            return pathname === '/'
        }
        return pathname.startsWith(path) === true
    }
  return (
    <ul className='flex flex-col sm:flex-row gap-6 sm:gap-10 text-lg font-medium'>
      {NAV_ITEMS.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : 'text-gray-600'}`}>{label}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Navitems