// app/admin/chat/page.js
'use client'

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SPECIFIC_ADMIN_ID = '68e53b9752ef9ea3f4aa5566';
const SPECIFIC_ADMIN_NAME = 'Support Team';

export default function AdminChatPage() {
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [isMobile, setIsMobile] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const endRef = useRef(null);

    // Check screen size for mobile view
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowChat(true); // Always show chat on desktop
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Initialize socket for admin
    useEffect(() => {
        console.log('🔄 Admin: Initializing socket connection...');
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('✅ Admin: Socket Connected');
            setConnectionStatus('connected');
            console.log('🛡️ Admin: Registering as:', SPECIFIC_ADMIN_ID);
            newSocket.emit('register_user', SPECIFIC_ADMIN_ID);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('❌ Admin: Socket Disconnected:', reason);
            setConnectionStatus('disconnected');
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Admin: Connection Error:', error);
            setConnectionStatus('error');
        });

        newSocket.on('registration_confirmed', (data) => {
            console.log('✅ Admin: Registration Confirmed:', data);
            loadUsers();
        });

        newSocket.on('receive_message', (msg) => {
            console.log('📩 Admin: Received message:', msg);
            setMessages(prev => {
                if (prev.find(m => m._id === msg._id)) return prev;
                const newMessages = [...prev, msg];
                return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            });
            loadUsers();
        });

        setSocket(newSocket);

        return () => {
            console.log('🧹 Admin: Cleaning up socket');
            newSocket.disconnect();
        };
    }, []);

    // Load users when connected
    useEffect(() => {
        if (connectionStatus === 'connected') {
            loadUsers();
        }
    }, [connectionStatus]);

    const loadUsers = async () => {
        try {
            console.log('👥 Admin: Loading users...');
            const res = await axiosSecure.get('/api/chat/users');
            setUsers(res.data);
        } catch (error) {
            console.error('❌ Admin: Failed to load users:', error);
        }
    };

    const loadMessages = async (userId) => {
        try {
            setLoading(true);
            const res = await axiosSecure.get(
                `/api/chat/messages?userId=${userId}&adminId=${SPECIFIC_ADMIN_ID}`
            );
            setMessages(res.data);

            // On mobile, switch to chat view when user is selected
            if (isMobile) {
                setShowChat(true);
            }
        } catch (error) {
            console.error('❌ Admin: Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedUser || !socket) return;

        const msg = {
            senderId: SPECIFIC_ADMIN_ID,
            senderName: SPECIFIC_ADMIN_NAME,
            senderRole: 'admin',
            receiverId: selectedUser._id,
            receiverName: selectedUser.name,
            text: newMessage.trim()
        };

        const tempMsg = {
            ...msg,
            _id: `temp-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');
        socket.emit('send_message', msg);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        loadMessages(user._id);
    };

    const handleBackToUsers = () => {
        setShowChat(false);
        setSelectedUser(null);
        setMessages([]);
    };

    // Auto scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-full p-4 md:p-6">
            {/* Chat Interface - Full Screen */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] overflow-hidden">
                <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-3 md:p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 md:space-x-3">
                                {/* Back Button for Mobile */}
                                {isMobile && showChat && (
                                    <button
                                        onClick={handleBackToUsers}
                                        className="p-1 md:p-2 text-white hover:bg-white/10 rounded-lg transition-colors mr-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}

                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base md:text-lg font-bold text-white truncate">
                                        {isMobile && showChat
                                            ? selectedUser?.name || 'Chat'
                                            : 'Support Chat'
                                        }
                                    </h2>
                                    <p className="text-gray-400 text-xs truncate">
                                        {isMobile
                                            ? showChat
                                                ? `Chatting with ${selectedUser?.name}`
                                                : 'Select a user to chat'
                                            : selectedUser
                                                ? `Chatting with ${selectedUser.name}`
                                                : 'Select a user to start chatting'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <div className={`flex items-center space-x-1 md:space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                                    <span className="text-xs md:text-sm font-medium capitalize hidden sm:inline">
                                        {connectionStatus}
                                    </span>
                                </div>
                                <button
                                    onClick={loadUsers}
                                    className="px-2 py-1 md:px-3 md:py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs md:text-sm transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Users Sidebar - Hidden on mobile when in chat view */}
                        <div className={`
                            ${isMobile && showChat ? 'hidden' : 'flex'} 
                            md:flex md:w-1/3 
                            border-r border-gray-700 bg-gray-800 
                            overflow-y-auto flex-col w-full
                        `}>
                            {users.length === 0 ? (
                                <div className="text-center p-4">
                                    <p className="text-gray-400 text-sm">No active conversations</p>
                                </div>
                            ) : (
                                users.map(user => (
                                    <div
                                        key={user._id}
                                        className={`p-3 border-b border-gray-700 cursor-pointer transition-all duration-200 ${selectedUser?._id === user._id
                                            ? 'bg-blue-500/10 border-l-2 border-blue-400'
                                            : 'hover:bg-gray-700'
                                            }`}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
                                                    {user.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 md:px-2 md:py-1 text-xs min-w-4 md:min-w-5 text-center">
                                                            {user.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-xs truncate mt-1">
                                                    {user.lastMessageText || 'No messages'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Messages Area - Hidden on mobile when in users view */}
                        <div className={`
                            ${isMobile && !showChat ? 'hidden' : 'flex'} 
                            md:flex md:flex-1 
                            flex-col w-full
                        `}>
                            {selectedUser ? (
                                <>
                                    {/* Mobile User Info Bar */}
                                    {isMobile && (
                                        <div className="p-3 border-b border-gray-700 bg-gray-700/50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold text-white">{selectedUser.name}</h3>
                                                    <p className="text-gray-400 text-xs">Active now</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-1 overflow-y-auto p-3 md:p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-scroll">
                                        {loading ? (
                                            <div className="flex justify-center items-center h-full">
                                                <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-700 rounded-full flex items-center justify-center mb-3 md:mb-4">
                                                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-400 text-sm md:text-base">
                                                    Start a conversation with {selectedUser.name}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 md:space-y-4">
                                                {messages.map(message => {
                                                    const isMine = message.senderId === SPECIFIC_ADMIN_ID;
                                                    const isTemp = message._id.startsWith('temp-');
                                                    return (
                                                        <div
                                                            key={message._id}
                                                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-[85%] md:max-w-[70%] px-3 py-2 md:px-4 md:py-3 rounded-xl ${isMine
                                                                    ? 'bg-blue-500 text-white rounded-br-none md:rounded-br-none'
                                                                    : 'bg-gray-700 text-white rounded-bl-none md:rounded-bl-none'
                                                                    } ${isTemp ? 'opacity-70' : ''}`}
                                                            >
                                                                <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                                                                    {message.text}
                                                                </div>
                                                                <div className={`text-xs mt-1 md:mt-2 flex justify-between ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                                                                    <span>
                                                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                    <span className="ml-2 md:ml-3">
                                                                        {isMine ? 'You' : selectedUser.name}
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

                                    {/* Message Input */}
                                    <div className="p-3 md:p-4 border-t border-gray-700">
                                        <div className="flex gap-2 md:gap-3">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                className="flex-1 p-2 md:p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm md:text-base"
                                                placeholder="Type a message..."
                                                disabled={connectionStatus !== 'connected'}
                                            />
                                            <button
                                                onClick={sendMessage}
                                                disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                                                className="px-3 md:px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 font-semibold text-sm md:text-base disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-400 text-sm md:text-base">
                                            {isMobile
                                                ? 'Select a user to start chatting'
                                                : 'Select a user from the sidebar to start chatting'
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}