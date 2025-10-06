"use client";

export default function BookingTable({ booking }) {
  return (
    <div className="min-h-screen p-8 font-[Inter] text-white flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[var(--color-bg-dark)] rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b border-gray-700 text-center">
          🎟️ Booking Information
        </h2>
        <table className="w-full text-left border-collapse">
          <tbody>
            {/* Booking ID */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold w-1/3">Booking ID</td>
              <td className="p-4">{booking._id}</td>
            </tr>

            {/* Movie Title */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Movie Title</td>
              <td className="p-4">{booking.movieTitle}</td>
            </tr>

            {/* Theater Name */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Theater</td>
              <td className="p-4">{booking.theaterName}</td>
            </tr>

            {/* Show Info */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Show</td>
              <td className="p-4">
                {booking.showDate?.slice(0, 10)} — {booking.showTime} (
                {booking.screen})
              </td>
            </tr>

            {/* Seats */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Seats</td>
              <td className="p-4">{booking.selectedSeats.join(", ")}</td>
            </tr>

            {/* Amount */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Amount</td>
              <td className="p-4 font-bold text-[var(--color-primary)]">
                ৳{booking.totalAmount}
              </td>
            </tr>

            {/* User */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Booked By</td>
              <td className="p-4">
                {booking.userName} <br />
                <span className="text-gray-400">{booking.userEmail}</span>
              </td>
            </tr>

            {/* Status */}
            <tr className="border-b border-gray-700">
              <td className="p-4 font-semibold">Status</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    booking.status === "paid" ? "bg-green-600" : "bg-yellow-600"
                  }`}
                >
                  {booking.status}
                </span>
                <span className="ml-2 text-gray-400 text-sm">
                  (Payment: {booking.paymentStatus})
                </span>
              </td>
            </tr>

            {/* Created At */}
            <tr>
              <td className="p-4 font-semibold">Created At</td>
              <td className="p-4">
                {new Date(booking.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
