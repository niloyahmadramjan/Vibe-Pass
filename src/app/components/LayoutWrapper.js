'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatIcon from './ChatIcon' 

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()

  const hideNavFooter = ['/login', '/register', '/admin'].some((path) =>
    pathname.startsWith(path)
  )

  return (
    <div className="bottom-0 left-0 w-full h-[100vh] bg-gradient-to-b from-black via-gray-900 to-black">
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
      {!hideNavFooter && <ChatIcon />}
    </div>
  )
}