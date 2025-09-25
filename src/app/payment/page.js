"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import PaymentForm from "../components/PaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookingData = searchParams.get("booking");

  // Parse booking data from query parameters
  let session = {
    _id: "123",
    title: "VibePass Premium Ticket",
    registrationFee: 500,
    balance: 1000,
  };

  if (bookingData) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(bookingData));
      session = {
        _id: parsedData.bookingId || "123",
        title: parsedData.movieTitle || "VibePass Premium Ticket",
        registrationFee: parsedData.totalAmount || 500,
        balance: parsedData.totalAmount || 1000,
        selectedSeats: parsedData.selectedSeats || [],
        showtime: parsedData.showtime || "",
      };
    } catch (error) {
      console.error("Error parsing booking data:", error);
    }
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="pb-10">
        <PaymentForm session={session} />
      </div>
    </Elements>
  );
}
