'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()

  const hideNavFooter = ['/login', '/register', '/admin'].some((path) =>
    pathname.startsWith(path)
  )

  return (
    <div className='max-w-7xl mx-auto'>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </div>
  )
}
