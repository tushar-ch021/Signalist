import Image from "next/image"
import Link from "next/link"

import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const Layout = async({children}: {children: React.ReactNode}) => {
    const session =await auth.api.getSession({headers:await headers()})
    if(session?.user) redirect('/')
  return (
    <main className='auth-layout '>
        <section className="auth-left-section scrollbar-hide-default ">
            <Link href="/auth/sign-in" className='auth-logo'>Signalist</Link>
            <div className="pb-6 ld:pb-8 flex-1 ">{children}</div>
        </section>
        <section className="auth-right-section scrollbar-hide-default ">
          
            <div className="z-10 relative lg:mt-4 lg:mb-16"><blockquote className="auth-blockquote ">Signalist provides up-to-the-second updates on stock prices, indices, and commodities. Unlike many free apps that lag behind actual market movements, Signalist’s live feed ensures you never miss critical entry or exit points.</blockquote>
            <div className="flex items-center justify-between">
                <cite className="auth-testimonial-author ">- Tushar Ch.</cite>
                <p className="max-md:text-xs text-gray-500 ">Retail Investor</p>
            </div>
            <div className="flex items-center gap-0.5">{[1,2,3,4,5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500">
                    <path d="M10 15.27L16.18 20 14.54 12.97 20 8.64l-7.19-.61L10 2 7.19 8.03 0 8.64l5.46 4.33L3.82 20z" />
                </svg>
            ))}</div>
            </div>
            <div className="flex-1 relative">
                <Image src="/assets/images/dashboard.png" alt="dashboard-img" objectFit="cover" width={1440} height={1150} className="/auth-dashboard-preview absolute top-2 " />
            </div>
        </section>
    </main>
  )
}

export default Layout