// components/ChatIcon.js
'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import AdminChat from './UserLiveChat'
import AiChat from './AiChat'

export default function ChatIcon() {
    const [showChatPanel, setShowChatPanel] = useState(false)
    const [activeTab, setActiveTab] = useState('ai') // 'ai' or 'admin'
    const [isMobile, setIsMobile] = useState(false)
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const chatRef = useRef(null)

    // Check if current page is home page
    const isHomePage = pathname === '/'

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    const handleChatClick = () => {
        if (!user) {
            router.push('/login')
            return
        }
        setShowChatPanel(true)
        setActiveTab('ai')
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }

    const closeChatPanel = () => {
        setShowChatPanel(false)
    }

    const handleClose = () => {
        setShowChatPanel(false)
    }

    // Close when clicking outside (for both mobile and desktop)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showChatPanel && chatRef.current && !chatRef.current.contains(event.target)) {
                // Check if click is not on the chat icon
                const chatIcon = document.querySelector('[data-chat-icon]')
                if (!chatIcon?.contains(event.target)) {
                    setShowChatPanel(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showChatPanel])

    // Don't render anything if not on home page
    if (!isHomePage) {
        return null
    }

    return (
        <>
            {/* Floating Chat Icon */}
            {!showChatPanel && (
                <div
                    data-chat-icon
                    className={`fixed z-40 ${isMobile ? 'right-4 bottom-4' : 'right-6 bottom-6'}`}
                >
                    <button
                        onClick={handleChatClick}
                        className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white/20`}
                    >
                        <svg
                            className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white transform transition-transform duration-300 group-hover:scale-110`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>

                        {/* Ping Animation */}
                        <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 right-0 border border-white"></div>
                        </div>
                    </button>
                </div>
            )}

            {/* Chat Panel - Similar to your first example */}
            {showChatPanel && (
                <div
                    className={`fixed z-50 ${isMobile
                        ? 'inset-0 flex items-end justify-center px-4 pt-4  bg-black/50'
                        : 'inset-0 flex items-end justify-end p-4 bg-black/50 md:justify-end'
                        }`}
                    onClick={handleClose} // Close when clicking backdrop
                >
                    <div
                        ref={chatRef}
                        className={`bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl flex flex-col ${isMobile
                                ? 'w-full h-full max-h-[80vh] rounded-2xl '
                                : 'w-full max-w-lg h-[550px]'
                            }`}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Chat Header with Tabs - Exactly like your first example */}
                        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900 broder-t-xl">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'ai'
                                            ? 'bg-gradient-to-br from-red-500 to-red-600'
                                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                        }`}>
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {activeTab === 'ai' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            )}
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">
                                            {activeTab === 'ai' ? 'VibePass AI Assistant' : 'Live Support'}
                                        </h2>
                                        <p className="text-gray-400 text-xs">
                                            {activeTab === 'ai' ? 'Powered by Gemini AI' : "We're here to help you!"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-110"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Tab Buttons */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleTabClick('admin')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'admin'
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Admin Chat</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleTabClick('ai')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'ai'
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <span>AI Chat</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 min-h-0">
                            {activeTab === 'ai' ? (
                                <AiChat
                                    isOpen={true}
                                    onClose={handleClose}
                                    embedded={true}
                                    className="h-full"
                                />
                            ) : (
                                <AdminChat
                                    isOpen={true}
                                    onClose={handleClose}
                                    embedded={true}
                                    className="h-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}