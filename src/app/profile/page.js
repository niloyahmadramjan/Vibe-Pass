// Profile.jsx

'use client'

import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { userProfileData } from './mockData'

const fetchUserProfileData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userProfileData)
    }, 500)
  })
}

const ProfilePage = () => {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserProfileData()
      setUserData(data)
    }
    loadUserData()
  }, [])

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--color-bg-dark)]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-dark)] min-h-screen">
      <div className="container mx-auto p-4 md:p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* ======================= Left Sidebar ======================= */}
          <div className="md:col-span-1 bg-[var(--color-white)] rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            {/* User Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[var(--color-primary)]">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>

            {/* User Name & Welcome Message */}
            <h1 className="text-xl font-bold mb-1">{userData.name}</h1>
            <p className="text-sm text-gray-500 mb-6">
              {userData.welcomeMessage}
            </p>

            {/* QR Code */}
            <div className="p-4 bg-[var(--color-white)] rounded-lg shadow-inner">
              <QRCode value={userData.qrCodeValue} size={128} />
            </div>
          </div>

          {/* ======================= Right Content Area ======================= */}
          <div className="md:col-span-2 space-y-6 lg:space-y-8">
            {/* Contact Info */}
            <div className="bg-[var(--color-white)] rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Info</h2>
              <p className="text-sm text-gray-500 mb-4">
                Use either your mobile no. or email address as your account ID
                to sign in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    Mobile No.
                  </span>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{userData.contact.mobile}</p>
                    <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                      Update
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    Email Address
                  </span>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{userData.contact.email}</p>
                    <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-[var(--color-white)] rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Profile Info</h2>
                <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                {Object.entries(userData.profileInfo).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-[var(--color-white)] rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Communication Preferences
                </h2>
                <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Choose how you want to hear from us
              </p>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.communication.updates}
                    readOnly
                    className="mr-2 accent-[var(--color-primary)]"
                  />
                  <span>
                    Updates from us, e.g. news, promotions, partner offers
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.communication.surveys}
                    readOnly
                    className="mr-2 accent-[var(--color-primary)]"
                  />
                  <span>Surveys and feedback requests</span>
                </label>
              </div>
            </div>

            {/* Account & Security */}
            <div className="bg-[var(--color-white)] rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Account & Security</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">PIN</span>
                  <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                    CHANGE PIN
                  </button>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">MOVIECLUB ACCOUNT</span>
                  <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                    DELETE ACCOUNT
                  </button>
                </div>
                <div className="col-span-full pt-4">
                  <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium">
                    NEED HELP? CONTACT US
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ======================= End Right Content ======================= */}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
