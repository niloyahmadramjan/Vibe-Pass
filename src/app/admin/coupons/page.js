'use client';
import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiDollarSign,
  FiUsers, FiClock, FiCheckCircle, FiXCircle, FiCopy, FiEye
} from "react-icons/fi";
import StatCard from "../components/StartCard";
import UniversalTable from "../components/UniversalTable";
import AdminLoading from '../components/AdminLoading';
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const queryClient = useQueryClient();

  const [couponData, setCouponData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minAmount: "",
    expiryDate: "",
    usageLimit: "",
    description: "",
  });

  // ✅ Fetch Coupons (useQuery)
  const { data: couponList = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/coupons");
      setCoupons(res.data);
      setLoading(false);
      return res.data;
    },
    onError: () => {
      toast.error("Failed to load coupons");
    },
  });

  // ✅ Add / Update Coupon 
  const saveCouponMutation = useMutation({
    mutationFn: async () => {
      if (editCoupon) {
        await axiosSecure.put(`/api/coupons/${editCoupon._id}`, couponData);
      } else {
        await axiosSecure.post("/api/coupons/add", couponData);
      }
    },
    onSuccess: () => {
      toast.success(editCoupon ? "🎉 Coupon updated successfully!" : "🎉 Coupon created successfully!");
      queryClient.invalidateQueries(["coupons"]);
      closeModal();
    },
    onError: () => {
      toast.error("❌ Error saving coupon");
    },
  });

  // Delete Coupon 
  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/api/coupons/${id}`);
    },
    onSuccess: () => {
      toast.success("Coupon delete successfully!");

      queryClient.invalidateQueries(["coupons"]);
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong.", "error");
    },
  });

  const fetchCoupons = async () => {

    queryClient.invalidateQueries(["coupons"]);
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditCoupon(coupon);
      setCouponData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minAmount: coupon.minAmount || "",
        expiryDate: coupon.expiryDate?.slice(0, 10) || "",
        usageLimit: coupon.usageLimit || "",
        description: coupon.description || ""
      });
    } else {
      setEditCoupon(null);
      setCouponData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        expiryDate: "",
        usageLimit: "",
        description: ""
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    saveCouponMutation.mutate();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteCouponMutation.mutate(id);
      }
    });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`📋 Copied: ${code}`);
  };

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => new Date(c.expiryDate) >= new Date()).length,
    expiredCoupons: coupons.filter(c => new Date(c.expiryDate) < new Date()).length,
    totalDiscount: coupons.reduce((sum, c) => sum + (c.discountValue || 0), 0)
  };

  if (isLoading || loading) return <AdminLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Coupons Management
            </h1>
            <p className="text-gray-400 text-lg">Create and manage discount coupons for your customers</p>
          </div>
          <button
            onClick={() => openModal()}
            className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            <FiPlus size={20} />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Coupons"
          value={stats.totalCoupons}
          icon={<FiTag />}
          color="from-purple-500 to-pink-500" />
        <StatCard
          title="Active Coupons"
          value={stats.activeCoupons}
          icon={<FiCheckCircle />}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Expired Coupons"
          value={stats.expiredCoupons}
          icon={<FiXCircle />}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Discount"
          value={`$${stats.totalDiscount}`}
          icon={<FiDollarSign />}
          color="from-orange-500 to-red-500"
        />
      </div>



      {/* Content */}
      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
          <FiTag className="mx-auto text-6xl text-gray-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-400 mb-2">No Coupons Found</h3>
          <p className="text-gray-500 mb-6">Create your first coupon to get started</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-colors"
          >
            Create Coupon
          </button>
        </div>
      ) :
        <CouponsTable
          coupons={coupons}
          onEdit={openModal}
          onDelete={handleDelete}
          onCopy={copyToClipboard}
        />
      }

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CouponModal
            couponData={couponData}
            editCoupon={editCoupon}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


function CouponsTable({ coupons, onEdit, onDelete, onCopy }) {
  const columns = [
    {
      header: 'Coupon',
      key: 'code',
      render: (item) => (
        <div>
          <p className="text-white font-semibold">{item.code}</p>
          <p className="text-gray-400 text-sm">{item.description || "No description"}</p>
        </div>
      )
    },
    {
      header: 'Discount',
      key: 'discountValue',
      render: (item) => (
        <span className="text-white font-bold">
          {item.discountType === 'percentage' ? `${item.discountValue}%` : `$${item.discountValue}`}
        </span>
      )
    },
    {
      header: 'Min Amount',
      key: 'minAmount',
      render: (item) => <span className="text-gray-400">${item.minAmount || 0}</span>
    },
    {
      header: 'Expiry',
      key: 'expiryDate',
      type: 'date'
    },
    {
      header: 'Status',
      key: 'expiryDate',
      type: 'status',
      statusConfig: {
        'active': 'bg-green-500/20 text-green-400 border-green-500/30',
        'expired': 'bg-red-500/20 text-red-400 border-red-500/30'
      },
      statusIcons: {
        'active': <FiCheckCircle size={12} />,
        'expired': <FiCalendar size={12} />
      },
      render: (item) => new Date(item.expiryDate) >= new Date() ? 'active' : 'expired'
    }
  ];

  const actions = [
    {
      icon: <FiCopy size={14} />,
      onClick: (item) => onCopy(item.code),
      title: 'Copy Code',
      color: 'blue'
    },
    {
      icon: <FiEdit2 size={14} />,
      onClick: onEdit,
      title: 'Edit Coupon',
      color: 'yellow'
    },
    {
      icon: <FiTrash2 size={14} />,
      onClick: (item) => onDelete(item._id),
      title: 'Delete Coupon',
      color: 'red'
    }
  ];

  return (
    <UniversalTable
      data={coupons}
      columns={columns}
      actions={actions}
      emptyMessage="No coupons found"
      emptyDescription="Create your first coupon to get started"
    />
  );
}

// Modal Component
function CouponModal({ couponData, editCoupon, onChange, onSubmit, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editCoupon ? 'Edit Coupon' : 'Create Coupon'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiXCircle size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Coupon Code *</label>
              <input
                type="text"
                name="code"
                placeholder="SUMMER25"
                value={couponData.code}
                onChange={onChange}
                required
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Coupon description..."
                value={couponData.description}
                onChange={onChange}
                rows="2"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Discount Type</label>
                <select
                  name="discountType"
                  value={couponData.discountType}
                  onChange={onChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Discount Value *</label>
                <input
                  type="number"
                  name="discountValue"
                  placeholder="10"
                  value={couponData.discountValue}
                  onChange={onChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Min. Amount ($)</label>
                <input
                  type="number"
                  name="minAmount"
                  placeholder="50"
                  value={couponData.minAmount}
                  onChange={onChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  placeholder="100"
                  value={couponData.usageLimit}
                  onChange={onChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={couponData.expiryDate}
                onChange={onChange}
                required
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300"
              >
                {editCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}