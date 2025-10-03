'use client';

import React, { useEffect, useState } from 'react';
import {
  FiUsers, FiSearch, FiEdit2, FiTrash2, FiMail,
  FiCalendar, FiCheck, FiX, FiDownload, FiUser,
  FiDollarSign, FiStar
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import AdminLoading from '../components/AdminLoading';
import StatCard from '../components/StartCard';
import Image from 'next/image';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

 useEffect(() => {
   filterUsers()
   calculateStats()
 }, [users, bookings, searchTerm, statusFilter, filterUsers, calculateStats])


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/api/auth');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axiosSecure.get('/api/ticket');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  // calulated user statuse.............................
  const calculateStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.emailVerified).length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsers = users.filter(user => new Date(user.createdAt) > oneWeekAgo).length;

    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    setUserStats({ totalUsers, activeUsers, newUsers, totalRevenue });
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (statusFilter === 'verified') {
      filtered = filtered.filter(user => user.emailVerified);
    } else if (statusFilter === 'unverified') {
      filtered = filtered.filter(user => !user.emailVerified);
    }

    setFilteredUsers(filtered);
  };

  const getUserBookings = (userId) => bookings.filter(b => b.userId === userId);

  const getUserStats = (userId) => {
    const userBookings = getUserBookings(userId);
    const totalBookings = userBookings.length;
    const totalSpent = userBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const completedBookings = userBookings.filter(b => b.status === 'completed').length;
    return { totalBookings, totalSpent, completedBookings };
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const updateUserStatus = async (userId, updates) => {
    toast.success('Not  created api');
    // try {
    //   await axiosSecure.patch(`/api/auth/${userId}`, updates);
    //   toast.success('User updated successfully');
    //   fetchUsers();
    //   setEditModalOpen(false);
    // } catch (error) {
    //   console.error('Error updating user:', error);
    //   toast.error('Failed to update user');
    // }
  };
// delete user..................................................
  const deleteUser = async () => {

    // toast.success('Not created api');
    if (!selectedUser) return;
    try {
      await axiosSecure.delete(`/api/auth/${selectedUser._id}`);
      toast.success('User deleted successfully');
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // pdf downlord

  const exportUsers = () => {


    toast.success('Not add on the time');
  };

  if (loading) {
    return <AdminLoading />
  }




  return (
    <div className="min-h-screen  bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">User Management</h1>
        <p className="text-gray-400">Manage all VibePass users and their activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={userStats.totalUsers}
          subtitle="All registered users"
          icon={<FiUsers />}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Active Users"
          value={userStats.activeUsers}
          subtitle="Email verified users"
          icon={<FiUser />}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="New Users"
          value={userStats.newUsers}
          subtitle="Last 7 days"
          icon={<FiStar />}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${userStats.totalRevenue.toLocaleString()}`}
          subtitle="From all bookings"
          icon={<FiDollarSign />}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 p-6 rounded-xl border border-gray-800 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiDownload size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1b1e2b] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Contact</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Bookings</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Spent</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Join Date</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user, index) => {
                const stats = getUserStats(user._id);
                return (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    {/* User Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={user.image || '/default-avatar.png'}
                          alt={user.name}
                          width={56}   // w-14 = 56px
                          height={72}  // h-18 = 72px
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <FiMail className="text-blue-400 text-sm" />
                          <span className="text-white text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiUser className="text-green-400 text-sm" />
                          <span className="text-gray-400 text-sm">{user.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.emailVerified
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                        {user.emailVerified ? (
                          <>
                            <FiCheck className="mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <FiX className="mr-1" />
                            Unverified
                          </>
                        )}
                      </span>
                    </td>

                    {/* Bookings */}
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <p className="text-white font-bold">{stats.totalBookings}</p>
                        <p className="text-gray-400 text-xs">Total</p>
                      </div>
                    </td>

                    {/* Spent */}
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <p className="text-white font-bold">${stats.totalSpent}</p>
                        <p className="text-gray-400 text-xs">Lifetime</p>
                      </div>
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="text-purple-400" />
                        <span className="text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>



      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setEditModalOpen(false)}
          onSave={updateUserStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <DeleteConfirmationModal
          user={selectedUser}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={deleteUser}
        />
      )}
    </div>
  );


  // Stat Card Component
  // function StatCard({ title, value, subtitle, icon, color }) {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0, y: 20 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg border border-white/10`}
  //     >
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <h2 className="text-white/80 text-sm font-medium">{title}</h2>
  //           <p className="text-2xl font-bold text-white mt-2">{value}</p>
  //           <p className="text-white/60 text-xs mt-1">{subtitle}</p>
  //         </div>
  //         <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
  //           <div className="text-white text-xl">
  //             {icon}
  //           </div>
  //         </div>
  //       </div>
  //     </motion.div>
  //   );
  // }

  // Edit User Modal Component
  function EditUserModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
      name: user.name,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(user._id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1b1e2b] rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2">Edit User</h2>
            <p className="text-gray-400 mb-6">Update user information</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.emailVerified}
                  onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <label className="text-sm text-gray-400">Email Verified</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Delete Confirmation Modal Component
  function DeleteConfirmationModal({ user, onClose, onConfirm }) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1b1e2b] rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
        >
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <FiTrash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete User</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
}