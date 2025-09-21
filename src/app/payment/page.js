"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentPage() {
  const session = {
    _id: "123",
    title: "VibePass Premium Ticket",
    registrationFee: 500,
    balance: 1000,
  };

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm session={session} />
    </Elements>
  );
}
