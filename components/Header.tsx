import Link from 'next/link'
import React from 'react'
import Navitems from './Navitems'
import Userdropdown from './Userdropdown'
import { searchStocks } from '@/lib/actions/finnhub.action'



const Header = async({user}:{user:User}) => {
  const initialStocks=await searchStocks();
  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper'>
            <Link href={'/'} className='text-2xl font-bold text-white'>Signalist</Link>
            <nav className='hidden sm:block '>
                <Navitems initialStocks={initialStocks} />
            </nav>
            <Userdropdown user={user} initialStocks={initialStocks}/>

        </div>
    </header>
  )
}

export default Header