'use client';

import { FiBell, FiMenu } from "react-icons/fi";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminNavbar({ toggleSidebar }) {
    const router = useRouter()
  
   const { data: session, status } = useSession()
  const { user, logout } = useAuth()

    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  
  // console.log(user



  const handleLogout = async () => {
    if (session) {
      await signOut({ redirect: false })
    }
    if (user) {
      await logout({ redirect: false })
      toast.success('Logged out successfully!')
    }
    router.refresh()
  }

  return (
    <nav className="w-full bg-[#0c0c0f] text-white shadow px-4 lg:px-6  flex items-center justify-between border-b border-[#1e1f26]">
      {/* Left: Menu button only */}
      <div className="flex items-center">
        {/* Menu icon (visible only on mobile) */}
        <button
          className="lg:hidden p-2 hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Notification Icon */}
        <button className="relative p-2 hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
          <FiBell size={20} className="text-gray-300 hover:text-white transition" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {/* User Image */}
          <div className="border-b border-[#1e1f26] p-4">
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#e4e6eb] overflow-hidden"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user?.name || 'User'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#1b1e2b] rounded-lg shadow-lg overflow-hidden border border-[#1e1f26] z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 !text-white !hover:bg-[#2a2c36] !hover:text-white"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                   
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-3 !text-white hover:bg-[#2a2c36] hover:text-white"
                      
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user?.name || 'Admin User'}</p>
                <p className="text-gray-400 text-sm">Admin</p>
              </div>
            </div>
          </div>

          {/* User Info - hidden on mobile, visible on desktop */}
          {/* <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white">
              {user?.name || 'Admin User'}
            </div>
            <div className="text-xs text-gray-400">Admin</div>
          </div> */}
        </div>
      </div>
    </nav>
  );
}