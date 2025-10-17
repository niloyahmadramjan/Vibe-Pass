// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import AdminNavbar from './AdminNavbar'
// import AdminSidebar from './AdminSidebar'
// import { useAuth } from '../context/AuthContext'

// export default function AdminLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const { user, loading, logout } = useAuth()
//   const router = useRouter()

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
//   const closeSidebar = () => setSidebarOpen(false)

//   // 🛡️ Protect Admin Route
//   useEffect(() => {
//     if (loading) return // wait until auth state loaded

//     if (!user) {
//       // not logged in → redirect to login
//       router.push('/login')
//       return
//     }

//     if (user.role !== 'admin') {
//       // not an admin → logout + redirect
//       logout()
//       router.push('/login')
//     }
//   }, [user, loading, router, logout])

//   // show loader while checking auth
//   if (loading || !user) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//         <div className="text-lg animate-pulse">Checking admin access...</div>
//       </div>
//     )
//   }

//   // ✅ only admin can see below layout
//   return (
//     <div className="flex min-h-screen w-full bg-gray-900">
//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={closeSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed top-0 left-0 z-50 h-screen
//           bg-[#0d0e12] border-r border-[#1e1f26]
//           transform transition-transform duration-300 ease-in-out
//           lg:translate-x-0 lg:fixed
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//           w-64
//         `}
//       >
//         <AdminSidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col w-full lg:pl-64">
//         <div className="sticky top-0 z-30">
//           <AdminNavbar toggleSidebar={toggleSidebar} />
//         </div>

//         <main className="flex-1 bg-[#0f1115] text-white">
//           <div className="w-full h-full">{children}</div>
//         </main>
//       </div>
//     </div>
//   )
// }













// layout/AdminLayout.jsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../context/AuthContext'
import { FiMessageSquare, FiX } from 'react-icons/fi'
import AdminChatDrawer from '../components/AdminChatDrawer' // New compact chat component

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false) // ✅ Chat toggle state
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // 🛡️ Admin Access Protection
  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'admin') {
      logout()
      router.push('/login')
    }
  }, [user, loading, router, logout])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-lg animate-pulse">Checking admin access...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen
          bg-[#0d0e12] border-r border-[#1e1f26]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:fixed
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64`}
      >
        <AdminSidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:pl-64 relative">
        <div className="sticky top-0 z-30">
          <AdminNavbar toggleSidebar={toggleSidebar} />
        </div>

        <main className="flex-1 bg-[#0f1115] text-white">
          <div className="w-full h-full">{children}</div>
        </main>

        {/* 🟢 Floating Chat Button */}
        <button
          onClick={() => setChatOpen((prev) => !prev)}
          className="fixed bottom-6 right-6 bg-blue-500 text-white border-l-4 border-red-600/10 p-4 rounded-full shadow-lg hover:scale-105 transition-transform z-100"
        >
          {chatOpen ? <FiX size={26} className="text-white" /> : <FiMessageSquare size={26} className="text-white" />}
        </button>

        {/* 🧩 Chat Drawer (Open on Click) */}
        <AdminChatDrawer 
          isOpen={chatOpen} 
          onClose={() => setChatOpen(false)} 
        />
      </div>
    </div>
  )
}