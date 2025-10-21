'use client'
import React, { useState, useRef, useEffect } from "react";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { useAuth } from "@/app/context/AuthContext";

export default function AiChat({ embedded, isOpen, onClose, showHeader, isMobile, className }) {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    // Load chat history when component opens
    useEffect(() => {
        if (!isOpen || !user?._id) return;

        const fetchChat = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get(`/api/chat/history?userId=${user._id}&email=${user.email}`);
                if (res.data?.messages) {
                    setChat(res.data.messages.map(msg => ({
                        sender: msg.sender,
                        text: msg.text,
                        timestamp: msg.timestamp
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
                setConnectionStatus('error');
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [isOpen, user]);

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!message.trim() || !user?._id || !user?.email) return;

        const userMsg = {
            sender: "user",
            text: message,
            timestamp: new Date().toISOString(),
            _id: `temp-${Date.now()}`
        };

        setChat(prev => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const res = await axiosSecure.post("/api/chat/ai", {
                userMessage: message,
                userId: user._id,
                email: user.email
            });

            const botMsg = {
                sender: "bot",
                text: res.data.reply,
                timestamp: new Date().toISOString(),
                _id: `bot-${Date.now()}`
            };

            setChat(prev => {
                const filtered = prev.filter(msg => msg._id !== userMsg._id);
                return [...filtered, { ...userMsg, _id: `user-${Date.now()}` }, botMsg];
            });
        } catch (err) {
            setChat(prev => {
                const filtered = prev.filter(msg => msg._id !== userMsg._id);
                return [
                    ...filtered,
                    { ...userMsg, _id: `user-${Date.now()}` },
                    {
                        sender: "bot",
                        text: "AI Server not responding yet. Please try again later.",
                        timestamp: new Date().toISOString(),
                        _id: `error-${Date.now()}`
                    }
                ];
            });
            setConnectionStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const refreshMessages = async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            const res = await axiosSecure.get(`/api/chat/history?userId=${user._id}&email=${user.email}`);
            if (res.data?.messages) {
                setChat(res.data.messages.map(msg => ({
                    sender: msg.sender,
                    text: msg.text,
                    timestamp: msg.timestamp,
                    _id: `${msg.sender}-${msg.timestamp}`
                })));
            }
            setConnectionStatus('connected');
        } catch (err) {
            console.error("Failed to refresh chat history:", err);
            setConnectionStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    // Embedded mode for tabbed interface - COMPLETELY FIXED LAYOUT
    if (embedded) {
        return (
            <div className="flex flex-col h-full relative">
                {/* Connection Status Bar */}
                <div className="flex-shrink-0 px-4 py-2 bg-gray-800/50 border-b border-gray-700/30 flex items-center justify-between">
                    <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' :
                        connectionStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                            connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                        <span className="text-xs font-medium capitalize">
                            {connectionStatus === 'connected' ? 'AI Online' :
                                connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
                        </span>
                    </div>
                    <button
                        onClick={refreshMessages}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </div>

                {/* Messages Area - Fixed height with proper scrolling and NO SCROLLBAR */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none]"
                    style={{
                        height: 'calc(100vh - 600px)',
                        maxHeight: '300px',
                        minHeight: '200px'
                    }}
                >
                    {/* Hide scrollbar for Webkit browsers (Chrome, Safari) */}
                    <style jsx>{`
                        .overflow-y-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {loading && chat.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                            <p className="text-gray-400 text-xs">Loading conversation...</p>
                        </div>
                    ) : chat.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-white">Ask me anything!</h3>
                                <p className="text-gray-400 text-xs">
                                    I can help with bookings, movies, shows, and more!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chat.map((msg, index) => {
                                const isMine = msg.sender === "user";
                                const isTemp = msg._id?.startsWith('temp-');

                                return (
                                    <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[85%] px-3 py-4 rounded-xl text-xs shadow-lg transition-all duration-200 break-words ${isMine
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-blue-500/25"
                                                : "bg-gradient-to-r from-gray-500/50 to-gray-600 text-white rounded-bl-none shadow-gray-500/25"
                                                } ${isTemp ? 'opacity-70 border border-dashed border-yellow-400/50' : ''}`}
                                        >
                                            <div className="whitespace-pre-wrap break-words overflow-hidden">
                                                {msg.text}
                                            </div>
                                            <div className={`mt-1 flex justify-between items-center text-xs ${isMine ? "text-blue-100/80" : "text-red-100/80"
                                                }`}>
                                                <span className="flex-shrink-0">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="ml-2 font-medium flex-shrink-0">
                                                    {isMine ? "You" : "VibePass AI"}
                                                    {isTemp && ' • Sending...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/50 to-red-700/50 text-white rounded-bl-none shadow-red-500/25">
                                        <div className="flex items-center space-x-2 text-xs">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                            <span>AI is Writing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area - ALWAYS VISIBLE AT BOTTOM */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="flex-1 min-w-0">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-white placeholder-gray-400 resize-none transition-all duration-200 text-sm"
                                placeholder="Ask me anything about movies, bookings"
                                rows="1"
                                disabled={loading || connectionStatus === 'error'}
                                style={{
                                    minHeight: '45px',
                                    maxHeight: '100px',
                                }}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!message.trim() || loading || connectionStatus === 'error'}
                            className="px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 font-semibold flex items-center space-x-1 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {/* Connection Warning */}
                    {connectionStatus === 'error' && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                            <p className="text-red-400 text-xs text-center flex items-center justify-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="truncate">AI Service Unavailable - Please try again later</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Full modal mode with COMPLETELY FIXED LAYOUT
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:items-end p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            {/* Chat Modal */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-lg h-[500px] flex flex-col relative">

                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-700/50 bg-gradient-to-r from-red-900/35 to-orange-800/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600/30 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-bold text-white truncate">VibePass AI Assistant</h2>
                            <p className="text-gray-400 text-xs truncate">Powered by AI</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-110"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Connection Status Bar */}
                <div className="flex-shrink-0 px-4 py-2 bg-gray-800/50 border-b border-gray-700/30 flex items-center justify-between">
                    <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' :
                        connectionStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                            connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                        <span className="text-xs font-medium capitalize">
                            {connectionStatus === 'connected' ? 'AI Online' :
                                connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
                        </span>
                    </div>
                    <button
                        onClick={refreshMessages}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </div>

                {/* Messages Area - Fixed height with NO SCROLLBAR */}
                <div
                    className="flex-1 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none]"
                    style={{
                        height: '300px',
                        maxHeight: '300px'
                    }}
                >
                    {/* Hide scrollbar for Webkit browsers (Chrome, Safari) */}
                    <style jsx>{`
                        .overflow-y-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {loading && chat.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                            <p className="text-gray-400 text-xs">Loading conversation...</p>
                        </div>
                    ) : chat.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-white">Ask me anything!</h3>
                                <p className="text-gray-400 text-xs">
                                    I can help with bookings, movies, shows, and more!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chat.map((msg, index) => {
                                const isMine = msg.sender === "user";
                                const isTemp = msg._id?.startsWith('temp-');

                                return (
                                    <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[85%] px-3 py-2 text-xs shadow-lg transition-all duration-200 break-words ${isMine
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                                    : "bg-gradient-to-r from-gray-500/50 to-gray-600 text-white"
                                                } ${isTemp ? 'opacity-70 border border-dashed border-yellow-400/50' : ''
                                                }`}
                                            style={{
                                                borderRadius: isMine
                                                    ? '12px 12px 0px 12px' // top-left, top-right, bottom-right, bottom-left
                                                    : '12px 12px 12px 0px'
                                            }}
                                        >
                                            <div className="whitespace-pre-wrap break-words overflow-hidden">
                                                {msg.text}
                                            </div>
                                            <div className={`mt-1 flex justify-between items-center text-xs ${isMine ? "text-blue-100/80" : "text-red-100/80"
                                                }`}>
                                                <span className="flex-shrink-0">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="ml-2 font-medium flex-shrink-0">
                                                    {isMine ? "You" : "VibePass AI"}
                                                    {isTemp && ' • Sending...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/50 to-red-700/50 text-white rounded-bl-none shadow-red-500/25">
                                        <div className="flex items-center space-x-2 text-xs">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                            <span>AI is Writing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area - ALWAYS VISIBLE AT BOTTOM */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700/50 bg-gradient-to-r from-white/5 to-white/2">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="flex-1 min-w-0">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 resize-none transition-all duration-200 text-xs break-words overflow-hidden"
                                placeholder="Ask me anything about movies, bookings, or VibePass..."
                                rows="1"
                                disabled={loading || connectionStatus === 'error'}
                                style={{
                                    minHeight: '40px',
                                    maxHeight: '80px',
                                    overflowWrap: 'break-word'
                                }}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!message.trim() || loading || connectionStatus === 'error'}
                            className="px-3 py-3 bg-gradient-to-r from-red-500 to-red-800/40 hover:from-red-600 hover:to-red-700/20 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 font-semibold flex items-center space-x-1 shadow-lg disabled:cursor-not-allowed disabled:opacity-50 text-xs flex-shrink-0"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {/* Connection Warning */}
                    {connectionStatus === 'error' && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                            <p className="text-red-400 text-xs text-center flex items-center justify-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="truncate">AI Service Unavailable - Please try again later</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}