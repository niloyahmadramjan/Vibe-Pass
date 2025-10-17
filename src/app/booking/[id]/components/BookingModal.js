'use client';

import React, { useState } from 'react';
import { toast } from './Toast';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';

export default function BookingModal({
  movieData,
  selectedDate,
  selectedTime,
  selectedSeats,
  totalPrice,
  onClose,
  onConfirm,
}) {
  // ✅ Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // ✅ Apply Coupon Function
  // const handleApplyCoupon = async () => {
  //   if (!couponCode.trim()) {
  //     toast.error('Please enter a coupon code');
  //     return;
  //   }

  //   setApplyingCoupon(true);

  //   try {
  //     const response = await axiosSecure.post('/api/coupons/apply', {
  //       code: couponCode.toUpperCase(),
  //       totalAmount: totalPrice
  //     });

  //     if (response.data.success) {
  //       setAppliedCoupon(couponCode.toUpperCase());
  //       setDiscount(response.data.discount);
  //       setFinalPrice(response.data.finalAmount);
  //       toast.success(`🎉 Coupon applied! You saved ৳${response.data.discount}`);
  //     }
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.error || 'Invalid coupon code';
  //     toast.error(errorMsg);
  //   } finally {
  //     setApplyingCoupon(false);
  //   }
  // };

  const handleApplyCoupon = async () => {
  if (!couponCode.trim()) {
    toast.error('Please enter a coupon code');
    return;
  }

  setApplyingCoupon(true);

  try {
    const response = await axiosSecure.post('/api/coupons/apply', {
      code: couponCode.trim(), // ✅ Trim added
      totalAmount: totalPrice
    });

    console.log('Coupon response:', response.data); // ✅ Debug log

    if (response.data.success) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      setDiscount(response.data.discount);
      setFinalPrice(response.data.finalAmount);
      toast.success(`🎉 Coupon applied! You saved ৳${response.data.discount}`);
    } else {
      // ✅ Handle success: false case
      toast.error(response.data.error || response.data.message || 'Invalid coupon');
    }
  } catch (error) {
    console.error('Coupon error:', error); // ✅ Debug log
    // ✅ Better error handling
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     'Invalid coupon code';
    toast.error(errorMsg);
  } finally {
    setApplyingCoupon(false);
  }
};





  // ✅ Remove Coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setFinalPrice(totalPrice);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  // ✅ Confirm with Coupon Data
  const handleConfirm = () => {
    onConfirm({
      appliedCoupon,
      discount,
      finalPrice
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-3xl font-bold mb-4 text-center text-red-500">
          Confirm Booking
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Movie:</span>
            <span className="font-bold text-lg text-white">{movieData.title}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Date:</span>
            <span className="font-bold text-lg text-white">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Time:</span>
            <span className="font-bold text-lg text-white">{selectedTime?.time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Seats:</span>
            <span className="font-bold text-lg text-white">{selectedSeats.join(', ')}</span>
          </div>

          {/* ✅ Coupon Section */}
          <div className="pt-4 border-t border-gray-700">
            <label className="block text-gray-400 text-sm mb-2">
              Have a coupon code?
            </label>
            
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
                >
                  {applyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">{appliedCoupon}</span>
                  <span className="text-sm text-gray-400">(-৳{discount})</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-400 hover:text-red-300 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ✅ Price Summary */}
          <div className="pt-4 border-t border-gray-700 space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span>৳{totalPrice}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount:</span>
                <span>-৳{discount}</span>
              </div>
            )}
            
            <div className="flex justify-between text-2xl items-center pt-2 border-t border-gray-700">
              <span className="font-semibold text-red-500">Total:</span>
              <span className="font-bold text-green-400">৳{finalPrice}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              onClose();
              toast.error('Booking cancelled');
            }}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors font-semibold text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 btn-primary font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}