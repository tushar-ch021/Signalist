import Link from 'next/link'
import React from 'react'
import Navitems from './Navitems'
import Userdropdown from './Userdropdown'



const Header = () => {
  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper'>
            <Link href={'/'} className='text-2xl font-bold text-white'>Signalist</Link>
            <nav className='hidden sm:block '>
                <Navitems />
            </nav>
            <Userdropdown />

        </div>
    </header>
  )
}

export default Header