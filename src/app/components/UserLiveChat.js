
'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/app/context/AuthContext';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SPECIFIC_ADMIN_ID = '68e53b9752ef9ea3f4aa5566';
const SPECIFIC_ADMIN_NAME = 'Support Team';

export default function AdminChat({ isOpen, onClose, embedded = false }) {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const endRef = useRef(null);

    // Initialize socket connection when modal opens and user is available
    useEffect(() => {
        if (!user?._id || !isOpen) return;

        console.log('🔄 User: Initializing socket connection...');
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        // Socket event handlers
        newSocket.on('connect', () => {
            console.log('✅ User: Socket Connected');
            setConnectionStatus('connected');
            console.log('👤 User: Registering user:', user._id);
            newSocket.emit('register_user', user._id);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('❌ User: Socket Disconnected:', reason);
            setConnectionStatus('disconnected');
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ User: Connection Error:', error);
            setConnectionStatus('error');
        });

        newSocket.on('registration_confirmed', (data) => {
            console.log('✅ User: Registration Confirmed:', data);
        });

        newSocket.on('receive_message', (msg) => {
            console.log('📩 User: Received message:', msg);
            setMessages(prev => {
                if (prev.find(m => m._id === msg._id)) return prev;
                const newMessages = [...prev, msg];
                return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            });
        });

        newSocket.on('message_error', (error) => {
            console.error('❌ User: Message error:', error);
        });

        setSocket(newSocket);

        // Cleanup function to disconnect socket
        return () => {
            console.log(' User: Cleaning up socket');
            newSocket.disconnect();
        };
    }, [user?._id, isOpen]);

    // Load messages when connection is established and modal is open
    // Load chat messages from API (declare first)
    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get(
                `/api/chat/messages?userId=${user._id}&adminId=${SPECIFIC_ADMIN_ID}`
            );
            setMessages(res.data);
        } catch (error) {
            console.error('❌ User: Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    // Then use it in useEffect
    useEffect(() => {
        if (connectionStatus === 'connected' && user?._id && isOpen) {
            loadMessages();
        }
    }, [connectionStatus, user?._id, isOpen, loadMessages]);


    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message function
    const sendMessage = () => {
        if (!text.trim() || !user || !socket || connectionStatus !== 'connected') {
            console.log('❌ Cannot send message - missing requirements');
            return;
        }

        const msg = {
            senderId: user._id,
            senderName: user.name || 'User',
            senderRole: 'user',
            receiverId: SPECIFIC_ADMIN_ID,
            receiverName: SPECIFIC_ADMIN_NAME,
            text: text.trim()
        };

        // Optimistic UI update
        const tempMsg = {
            ...msg,
            _id: `temp-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);
        setText('');

        // Send message via socket
        socket.emit('send_message', msg);

        // Backup send via HTTP API
        sendMessageViaAPI(msg);
    };

    // Backup message sending via HTTP API
    const sendMessageViaAPI = async (msg) => {
        try {
            await axiosSecure.post('/api/chat/messages', msg);
        } catch (error) {
            console.error('❌ API send failed:', error);
        }
    };

    // Handle Enter key press for sending messages
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Refresh messages manually
    const refreshMessages = async () => {
        await loadMessages();
    };

    // Close modal when clicking on backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Don't render if modal is closed
    if (!isOpen) return null;
    // AdminChat component for embedded mode
    if (embedded) {
        return (
            <div className="flex flex-col h-full">
                {/* Connection Status Bar for embedded mode */}
                <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/30 flex items-center justify-between">
                    <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                        <span className="text-xs font-medium capitalize">{connectionStatus}</span>
                    </div>
                    <button
                        onClick={refreshMessages}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                        Refresh
                    </button>
                </div>

                {/* Messages Area - Fixed height */}
                <div className="flex-1 overflow-y-auto p-4"
                    style={{
                        height: '300px', // Fixed height
                        maxHeight: '300px'
                    }}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <p className="text-gray-400 text-xs">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-white">Start a conversation</h3>
                                <p className="text-gray-400 text-xs">
                                    Send your first message to our support team
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((message) => {
                                const isMine = message.senderId === user._id;
                                const isTemp = message._id.startsWith('temp-');
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] px-3 py-2 rounded-xl text-xs shadow-lg transition-all duration-200 break-words ${isMine
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-blue-500/25'
                                                : 'bg-gray-700/80 text-white rounded-bl-none shadow-gray-700/25'
                                                } ${isTemp ? 'opacity-70 border border-dashed border-yellow-400/50' : ''}`}
                                        >
                                            <div className="whitespace-pre-wrap break-words overflow-hidden">
                                                {message.text}
                                            </div>
                                            <div className={`mt-1 flex justify-between items-center text-xs ${isMine ? 'text-blue-100/80' : 'text-gray-400'
                                                }`}>
                                                <span className="flex-shrink-0">
                                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="ml-2 font-medium flex-shrink-0">
                                                    {isMine ? 'You' : 'Support'}
                                                    {isTemp && ' • Sending...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={endRef} />
                        </div>
                    )}
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="flex-1 min-w-0">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 resize-none transition-all duration-200 text-sm"
                                placeholder="Type your message..."
                                rows="1"
                                disabled={connectionStatus !== 'connected'}
                                style={{
                                    minHeight: '45px',
                                    maxHeight: '100px',
                                }}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!text.trim() || connectionStatus !== 'connected'}
                            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 font-semibold flex items-center space-x-1 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:items-end p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            {/* Modal Container */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl  w-full max-w-lg h-[500px] flex flex-col">

                {/* Modal Header with Close Button */}
                <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-red-900/35 to-orange-800/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-bold text-white truncate">Live Support</h2>
                            <p className="text-gray-400 text-xs truncate">We're here to help you!</p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                        title="Close chat"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Connection Status Bar */}
                <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/30 flex items-center justify-between">
                    <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                        <span className="text-xs font-medium capitalize">{connectionStatus}</span>
                    </div>
                    <button
                        onClick={refreshMessages}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                        Refresh
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <p className="text-gray-400 text-xs">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-white">Start a conversation</h3>
                                <p className="text-gray-400 text-xs">
                                    Send your first message to our support team
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((message) => {
                                const isMine = message.senderId === user._id;
                                const isTemp = message._id.startsWith('temp-');
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] px-3 py-2 rounded-xl text-xs shadow-lg transition-all duration-200 break-words ${isMine
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-blue-500/25'
                                                    : 'bg-gray-700/80 text-white rounded-bl-none shadow-gray-700/25'
                                                } ${isTemp ? 'opacity-70 border border-dashed border-yellow-400/50' : ''}`}
                                        >
                                            <div className="whitespace-pre-wrap break-words overflow-hidden">
                                                {message.text}
                                            </div>
                                            <div className={`mt-1 flex justify-between items-center text-xs ${isMine ? 'text-blue-100/80' : 'text-gray-400'
                                                }`}>
                                                <span className="flex-shrink-0">
                                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="ml-2 font-medium flex-shrink-0">
                                                    {isMine ? 'You' : 'Support'}
                                                    {isTemp && ' • Sending...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={endRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-white/5 to-white/2">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="flex-1 min-w-0">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-400 resize-none transition-all duration-200 text-xs break-words overflow-hidden"
                                placeholder="Type your message..."
                                rows="1"
                                disabled={connectionStatus !== 'connected'}
                                style={{
                                    minHeight: '40px',
                                    maxHeight: '80px',
                                    overflowWrap: 'break-word'
                                }}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!text.trim() || connectionStatus !== 'connected'}
                            className="px-3 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 font-semibold flex items-center space-x-1 shadow-lg disabled:cursor-not-allowed disabled:opacity-50 text-xs flex-shrink-0"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {/* Connection Warning */}
                    {connectionStatus !== 'connected' && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                            <p className="text-red-400 text-xs text-center flex items-center justify-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="truncate">Disconnected - Messages may not be delivered</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}