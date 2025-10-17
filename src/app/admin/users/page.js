'use client'
import React, { useState, useMemo } from 'react'
import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiCalendar,
  FiCheck,
  FiX,
  FiDownload,
  FiUser,
  FiDollarSign,
  FiStar,
  FiShield,
  FiUserCheck,
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import StatCard from '../components/StartCard'
import Image from 'next/image'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'  // ✅ must be this exact lin
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLoading from '../components/AdminLoading'

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // TanStack Query for users
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorData
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/auth')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // TanStack Query for bookings
  const {
    data: bookings = [],
    isLoading: bookingsLoading
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/ticket')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }) => {
      const response = await axiosSecure.put(`/api/auth/${userId}`, updates)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('✅ User updated successfully')
      setEditModalOpen(false)
    },
    onError: (error) => {
      console.error('Error updating user:', error)
      toast.error(error.response?.data?.message || 'Failed to update user')
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosSecure.delete(`/api/auth/${userId}`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('🗑️ User deleted successfully')
      setDeleteModalOpen(false)
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    },
  })

  // Calculate user stats
  const userStats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.emailVerified).length
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newUsers = users.filter(
      (user) => new Date(user.createdAt) > oneWeekAgo
    ).length
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    )
    const adminUsers = users.filter(user => user.role === 'admin').length

    return { totalUsers, activeUsers, newUsers, totalRevenue, adminUsers }
  }, [users, bookings])

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = [...users]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter === 'verified') {
      filtered = filtered.filter((user) => user.emailVerified)
    } else if (statusFilter === 'unverified') {
      filtered = filtered.filter((user) => !user.emailVerified)
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    return filtered
  }, [users, searchTerm, statusFilter, roleFilter])

  // Get user booking stats
  // Get user booking stats - FIXED VERSION
  const getUserStats = (userEmail) => {
    const userBookings = bookings.filter((b) => b.userEmail === userEmail);
    const totalBookings = userBookings.length;
    const totalSpent = userBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    // Status breakdown
    const confirmedBookings = userBookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = userBookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = userBookings.filter(b => b.status === 'cancelled').length;
    const completedBookings = userBookings.filter(b => b.status === 'completed').length;

    return {
      totalBookings,
      totalSpent,
      completedBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      avgSpendingPerBooking: totalBookings > 0 ? (totalSpent / totalBookings).toFixed(2) : 0
    };
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const updateUser = async (userId, updates) => {
    updateUserMutation.mutate({ userId, updates })
  }

  const deleteUser = async () => {
    if (!selectedUser) return
    deleteUserMutation.mutate(selectedUser._id)
  }

  // import jsPDF from 'jspdf';
  // import 'jspdf-autotable';

  const exportUsers = () => {
    try {
      const exportData = filteredUsers.length ? filteredUsers : users;

      if (!exportData.length) {
        toast.error('No users available to export');
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });

      doc.setFontSize(18);
      doc.text('User Export Report', 40, 40);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60);

      const tableColumn = [
        'Name',
        'Email',
        'Phone',
        'Role',
        'Verified',
        'Created At',
        'Total Bookings',
        'Total Spent',
        'Confirmed',
        'Pending',
        'Cancelled',
        'Avg Spending'
      ];

      const tableRows = exportData.map((user) => {
        const stats = getUserStats(user.email); // ✅ Email দিয়ে match

        return [
          user.name || 'N/A',
          user.email || 'N/A',
          user.phone || 'N/A',
          user.role || 'N/A',
          user.emailVerified ? 'Verified ✅' : 'Unverified ❌',
          new Date(user.createdAt).toLocaleDateString(),
          stats.totalBookings,
          `$${stats.totalSpent.toLocaleString()}`,
          stats.confirmedBookings,
          stats.pendingBookings,
          stats.cancelledBookings,
          `$${stats.avgSpendingPerBooking}`
        ];
      });

      // ✅ Correct way to call autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        styles: { fontSize: 9, cellPadding: 5 },
        headStyles: {
          fillColor: [60, 141, 188],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 40, right: 40 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ?? pageSize.getHeight();
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            pageHeight - 10
          );
        },
      });

      doc.save(`users_export_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('✅ PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('❌ Failed to export users');
    }
  };



  const loading = usersLoading || bookingsLoading

  if (loading) {
    return <AdminLoading />
  }

  if (usersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Users</h2>
          <p className="text-gray-400">{usersErrorData?.message || 'Failed to load users'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          User Management
        </h1>
        <p className="text-gray-400">
          Manage all VibePass users and their activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
        <StatCard
          title="Admin Users"
          value={userStats.adminUsers}
          subtitle="Administrators"
          icon={<FiShield />}
          color="from-indigo-500 to-purple-500"
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
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiDownload size={18} />
            All user
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1b1e2b] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Bookings
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Spent
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Join Date
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user, index) => {
                const stats = getUserStats(user.email); // ✅ Email দিয়ে match করবে
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
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">
                            ID: {user._id?.slice(-8) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <FiMail className="text-blue-400 text-sm" />
                          <span className="text-white text-sm">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiUser className="text-green-400 text-sm" />
                          <span className="text-gray-400 text-sm">
                            {user.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.emailVerified
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                      >
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

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <FiShield className="mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <FiUser className="mr-1" />
                            User
                          </>
                        )}
                      </span>
                    </td>

                    {/* Bookings - Enhanced */}
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">
                          {stats.totalBookings}
                        </p>

                      </div>
                    </td>

                    {/* Spent - Enhanced */}
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">
                          ${stats.totalSpent.toLocaleString()}
                        </p>
                        <div className="text-gray-400 text-xs mt-1">
                          {stats.totalBookings > 0 ? (
                            <>
                              <span>Avg: ${stats.avgSpendingPerBooking}</span>
                              <br />
                              {/* <span>Bookings: {stats.totalBookings}</span> */}
                            </>
                          ) : (
                            <span>No bookings</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="text-purple-400" />
                        <span className="text-gray-400 text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
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
              <p className="text-gray-500 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setEditModalOpen(false)}
          onSave={updateUser}
          loading={updateUserMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <DeleteConfirmationModal
          user={selectedUser}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={deleteUser}
          loading={deleteUserMutation.isPending}
        />
      )}
    </div>
  )
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'user',
    emailVerified: user.emailVerified || false,
    phoneVerified: user.phoneVerified || false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(user._id, formData)
  }

  const toggleRole = () => {
    setFormData(prev => ({
      ...prev,
      role: prev.role === 'admin' ? 'user' : 'admin'
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1b1e2b] rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">Edit User</h2>
          <p className="text-gray-400 mb-6">Update user information and role</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
              <div>
                <p className="text-white font-medium">User Role</p>
                <p className="text-gray-400 text-sm">
                  Current: <span className="capitalize">{formData.role}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={toggleRole}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.role === 'admin'
                  ? 'bg-purple-600'
                  : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.role === 'admin' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.emailVerified}
                onChange={(e) =>
                  setFormData({ ...formData, emailVerified: e.target.checked })
                }
                className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              <label className="text-sm text-gray-400">Email Verified</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.phoneVerified}
                onChange={(e) =>
                  setFormData({ ...formData, phoneVerified: e.target.checked })
                }
                className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              <label className="text-sm text-gray-400">Phone Verified</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ user, onClose, onConfirm, loading }) {
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
              Are you sure you want to delete <strong>{user.name}</strong>? This
              action cannot be undone.
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Delete User
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}