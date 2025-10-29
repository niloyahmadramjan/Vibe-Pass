'use client'
import { useState, useEffect } from 'react'
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiUser,
  FiFilm,
  FiCalendar,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiMail,
  FiMoreVertical,
} from 'react-icons/fi'
import Swal from 'sweetalert2'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'

const AdminRefundDashboard = () => {
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [refundAmount, setRefundAmount] = useState(0)

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRefunds, setTotalRefunds] = useState(0)

  // Fetch refunds
  const fetchRefunds = async () => {
    try {
      setLoading(true)
      const { data } = await axiosSecure.get(
        `/api/refund/requests?page=${currentPage}&limit=${itemsPerPage}&status=${statusFilter === 'all' ? '' : statusFilter}`
      )
      setRefunds(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalRefunds(data.pagination?.totalRefunds || 0)
    } catch (error) {
      console.error('Error fetching refunds:', error)
      Swal.fire('Error!', 'Failed to load refund requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRefunds()
  }, [currentPage, statusFilter])

  // Filter refunds based on search
  const filteredRefunds = refunds.filter(refund =>
    refund.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.refundId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Status counts
  const statusCounts = {
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    rejected: refunds.filter(r => r.status === 'rejected').length,
    processed: refunds.filter(r => r.status === 'processed').length,
    cancelled: refunds.filter(r => r.status === 'cancelled').length,
  }

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund)
    setShowDetailsModal(true)
  }

  const handleAction = (refund, type) => {
    setSelectedRefund(refund)
    setActionType(type)
    setAdminNotes('')
    setRefundAmount(refund.amount)
    setShowActionModal(true)
  }

  const submitAction = async () => {
    if ((actionType === 'rejected' || actionType === 'approved') && !adminNotes.trim()) {
      Swal.fire('Warning!', 'Please provide admin notes for this action.', 'warning')
      return
    }

    try {
      const response = await axiosSecure.put(`/api/refund/${selectedRefund._id}/status`, {
        status: actionType,
        adminNotes: adminNotes.trim(),
        refundAmount: actionType === 'processed' ? refundAmount : selectedRefund.amount
      })

      if (response.data.success) {
        Swal.fire('Success!', response.data.message, 'success')
        setShowActionModal(false)
        fetchRefunds() // Refresh data
      }
    } catch (error) {
      console.error('Error updating refund status:', error)
      Swal.fire('Error!', 'Failed to update refund status', 'error')
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center space-x-1'
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case 'approved':
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`
      case 'rejected':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      case 'processed':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      case 'cancelled':
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock size={14} />
      case 'approved':
        return <FiCheckCircle size={14} />
      case 'rejected':
        return <FiXCircle size={14} />
      case 'processed':
        return <FiDollarSign size={14} />
      case 'cancelled':
        return <FiXCircle size={14} />
      default:
        return <FiClock size={14} />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    const headers = ['Refund ID', 'User', 'Email', 'Movie', 'Amount', 'Status', 'Request Date']
    const csvData = refunds.map(refund => [
      refund._id,
      refund.userName,
      refund.userEmail,
      refund.movieTitle,
      refund.amount,
      refund.status,
      formatDate(refund.createdAt)
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `refund-requests-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Pagination controls
  const nextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1)
  const prevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1)

  if (loading && refunds.length === 0) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Refund Requests</h1>
          <p className="text-gray-400">Manage and process customer refund requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Total Requests</div>
            <div className="text-2xl font-bold text-white">{totalRefunds}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-yellow-500/30">
            <div className="text-yellow-400 text-sm mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-blue-500/30">
            <div className="text-blue-400 text-sm mb-1">Approved</div>
            <div className="text-2xl font-bold text-blue-400">{statusCounts.approved}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-red-500/30">
            <div className="text-red-400 text-sm mb-1">Rejected</div>
            <div className="text-2xl font-bold text-red-400">{statusCounts.rejected}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-green-500/30">
            <div className="text-green-400 text-sm mb-1">Processed</div>
            <div className="text-2xl font-bold text-green-400">{statusCounts.processed}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by user, email, movie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80 bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processed">Processed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={fetchRefunds}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <FiRefreshCw size={18} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <FiDownload size={18} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    User & Movie
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredRefunds.map((refund) => (
                  <tr key={refund._id} className="hover:bg-gray-700/30 transition-all duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {refund.userName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate">
                            {refund.userName}
                          </div>
                          <div className="text-gray-400 text-sm truncate">
                            {refund.userEmail}
                          </div>
                          <div className="text-gray-400 text-xs truncate mt-1">
                            {refund.movieTitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-green-400 font-semibold">
                        ৳{refund.amount}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(refund.status)}>
                        {getStatusIcon(refund.status)}
                        <span>{refund.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      {formatDate(refund.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-2">
                        {/* View Details */}
                        <button
                          onClick={() => handleViewDetails(refund)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400 transition-all duration-200"
                          title="View Details"
                        >
                          <FiEye className="text-blue-400" size={18} />
                        </button>

                        {/* Action Buttons based on status */}
                        {refund.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(refund, 'approved')}
                              className="p-2 rounded-lg hover:bg-green-500/20 border border-green-500/30 hover:border-green-400 transition-all duration-200"
                              title="Approve Refund"
                            >
                              <FiCheckCircle className="text-green-400" size={18} />
                            </button>
                            <button
                              onClick={() => handleAction(refund, 'rejected')}
                              className="p-2 rounded-lg hover:bg-red-500/20 border border-red-500/30 hover:border-red-400 transition-all duration-200"
                              title="Reject Refund"
                            >
                              <FiXCircle className="text-red-400" size={18} />
                            </button>
                          </>
                        )}

                        {refund.status === 'approved' && (
                          <button
                            onClick={() => handleAction(refund, 'processed')}
                            className="p-2 rounded-lg hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 transition-all duration-200"
                            title="Mark as Processed"
                          >
                            <FiDollarSign className="text-purple-400" size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRefunds.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg">No refund requests found</div>
              <div className="text-gray-500 text-sm mt-2">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No refund requests have been submitted yet'}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRefunds)} of {totalRefunds} requests
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-gray-500">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                            currentPage === page
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                              : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    )
                  })}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Refund Details Modal */}
      {showDetailsModal && selectedRefund && (
        <RefundDetailsModal
          refund={selectedRefund}
          onClose={() => setShowDetailsModal(false)}
          getStatusBadge={getStatusBadge}
          getStatusIcon={getStatusIcon}
          formatDate={formatDate}
        />
      )}

      {/* Action Modal */}
      {showActionModal && selectedRefund && (
        <ActionModal
          refund={selectedRefund}
          actionType={actionType}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
          refundAmount={refundAmount}
          setRefundAmount={setRefundAmount}
          onSubmit={submitAction}
          onClose={() => setShowActionModal(false)}
        />
      )}
    </div>
  )
}

// Refund Details Modal Component
const RefundDetailsModal = ({ refund, onClose, getStatusBadge, getStatusIcon, formatDate }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Refund Request Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiXCircle className="text-gray-400 text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User and Movie Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {refund.userName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{refund.userName}</h4>
                  <p className="text-gray-400 text-sm">{refund.userEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FiFilm className="text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Movie</p>
                    <p className="text-white font-medium">{refund.movieTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Theater</p>
                    <p className="text-white font-medium">{refund.theaterName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Show Time</p>
                    <p className="text-white font-medium">{refund.showTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-white font-semibold mb-3">Financial Details</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original Amount:</span>
                    <span className="text-green-400 font-semibold">৳{refund.amount}</span>
                  </div>
                  {refund.refundAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Refund Amount:</span>
                      <span className="text-purple-400 font-semibold">৳{refund.refundAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-white font-mono text-sm">{refund.transactionId}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={getStatusBadge(refund.status)}>
                  {getStatusIcon(refund.status)}
                  <span>Status: {refund.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Seats and Reason */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-semibold mb-3">Selected Seats</h5>
              <div className="flex flex-wrap gap-2">
                {refund.selectedSeats?.map((seat, index) => (
                  <span key={index} className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-3">Refund Reason</h5>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-300">{refund.reason}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h5 className="text-white font-semibold mb-3">Request Timeline</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Request Submitted:</span>
                <span className="text-white">{formatDate(refund.createdAt)}</span>
              </div>
              {refund.processedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processed At:</span>
                  <span className="text-white">{formatDate(refund.processedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          {refund.adminNotes && (
            <div>
              <h5 className="text-white font-semibold mb-3">Admin Notes</h5>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300">{refund.adminNotes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Action Modal Component
const ActionModal = ({ refund, actionType, adminNotes, setAdminNotes, refundAmount, setRefundAmount, onSubmit, onClose }) => {
  const actionConfig = {
    approved: {
      title: 'Approve Refund Request',
      color: 'green',
      icon: FiCheckCircle,
      description: 'This will approve the refund request and notify the user.',
      noteRequired: true
    },
    rejected: {
      title: 'Reject Refund Request',
      color: 'red',
      icon: FiXCircle,
      description: 'This will reject the refund request. Please provide a reason.',
      noteRequired: true
    },
    processed: {
      title: 'Mark as Processed',
      color: 'purple',
      icon: FiDollarSign,
      description: 'Mark this refund as processed and notify the user.',
      noteRequired: false
    }
  }

  const config = actionConfig[actionType]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700/50 shadow-2xl">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${config.color}-500/20 border border-${config.color}-500/30`}>
              <config.icon className={`text-${config.color}-400`} size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{config.title}</h3>
              <p className="text-gray-400 text-sm">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Refund Details */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white">{refund.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Movie:</span>
                <span className="text-white">{refund.movieTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-green-400">৳{refund.amount}</span>
              </div>
            </div>
          </div>

          {/* Refund Amount Input (for processed status) */}
          {actionType === 'processed' && (
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Refund Amount
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                min="0"
                max={refund.amount}
                step="0.01"
              />
              <p className="text-gray-500 text-xs mt-1">
                Original amount: ৳{refund.amount}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          {(config.noteRequired || actionType === 'processed') && (
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Admin Notes {config.noteRequired && '*'}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter notes for the user..."
                className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                required={config.noteRequired}
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700/50 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={config.noteRequired && !adminNotes.trim()}
            className={`flex-1 bg-${config.color}-600 hover:bg-${config.color}-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminRefundDashboard