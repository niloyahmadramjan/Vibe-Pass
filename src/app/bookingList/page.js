"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import LoadingSpinner from "@/app/hooks/LoadingSpiner";
import jsPDF from "jspdf";
import { FiMoreHorizontal } from "react-icons/fi";
import Link from "next/link";

const UserBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        const fetchBookings = async () => {
            try {
                const res = await axiosSecure.get(
                    `/api/ticket/my-bookings?email=${user?.email}`
                );
                setBookings(res.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

   

  




//   pdf

    const handleDownloadPDF = (booking) => {
        const doc = new jsPDF("p", "mm", "a4");

        // 🎨 Colors
        const bgColor = [0, 0, 0];       // Black background
        const textColor = [255, 255, 255]; // White text
        const accentColor = [231, 76, 60]; // Red accent

        // 🔹 Full Page Background
        doc.setFillColor(...bgColor);
        doc.rect(0, 0, 210, 297, "F");

        // 🔹 Header Banner
        doc.setFillColor(...accentColor);
        doc.rect(0, 0, 210, 35, "F");

        doc.setTextColor(...textColor);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("VibePass", 15, 23);

        doc.setFontSize(12);
        doc.text("Your Movie Booking Ticket", 195, 23, { align: "right" });

        // 🔹 Booking Info Title
        doc.setFontSize(16);
        doc.setTextColor(...accentColor);
        doc.text("Booking Information", 15, 55);

        // Divider Line
        doc.setDrawColor(...accentColor);
        doc.line(15, 60, 195, 60);

        // Booking + User Details
        doc.setFontSize(12);
        doc.setTextColor(...textColor);

        let y = 75;
        const lineGap = 14;

        const addField = (label, value) => {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...accentColor);
            doc.text(label, 20, y);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(...textColor);
            doc.text(String(value), 75, y);

            y += lineGap;
        };

        // 🔹 Add fields
        addField("Booking ID:", booking._id);
        addField("Movie:", booking.movieTitle);
        addField("Theater:", booking.theaterName);
        addField("Screen:", booking.screen);
        addField("Date:", new Date(booking.showDate).toLocaleDateString());
        addField("Time:", booking.showTime);
        addField("Seats:", booking.selectedSeats.join(", "));
        addField("Total:", `$${booking.totalAmount}`);
        addField("Status:", booking.status);
        addField("Payment:", booking.paymentStatus || "Unpaid");

        // 🔹 User Info Section
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(...accentColor);
        doc.text("User Information", 15, y);
        y += 8;

        doc.setDrawColor(...accentColor);
        doc.line(15, y, 195, y);
        y += 15;

        addField("Name:", booking.userName);

        addField("Email:", booking.userEmail);

        // 🔹 Footer
        doc.setDrawColor(100, 100, 100);
        // doc.line(15, 260, 195, 260);

        doc.setFontSize(11);
        doc.setTextColor(200, 200, 200);
        doc.text(
            "Thank you for booking with VibePass. Please present this ticket at the theater.",
            105,
            272,
            { align: "center" }
        );

        doc.setFontSize(10);
        doc.text("https://vibe-pass.vercel.app/", 105, 280, { align: "center" });

        // ✅ Save PDF
        doc.save(`VibePass_Ticket_${booking._id}.pdf`);
    };





    const handleAction1 = () => alert("Action 1 clicked!");
    const handleAction2 = () => alert("Action 2 clicked!");

    if (loading) return <LoadingSpinner />;

    return (
        <div className="p-6 max-w-7xl mx-auto  min-h-screen text-gray-200 py-20">
            <h2 className="text-2xl font-bold mb-4">
                My Bookings ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
                <div className="bg-[#1b1e2b] p-6 rounded-lg shadow-md text-center border border-gray-700">
                    <h3 className="text-lg font-semibold mb-2 text-center">No Bookings Yet</h3>
                    <p className="mb-4">
                        You haven’t booked any movies yet. Browse and book your favorite movies!
                    </p>
                    <Link
                        href="/movies"
                        className="mt-auto flex-1 px-4 py-2 bg-red-600 hover:bg-red-800 !text-white  text-sm font-semibold rounded-lg shadow-md transition"
                    >
                        Go to Movies
                    </Link>
                </div>
            ) : (
                <>
                    {/* ✅ Card view for Mobile + Tablet */}
                    <div className="block lg:hidden space-y-4">
                        {bookings.map((b, idx) => (
                            <motion.div
                                key={b._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02 }} // small lift on hover
                                whileTap={{ scale: 0.98 }}   // shrink on click
                                className="bg-[#1b1e2b] p-4 rounded-lg border border-gray-700 
             shadow-md hover:shadow-xl hover:shadow-red-500/40 
             hover:border-red-500 transition-all duration-300 cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold mb-2 truncate">
                                    {b.movieTitle}
                                </h3>
                                <p><span className="font-semibold">Theater:</span> {b.theaterName}</p>
                                <p><span className="font-semibold">Date:</span> {new Date(b.showDate).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Time:</span> {b.showTime}</p>
                                <p><span className="font-semibold">Seats:</span> {b.selectedSeats.join(", ")}</p>
                                <p><span className="font-semibold">Total:</span> ${b.totalAmount}</p>

                                {/* 🎯 Status badge */}
                                <p className="mb-2">
                                    <span className="font-semibold ">Status: </span>
                                    <span
                                        className={`px-3  py-1 text-sm font-semibold rounded-full ${b.status === "Active"
                                                ? "bg-green-700 text-green-100"
                                                : "bg-gray-600 text-gray-200"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </p>

                                {/* 🎯 Payment badge */}
                                <p>
                                    <span className="font-semibold ">Payment: </span>
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${b.paymentStatus === "paid"
                                                ? "bg-blue-600 text-blue-100"
                                                : "bg-red-600 text-red-100"
                                            }`}
                                    >
                                        {b.paymentStatus || "unpaid"}
                                    </span>
                                </p>

                                {/* Actions */}
                                <div className="relative mt-3">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === b._id ? null : b._id)}
                                        className="p-2 hover:bg-gray-700 rounded w-full text-left flex items-center justify-between"
                                    >
                                        Actions <FiMoreHorizontal />

                                    </button>

                                    {openMenu === b._id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-[#1b1e2b] border border-gray-600 rounded-lg shadow-lg z-10">
                                            <button
                                                onClick={() => handleDownloadPDF(b)}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                            >
                                                Download PDF
                                            </button>
                                            <button
                                                onClick={handleAction1}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                            >
                                                Action 1
                                            </button>
                                            <button
                                                onClick={handleAction2}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                            >
                                                Action 2
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ✅ Table view for Desktop */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
                            <thead className="bg-[#1b1e2b] text-gray-400">
                                <tr>
                                    <th className="p-3 text-left">Movie</th>
                                    <th>Theater</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Seats</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b, idx) => (
                                    <motion.tr
                                        key={b._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className="border-t border-gray-700 hover:bg-[#1b1e2b]"
                                    >
                                        <td className="p-3 truncate">{b.movieTitle}</td>
                                        <td>{b.theaterName}</td>
                                        <td>{new Date(b.showDate).toLocaleDateString()}</td>
                                        <td>{b.showTime}</td>
                                        <td>{b.selectedSeats.join(", ")}</td>
                                        <td>${b.totalAmount}</td>

                                        {/* 🎯 Status Badge */}
                                        <td>
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-full ${b.status === "Active"
                                                        ? "bg-green-700 text-green-100"
                                                        : "bg-gray-600 text-gray-200"
                                                    }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>

                                        {/* 🎯 Payment Badge */}
                                        <td>
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-full ${b.paymentStatus === "paid"
                                                        ? "bg-blue-600 text-blue-100"
                                                        : "bg-red-600 text-red-100"
                                                    }`}
                                            >
                                                {b.paymentStatus || "unpaid"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="relative p-3">
                                            <button
                                                onClick={() =>
                                                    setOpenMenu(openMenu === b._id ? null : b._id)
                                                }
                                                className="p-2 hover:bg-gray-700 rounded"
                                            >
                                                <FiMoreHorizontal/>

                                            </button>

                                            {openMenu === b._id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-[#1b1e2b] border border-gray-600 rounded-lg shadow-lg z-10">
                                                    <button
                                                        onClick={() => handleDownloadPDF(b)}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                                    >
                                                        Download PDF
                                                    </button>
                                                    <button
                                                        onClick={handleAction1}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                                    >
                                                        Action 1
                                                    </button>
                                                    <button
                                                        onClick={handleAction2}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                                    >
                                                        Action 2
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>





    );
};

export default UserBookings;
