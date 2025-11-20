'use client'

import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import React from 'react'
import SearchCommand from './SearchCommands'

const Navitems = ({initialStocks}:{initialStocks : StockWithWatchlistStatus[]}) => {
    const pathname=usePathname()
    const isActive=(path:string)=>{
        if(path === '/'){
            return pathname === '/'
        }
        return pathname.startsWith(path) === true
    }
  return (
    <ul className='flex flex-col sm:flex-row gap-6 sm:gap-10 text-lg font-medium'>
      {NAV_ITEMS.map(({ href, label }) => {
        if(label==='Search') return (
          <li key='search-trigger'>
            <SearchCommand
              renderAs='text'
              label='Search'
              initialStocks={initialStocks} 
            />
          </li>
        )
        return <li key={href}>
          <Link href={href} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : 'text-gray-400'}`}>{label}</Link>
        </li>
})}
    </ul>
  )
}

export default Navitems