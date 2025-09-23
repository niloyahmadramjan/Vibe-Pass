"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; 

export default function ConfirmationPage() {
  const [ticket, setTicket] = useState({
    sessionTitle: "Avenger End Game",
    transactionId: "tx_123456789",
    userName: "John Doe",
    userEmail: "john@example.com",
    amount: 500,
    status: "succeeded",
  });

  return (
    <div className="pt-25 pb-10">
      <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
          🎉 Payment Successful!
        </h1>
        <h2 className="text-xl font-semibold text-center text-blue-700 mb-2">
          {ticket.sessionTitle}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Transaction ID:{" "}
          <span className="font-mono">{ticket.transactionId}</span>
        </p>

        {/* Ticket Details */}
        <div className="bg-gray-100 rounded-lg p-4 text-black mb-6">
          <p>
            <strong>Buyer:</strong> {ticket.userName}
          </p>
          <p>
            <strong>Email:</strong> {ticket.userEmail}
          </p>
          <p>
            <strong>Amount Paid:</strong> ৳{ticket.amount}
          </p>
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
        </div>

        {/* ✅ QR Code */}
        <div className="flex justify-center">
          <QRCodeCanvas value={ticket.transactionId} size={200} />
        </div>

        <p className="text-center text-gray-400 mt-4 text-sm">
          📩 Save this ticket. You’ll need the QR code for validation at entry.
        </p>
      </div>
    </div>
  );
}