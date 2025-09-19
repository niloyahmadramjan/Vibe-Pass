// Profile.jsx

'use client'

import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { userProfileData } from './mockData'
import LoadingSpinner from '../hooks/LoadingSpiner'
import Image from 'next/image'

// Mock API call
const fetchUserProfileData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userProfileData)
    }, 500)
  })
}

const ProfilePage = () => {
  const [userData, setUserData] = useState(null)
  const [showModal, setShowModal] = useState(null) // controls which modal to show

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserProfileData()
      setUserData(data)
    }
    loadUserData()
  }, [])

  // ========================= HANDLER FUNCTIONS =========================

  const handleUpdateMobile = () => {
    setShowModal('updateMobile')
    // TODO: connect with backend (Express + MongoDB)
  }

  const handleVerifyEmail = () => {
    setShowModal('verifyEmail')
    // TODO: send verification email via backend
  }

  const handleEditProfile = () => {
    setShowModal('editProfile')
    // TODO: update profile info in MongoDB
  }

  const handleEditPreferences = () => {
    setShowModal('editPreferences')
    // TODO: save preferences to backend
  }

  const handleChangePin = () => {
    setShowModal('changePin')
    // TODO: update PIN securely in backend
  }

  const handleDeleteAccount = () => {
    setShowModal('deleteAccount')
    // TODO: call DELETE API for user account
  }

  const handleContactSupport = () => {
    setShowModal('contactSupport')
    // TODO: open support chat or send request to backend
  }

  // ========================= LOADING STATE =========================
  if (!userData) {
    return <LoadingSpinner />
  }

  return (
    <div className="text-[var(--color-text-light)] min-h-screen pt-16 max-w-7xl mx-auto">
      <div className="container mx-auto p-4 md:p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* ======================= Left Sidebar ======================= */}
          <div className="md:col-span-1 bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[var(--color-primary)]">
              <Image
                src={userData.profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,..."
                width={600} 
                height={800} 
              />
            </div>

            <h1 className="text-xl font-bold mb-1 text-[var(--color-text-light)]">
              {userData.name}
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              {userData.welcomeMessage}
            </p>

            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg shadow-inner">
              <QRCode value={userData.qrCodeValue} size={128} />
            </div>
            <p className="text-gray-300 mt-3 text-sm w-50">
              Present this code at the counter to collect and redeem more
              MovieMoney!
            </p>
          </div>

          {/* ======================= Right Content Area ======================= */}
          <div className="md:col-span-2 space-y-6 lg:space-y-8">
            {/* Contact Info */}
            <div className="bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-light)]">
                Contact Info
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Use either your mobile no. or email address as your account ID
                to sign in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Mobile No.
                  </span>
                  <div className="flex justify-between items-center">
                    <p className="text-[var(--color-text-light)] font-medium">
                      {userData.contact.mobile}
                    </p>
                    <button
                      onClick={handleUpdateMobile}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Email Address
                  </span>
                  <div className="flex justify-between items-center">
                    <p className="text-[var(--color-text-light)] font-medium">
                      {userData.contact.email}
                    </p>
                    <button
                      onClick={handleVerifyEmail}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-light)]">
                  Profile Info
                </h2>
                <button
                  onClick={handleEditProfile}
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                {Object.entries(userData.profileInfo).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="text-[var(--color-text-light)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-light)]">
                  Communication Preferences
                </h2>
                <button
                  onClick={handleEditPreferences}
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">
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
                  <span className="text-[var(--color-text-light)]">
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
                  <span className="text-[var(--color-text-light)]">
                    Surveys and feedback requests
                  </span>
                </label>
              </div>
            </div>

            {/* Account & Security */}
            <div className="bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-light)]">
                Account & Security
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="font-medium text-[var(--color-text-light)]">
                    PIN
                  </span>
                  <button
                    onClick={handleChangePin}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                  >
                    CHANGE PIN
                  </button>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="font-medium text-[var(--color-text-light)]">
                    MOVIECLUB ACCOUNT
                  </span>
                  <button
                    onClick={handleDeleteAccount}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                  >
                    DELETE ACCOUNT
                  </button>
                </div>
                <div className="col-span-full pt-4">
                  <button
                    onClick={handleContactSupport}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                  >
                    NEED HELP? CONTACT US
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ======================= End Right Content ======================= */}
        </div>
      </div>

      {/* ======================= Simple Modal (Reusable) ======================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-light)] rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {showModal.replace(/([A-Z])/g, ' $1')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              This is a placeholder modal for <b>{showModal}</b> functionality.
              {/* TODO: Replace with form or API connection */}
            </p>
            <button
              onClick={() => setShowModal(null)}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
