// components/ChatIcon.js
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminChat from './UserLiveChat'
import AiChat from './AiChat'

export default function ChatIcon() {
    const [showChatPanel, setShowChatPanel] = useState(false)
    const [activeTab, setActiveTab] = useState('ai') // 'ai' or 'admin'
    const [isMobile, setIsMobile] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

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

    const handleCloseButtonClick = () => {
        setShowChatPanel(false)
    }

    // Close panel when clicking outside (for mobile)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showChatPanel && isMobile) {
                const chatPanel = document.querySelector('[data-chat-panel]')
                const chatIcon = document.querySelector('[data-chat-icon]')

                if (chatPanel &&
                    !chatPanel.contains(event.target) &&
                    !chatIcon?.contains(event.target)) {
                    setShowChatPanel(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showChatPanel, isMobile])

    return (
        <>
            {/* Floating Chat Icon - Hide when chat panel is open */}
            {!showChatPanel && (
                <div
                    data-chat-icon
                    className={`fixed z-50 ${isMobile ? 'right-4 bottom-4' : 'right-6 bottom-6'}`}
                >
                    <button
                        onClick={handleChatClick}
                        className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
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
                            <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 right-0"></div>
                        </div>
                    </button>
                </div>
            )}

            {/* Chat Panel - Show when chat is open */}
            {showChatPanel && (
                <div
                    data-chat-panel
                    className={`fixed z-50 ${isMobile
                        ? 'inset-0 m-0 rounded-none'
                        : 'right-6 bottom-6'
                        }`}
                >
                    <div className={`
                        ${isMobile
                            ? 'w-full h-[600px] pt-16 rounded-none'
                            : 'w-[500px] h-[570px] rounded-2xl'
                        } bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl flex flex-col
                    `}>
                        {/* Header with Close Button */}
                        <div className="flex-shrink-0 p-4 border-b border-gray-700/50 bg-gradient-to-r from-white/5 to-white/2 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center ${activeTab === 'ai'
                                    ? 'from-red-500 to-red-600'
                                    : 'from-blue-500 to-blue-600'
                                    }`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {activeTab === 'ai' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        )}
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>
                                        {activeTab === 'ai' ? 'VibePass AI Assistant' : 'Live Support'}
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        {activeTab === 'ai' ? 'Powered by Gemini AI' : "We're here to help you!"}
                                    </p>
                                </div>
                            </div>

                            {/* Close Button - Top Right */}
                            <button
                                onClick={handleCloseButtonClick}
                                className={`flex items-center justify-center bg-white/10 hover:bg-red-500/80 text-white rounded-lg transition-all duration-200 hover:scale-110 ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}
                                title="Close chat"
                            >
                                <svg className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex-shrink-0 border-b border-gray-700/50 bg-gradient-to-r from-white/5 to-white/2">
                            <div className="flex">
                                <button
                                    onClick={() => handleTabClick('ai')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === 'ai'
                                        ? 'border-red-500 text-red-400 bg-red-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    AI Chat
                                </button>
                                <button
                                    onClick={() => handleTabClick('admin')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === 'admin'
                                        ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Admin Chat
                                </button>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'ai' ? (
                                <AiChat
                                    embedded={true}
                                    isOpen={true}
                                    onClose={closeChatPanel}
                                    showHeader={false}
                                    isMobile={isMobile}
                                />
                            ) : (
                                <AdminChat
                                    embedded={true}
                                    isOpen={true}
                                    onClose={closeChatPanel}
                                    showHeader={false}
                                    isMobile={isMobile}
                                />
                            )}
                        </div>
                    </div>

                    {/* Mobile Overlay */}
                    {isMobile && (
                        <div
                            className="absolute inset-0 bg-black/50 -z-10"
                            onClick={handleCloseButtonClick}
                        />
                    )}
                </div>
            )}
        </>
    )
}