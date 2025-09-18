'use client';

import React, { useState } from 'react';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-dark)]">

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-[60] text-[var(--color-text-dark)] bg-[var(--color-bg-light)] p-2 rounded-md shadow-lg
                   ${isOpen ? 'hidden' : 'lg:hidden'}`}
      >
        <span className="text-xl font-bold">&#9776;</span> {/* Hamburger Icon */}
      </button>

      {/* Sidebar Container (Responsive) */}
      <aside
        className={`fixed lg:relative z-50 top-0 left-0 w-64 h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-light)] p-4
                   transform transition-transform duration-300 ease-in-out
                   lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   lg:flex-shrink-0 lg:shadow-xl`}
      >
        {/* Close button for mobile sidebar */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-[var(--color-text-light)] lg:hidden"
        >
          <span className="text-xl font-bold">&#10005;</span> {/* Close Icon */}
        </button>

        <h2 className="text-2xl font-bold mb-8 text-center border-b border-[var(--color-primary)] pb-4">
          Admin Panel
        </h2>
        <ul className="space-y-4">
          <li>
            <a
              href="/admin"
              onClick={toggleSidebar}
              className="block p-3 rounded-lg hover:bg-[var(--color-primary-hover)] hover:!text-black transition-colors"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/admin/movies"
              onClick={toggleSidebar}
              className="block p-3 rounded-lg hover:bg-[var(--color-primary-hover)] hover:!text-black transition-colors"
            >
              Movies
            </a>
          </li>
          <li>
            <a
              href="/admin/bookings"
              onClick={toggleSidebar}
              className="block p-3 rounded-lg hover:bg-[var(--color-primary-hover)] hover:!text-black transition-colors"
            >
              Bookings
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              onClick={toggleSidebar}
              className="block p-3 rounded-lg hover:bg-[var(--color-primary-hover)] hover:!text-black transition-colors"
            >
              Users
            </a>
          </li>
          <li>
            <a
              href="/admin/reports"
              onClick={toggleSidebar}
              className="block p-3 rounded-lg hover:bg-[var(--color-primary-hover)] hover:!text-black transition-colors"
            >
              Reports
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
