import Link from 'next/link'
import React from 'react'

const FooterLinks = ({text,linkText,href}:FooterLinkProps) => {
  return (
    <div className='text-center pt-4 '>
        <p className='text-smtext-gray-400 footer-link'>
            {text}{' '} <Link href={href} className='footer-link'>   {linkText}</Link>
        </p>
    </div>
  )
}

export default FooterLinks