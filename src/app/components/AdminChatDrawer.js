// components/AdminChatDrawer.jsx
'use client'

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;
const SPECIFIC_ADMIN_ID = '68e53b9752ef9ea3f4aa5566';
const SPECIFIC_ADMIN_NAME = 'Support Team';

export default function AdminChatDrawer({ isOpen, onClose }) {
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const endRef = useRef(null);

    // Initialize socket for admin
    useEffect(() => {
        if (!isOpen) return;

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
            loadUsers(); // Refresh users list when new message arrives
        });

        setSocket(newSocket);

        return () => {
            console.log('🧹 Admin: Cleaning up socket');
            newSocket.disconnect();
        };
    }, [isOpen]);

    // Load users when connected
    useEffect(() => {
        if (connectionStatus === 'connected' && isOpen) {
            loadUsers();
        }
    }, [connectionStatus, isOpen]);

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

        // Optimistic update
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

    // Auto scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl w-6xl max-w-xl h-96 flex flex-col transform transition-all duration-300 overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Support Chat</h2>
                            <p className="text-gray-400 text-xs">{selectedUser ? `Chatting with ${selectedUser.name}` : 'Select a user'}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Connection Status */}
                <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/30 flex items-center justify-between">
                    <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                        <span className="text-xs font-medium capitalize">{connectionStatus}</span>
                    </div>
                    <button
                        onClick={loadUsers}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Users Sidebar - Compact */}
                    <div className="w-1/3 border-r border-gray-700/50 bg-gray-800/30 overflow-y-auto scrollbar-hide">
                        {users.length === 0 ? (
                            <div className="text-center p-4">
                                <p className="text-gray-400 text-sm">No active conversations</p>
                            </div>
                        ) : (
                            users.map(user => (
                                <div
                                    key={user._id}
                                    className={`p-3 border-b border-gray-700/30 cursor-pointer transition-all duration-200 ${selectedUser?._id === user._id
                                            ? 'bg-blue-500/10 border-l-2 border-blue-400'
                                            : 'hover:bg-gray-700/40'
                                        }`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
                                                {user.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs min-w-4 text-center">
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

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedUser ? (
                            <>
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="w-12 h-12 bg-gray-700/30 rounded-full flex items-center justify-center mb-3">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400 text-sm">Start a conversation</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {messages.map(message => {
                                                const isMine = message.senderId === SPECIFIC_ADMIN_ID;
                                                const isTemp = message._id.startsWith('temp-');
                                                return (
                                                    <div
                                                        key={message._id}
                                                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-[85%] px-3 py-2 rounded-xl text-xs shadow-lg ${isMine
                                                                    ? 'bg-blue-500 text-white rounded-br-none'
                                                                    : 'bg-gray-700 text-white rounded-bl-none'
                                                                } ${isTemp ? 'opacity-70' : ''}`}
                                                        >
                                                            <div className="whitespace-pre-wrap break-words">
                                                                {message.text}
                                                            </div>
                                                            <div className={`text-xs mt-1 flex justify-between ${isMine ? 'text-blue-100' : 'text-gray-400'
                                                                }`}>
                                                                <span>
                                                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                                <span className="ml-2">
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

                                {/* Input Area */}
                                <div className="p-4 border-t border-gray-700/50">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
                                            placeholder="Type a message..."
                                            disabled={connectionStatus !== 'connected'}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                                            className="px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 font-semibold text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-700/30 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-sm">Select a user to start chatting</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Global scrollbar hiding */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}