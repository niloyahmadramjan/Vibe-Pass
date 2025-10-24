"use client";

import React, { useEffect, useState } from "react";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

function RefundPage() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch refund requests
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const res = await axiosSecure.get("/api/ticket");
        const refundRequests = res.data.filter(
          (b) => b.paymentStatus === "refunded_request"
        );
        setRefunds(refundRequests || []);
      } catch (err) {
        console.error("Error fetching refunds:", err);
        toast.error("Failed to load refund requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Confirm refund
  const handleConfirm = async (id) => {
    Swal.fire({
      title: "Confirm Refund?",
      text: "Once confirmed, the user will receive a refund.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/api/ticket/${id}/refund`, {
            paymentStatus: "refunded_confirm",
          });
          toast.success("Refund confirmed successfully");
          setRefunds((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
          console.error(err);
          toast.error("Failed to confirm refund");
        }
      }
    });
  };

  // Reject refund
  const handleReject = async (id) => {
    Swal.fire({
      title: "Reject Refund?",
      text: "Are you sure you want to reject this refund request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/api/ticket/${id}/refund`, {
            paymentStatus: "refund_rejected",
          });
          toast.success("Refund rejected successfully");
          setRefunds((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
          console.error(err);
          toast.error("Failed to reject refund");
        }
      }
    });
  };


  // Pagination
  const totalPages = Math.ceil(refunds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRefunds = refunds.slice(startIndex, startIndex + itemsPerPage);

  if (loading)
    return <div className="p-4 text-center text-gray-300">Loading...</div>;
  if (refunds.length === 0)
    return (
      <div className="p-4 text-center text-gray-300">
        No refund requests found.
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund Requests</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border border-gray-700 rounded-lg">
          <thead className="bg-gray-800 text-gray-300 uppercase text-sm">
            <tr>
              <th className="px-4 py-2 border-b border-gray-700 text-left">
                #
              </th>
              <th className="px-4 py-2 border-b border-gray-700 text-left">
                Movie
              </th>
              <th className="px-4 py-2 border-b border-gray-700 text-left">
                User
              </th>
              <th className="px-4 py-2 border-b border-gray-700 text-left">
                Amount
              </th>
              <th className="px-4 py-2 border-b border-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRefunds.map((r, i) => (
              <tr
                key={r._id}
                className="hover:bg-gray-800 transition duration-150"
              >
                <td className="px-4 py-2 border-b border-gray-700">
                  {startIndex + i + 1}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {r.movieTitle}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {r.userName}
                  <br />
                  <small className="text-gray-400">{r.userEmail}</small>
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  ৳{r.totalAmount}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => handleConfirm(r._id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded flex items-center gap-1"
                    >
                      <FiCheckCircle /> Confirm
                    </button>
                    <button
                      onClick={() => handleReject(r._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded flex items-center gap-1"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-purple-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default RefundPage;
