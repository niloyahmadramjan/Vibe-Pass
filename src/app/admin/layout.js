'use client';

import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-[#0d0e12] border-r border-[#1e1f26]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:fixed
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
        `}
      >
        <AdminSidebar
          toggleSidebar={toggleSidebar}
          isOpen={sidebarOpen}
        />
      </div>

      {/* Main Content - Full width on desktop */}
      <div className="flex-1 flex flex-col w-full lg:pl-64">
        {/* Navbar */}
        <div className="sticky top-0 z-30">
          <AdminNavbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Page Content - Full width */}
        <main className="flex-1 bg-[#0f1115]">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}