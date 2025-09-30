'use client'

import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import LoadingSpinner from '../hooks/LoadingSpiner'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import axiosSecure from '../api/axiosHook/useAxiosSecure'
import Swal from 'sweetalert2'
import toast, { Toaster } from 'react-hot-toast'

/**
 * ProfilePage Component
 * Displays user profile information and provides options for editing,
 * security, and account management, utilizing modal forms for input.
 */
const ProfilePage = () => {
  // State to control which modal is currently open
  const [showModal, setShowModal] = useState(null)
  // State for loading indicators during async operations
  const [loading, setLoading] = useState(false)
  // State for user data from backend
  const [userData, setUserData] = useState(null)
  const { user } = useAuth()

  // ========================= EFFECT TO FETCH USER DATA =========================

  /**
   * Fetches user data from backend on component mount
   */
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      setLoading(true)
      try {
        const response = await axiosSecure.get('/api/user/info')
        setUserData(response.data)
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        toast.error('Failed to load user data ❌')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // ========================= HANDLER FUNCTIONS (API Calls) =========================

  // Add this to your handler functions section
 

  const handleUpdateImage = async (imageFile) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await axiosSecure.put('/api/user/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUserData((prev) => ({ ...prev, image: response.data.imageUrl }))
      toast.success('Profile image updated successfully ')
    } catch (err) {
      console.error('Image upload failed:', err)
      toast.error('Failed to update profile image ❌')
    } finally {
      setLoading(false)
    }
  }


  /**
   * Updates the user's mobile number.
   * @param {string} newNumber - The new mobile number to set.
   */
  const handleUpdateMobile = async (newNumber) => {
    setLoading(true)
    try {
      await axiosSecure.put('/api/user/number', { number: newNumber })
      // Update local user data
      setUserData((prev) => ({ ...prev, phone: newNumber }))
      toast.success('Mobile updated successfully ')
      setShowModal(null)
    } catch (err) {
      console.error('Mobile update failed:', err)
      toast.error('Failed to update mobile ❌')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Requests a new email verification link.
   */
  const handleVerifyEmail = async () => {
    setLoading(true)
    try {
      await axiosSecure.post('/api/user/verify-email')
      toast.success('Verification email sent ')
      setShowModal(null)
    } catch (err) {
      console.error('Email verification request failed:', err)
      toast.error('Failed to send verification email ')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Updates general user profile information.
   * @param {object} profileData - The data object containing profile fields to update.
   */
  const handleEditProfile = async (profileData) => {
    setLoading(true)
    try {
      await axiosSecure.put('/api/user/profile', profileData)
      // Update local user data
      setUserData((prev) => ({ ...prev, ...profileData }))
      toast.success('Profile updated successfully ')
      setShowModal(null)
    } catch (err) {
      console.error('Profile update failed:', err)
      toast.error('Failed to update profile ')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Updates user communication preferences.
   * @param {object} preferences - The data object containing preference fields (updates, surveys).
   */
  const handleEditPreferences = async (preferences) => {
    setLoading(true)
    try {
      await axiosSecure.put('/api/user/preferences', preferences)
      // Update local user data
      setUserData((prev) => ({ ...prev, ...preferences }))
      toast.success('Preferences updated ')
      setShowModal(null)
    } catch (err) {
      console.error('Preferences update failed:', err)
      toast.error('Failed to update preferences ')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Changes the user's PIN.
   * @param {object} pinData - Object containing oldPin and newPin.
   */
  const handleChangePin = async (pinData) => {
    setLoading(true)
    try {
      await axiosSecure.put('/api/user/pin', pinData)
      toast.success('PIN changed successfully')
      setShowModal(null)
    } catch (err) {
      console.error('PIN change failed:', err)
      toast.error('Failed to change PIN ')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initiates the account deletion process after user confirmation.
   * This function uses Swal for a critical confirmation step.
   */
  const handleDeleteAccount = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone! Your account will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true)
        try {
          await axiosSecure.delete('/api/user/account')
          Swal.fire('Deleted!', 'Your account has been deleted.', 'success')
          // Note: Successful deletion should typically redirect the user to a public page or trigger a global logout
          setShowModal(null)
        } catch (err) {
          console.error('Account deletion failed:', err)
          Swal.fire('Error!', 'Failed to delete account.', 'error')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  /**
   * Sends a support message from the user.
   * @param {string} message - The support message content.
   */
  const handleContactSupport = async (message) => {
    setLoading(true)
    try {
      await axiosSecure.post('/api/user/support', { message })
      toast.success('Support request sent ')
      setShowModal(null)
    } catch (err) {
      console.error('Support request failed:', err)
      toast.error('Failed to contact support ')
    } finally {
      setLoading(false)
    }
  }

  // ========================= UTILITY FUNCTIONS =========================

  /**
   * Helper function to open a specific modal.
   * @param {string} modalType - The string identifier for the modal to open.
   */
  const openModal = (modalType) => {
    setShowModal(modalType)
  }

  // ========================= LOADING STATE =========================
  if (!user || !userData) return <LoadingSpinner />

  // ========================= RENDER =========================
  return (
    <div className="text-[var(--color-text-light)] min-h-screen pt-16 max-w-7xl mx-auto">
      <Toaster />
      <div className="container mx-auto p-4 md:p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* ======================= Left Sidebar (User Card) ======================= */}
          <div className="md:col-span-1 bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[var(--color-primary)]">
                <Image
                  src={userData?.image || '/default-avatar.png'}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  placeholder="empty"
                  width={96}
                  height={96}
                />
              </div>
              {/* Image Upload Button */}
              <button
                onClick={() => openModal('updateImage')}
                className="absolute bottom-2 right-0 bg-[var(--color-primary)] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                title="Change profile picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            <h1 className="text-xl font-bold mb-1 text-[var(--color-textimaght)]">
              {userData.name}
            </h1>
            <p className="text-sm text-gray-400 mb-6">Welcome Back!</p>

            <div className="p-4 bg-white rounded-lg shadow-inner">
              {/* Note: QRCode value should be dynamic, using placeholder as per original */}
              <QRCode value="vibePass-vercel.app" size={132} />
              {/* value={userData.qrCodeValue} */}
            </div>
            <p className="text-gray-300 mt-3 text-sm w-50">
              Present this code at the counter to collect and redeem more
              MovieMoney!
            </p>
          </div>
          {/* ----------------------------------------------------------------------- */}
          {/* ======================= Right Content Area ======================= */}
          <div className="md:col-span-2  space-y-6 lg:space-y-8">
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
                      {userData?.phone || 'Not set'}
                    </p>
                    {/* FIXED: Open modal instead of calling API handler */}
                    <button
                      onClick={() => openModal('updateMobile')}
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
                      {userData?.email}
                    </p>
                    {/* Using userData.isEmailVerified from backend */}
                    {userData?.emailVerified ? (
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      // FIXED: Open modal/call verification if not verified
                      <button
                        onClick={() => openModal('verifyEmail')}
                        className="text-yellow-400 hover:text-yellow-500 text-sm font-medium"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            {/* Note: The styling for this section seems to use different colors (text-white, bg-transparent) 
                than the rest of the dark sections. Keeping original classes. */}
            <div className="p-6 bg-[var(--color-bg-dark)] rounded-lg max-w-3xl text-white">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">PROFILE INFO</h2>
                {/* FIXED: Open modal instead of calling API handler */}
                <button
                  onClick={() => openModal('editProfile')}
                  className="border border-white px-4 py-1 rounded-lg text-sm hover:bg-white hover:text-black transition"
                >
                  EDIT
                </button>
              </div>

              {/* Profile Info Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-sm">
                {/* Name */}
                <div>
                  <p className="uppercase text-gray-400 font-semibold">Name</p>
                  <p className="mt-1">{userData?.name || 'Not set'}</p>
                </div>

                {/* Date of Birth */}
                <div>
                  <p className="uppercase text-gray-400 font-semibold">
                    Date of Birth
                  </p>
                  <p className="mt-1">{userData?.dob || 'Not set'}</p>
                </div>

                {/* State */}
                <div>
                  <p className="uppercase text-gray-400 font-semibold">State</p>
                  <p className="mt-1">{userData?.state || 'Not set'}</p>
                </div>

                {/* District */}
                <div>
                  <p className="uppercase text-gray-400 font-semibold">
                    District
                  </p>
                  <p className="mt-1">{userData?.district || 'Not set'}</p>
                </div>

                {/* Gender */}
                <div>
                  <p className="uppercase text-gray-400 font-semibold">
                    Gender
                  </p>
                  <p className="mt-1">{userData?.gender || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-[var(--color-bg-dark)] rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-light)]">
                  Communication Preferences
                </h2>

                {/* FIXED: Open modal instead of calling API handler */}
                <button
                  onClick={() => openModal('editPreferences')}
                  className="border border-white px-4 py-1 rounded-lg text-sm hover:bg-white hover:text-black transition"
                >
                  EDIT
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Choose how you want to hear from us
              </p>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userData?.updates || false} // Use || false to handle undefined
                    readOnly
                    className="mr-2 accent-[var(--color-primary)]"
                  />
                  <span className="text-[var(--color-text-light)]">
                    Updates from us, e.g. news, promotions, partner offers
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userData?.surveys || false} // Use || false to handle undefined
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
                  {/* FIXED: Open modal instead of calling API handler */}
                  <button
                    onClick={() => openModal('changePin')}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium"
                  >
                    CHANGE PIN
                  </button>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="font-medium text-[var(--color-text-light)]">
                    MOVIECLUB ACCOUNT
                  </span>
                  {/* Note: handleDeleteAccount already includes a Swal confirmation.
                     If you want a modal confirmation, you'd call openModal('deleteAccount')
                     and move the Swal/API logic into the modal's confirmation button.
                     Keeping existing Swal behavior for destructive action. */}
                  <button
                    onClick={handleDeleteAccount}
                    className="text-red-500 hover:text-red-400 text-sm font-medium" // Adjusted color for deletion
                  >
                    DELETE ACCOUNT
                  </button>
                </div>
                <div className="col-span-full pt-4">
                  {/* FIXED: Open modal instead of calling API handler */}
                  <button
                    onClick={() => openModal('contactSupport')}
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

      {/* ======================= Dynamic Modal ======================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-light)] rounded-lg p-6 w-full max-w-sm shadow-xl">
            {/* Title formatting to clean up camelCase into a readable title */}
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {showModal.replace(/([A-Z])/g, ' $1')}
            </h3>

            {/* Render dynamic content based on showModal state */}
            {/* ----------------- Update Mobile Modal ----------------- */}
            {showModal === 'updateMobile' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const newNumber = e.target.number.value
                  handleUpdateMobile(newNumber)
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="number"
                  placeholder="Enter new mobile number"
                  defaultValue={userData?.phone || ''}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="h-5 w-5" /> Updating...
                    </span>
                  ) : (
                    'Update'
                  )}
                </button>
              </form>
            )}

            {/* ----------------- Verify Email Modal ----------------- */}
            {showModal === 'verifyEmail' && (
              <div className="text-sm text-gray-400">
                <p className="mb-4">
                  We'll send a verification link to your email (
                  {userData?.email}). Please check your inbox.
                </p>
                <button
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="h-5 w-5" /> Sending...
                    </span>
                  ) : (
                    'Send Verification Email'
                  )}
                </button>
              </div>
            )}

            {/* ----------------- Edit Profile Modal ----------------- */}
            {showModal === 'editProfile' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const profileData = {
                    name: e.target.name.value,
                    dob: e.target.dob.value,
                    state: e.target.state.value,
                    district: e.target.district.value,
                    gender: e.target.gender.value,
                  }
                  handleEditProfile(profileData)
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  defaultValue={userData?.name || ''}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="date"
                  name="dob"
                  defaultValue={userData?.dob || ''}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  defaultValue={userData?.state || ''}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  defaultValue={userData?.district || ''}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <select
                  name="gender"
                  defaultValue={userData?.gender || ''}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="h-5 w-5" /> Saving...
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
              </form>
            )}

            {/* ----------------- Edit Preferences Modal ----------------- */}
            {showModal === 'editPreferences' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const preferences = {
                    updates: e.target.updates.checked,
                    surveys: e.target.surveys.checked,
                  }
                  handleEditPreferences(preferences)
                }}
                className="space-y-3"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="updates"
                    defaultChecked={userData?.updates || false}
                    className="mr-2 accent-[var(--color-primary)]"
                  />
                  Updates & promotions
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="surveys"
                    defaultChecked={userData?.surveys || false}
                    className="mr-2 accent-[var(--color-primary)]"
                  />
                  Surveys & feedback
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="h-5 w-5" /> Saving...
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
              </form>
            )}

            {/* ----------------- Change Pin Modal ----------------- */}
            {showModal === 'changePin' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const pinData = {
                    oldPin: e.target.oldPin.value,
                    newPin: e.target.newPin.value,
                  }
                  handleChangePin(pinData)
                }}
                className="space-y-3"
              >
                <input
                  type="password"
                  name="oldPin"
                  placeholder="Old PIN"
                  required
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="password"
                  name="newPin"
                  placeholder="New PIN (4 digits)"
                  required
                  minLength={4}
                  maxLength={4}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="h-5 w-5" /> Updating...
                    </span>
                  ) : (
                    'Update PIN'
                  )}
                </button>
              </form>
            )}

            {/* ----------------- Contact Support Modal ----------------- */}
            {showModal === 'contactSupport' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const message = e.target.message.value
                  handleContactSupport(message)
                }}
                className="space-y-3"
              >
                <textarea
                  name="message"
                  placeholder="Describe your issue..."
                  rows={4}
                  required
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="h-5 w-5" /> Sending...
                    </span>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </form>
            )}
            {/* ----------------- Enhanced Update Image Modal ----------------- */}
            {showModal === 'updateImage' && (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--color-primary)]">
                    <img
                      id="imagePreview"
                      src={userData?.image || '/default-avatar.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* File Input */}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      // Preview image
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        document.getElementById('imagePreview').src =
                          e.target.result
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-hover)]"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const fileInput = document.getElementById('imageInput')
                      const file = fileInput.files[0]
                      if (file) {
                        handleUpdateImage(file)
                      } else {
                        toast.error('Please select an image first')
                      }
                    }}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="h-5 w-5" /> Uploading...
                      </span>
                    ) : (
                      'Upload Image'
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Supported formats: JPG, PNG, WEBP. Max size: 5MB
                </p>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setShowModal(null)}
              className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg w-full transition duration-200"
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
