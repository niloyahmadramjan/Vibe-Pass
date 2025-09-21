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
    <div className="bottom-0 left-0 w-full h-full bg-gradient-to-t to-black from-red-500/10">
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </div>
  )
}
