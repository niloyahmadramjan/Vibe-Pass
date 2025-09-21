"use client";

import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import Swal from "sweetalert2";

export default function PaymentForm({ session }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create PaymentIntent when component loads
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: session.registrationFee * 100 }), // Stripe uses cents
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error(err));
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    const cardElement = elements.getElement(CardNumberElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardElement },
      }
    );

    if (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
      });
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setSuccess("Payment successful!");
      setProcessing(false);

      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `You have paid ৳${session.registrationFee} for ${session.title}`,
        timer: 3000,
        showConfirmButton: false,
      });

      // Optional: save payment info to DB
     await fetch("http://localhost:3000/save-payment", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         transactionId: paymentIntent.id,
         amount: paymentIntent.amount,
         status: paymentIntent.status,
         sessionId: session._id,
         sessionTitle: session.title,
       }),
     });

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header / Logo */}
        <div className="bg-gray-800 p-6 flex justify-center items-center border-b border-gray-700 ">
          <Image
            src="/payment.jpg"
            className="rounded-2xl"
            alt="TGV Logo"
            width={100}
            height={40}
          />
        </div>

        {/* Payment Info */}
        <div className="p-6 text-center text-white space-y-2">
          <h2 className="text-2xl font-bold">Secure Payment</h2>
          <p className="text-gray-300">
            Pay for: <span className="font-semibold">{session.title}</span>
          </p>
          <p className="text-lg font-semibold text-green-400">
            Amount: ৳{session.registrationFee}
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-900">
          {/* Card Number */}
          <div className="border border-gray-700 p-3 rounded-lg bg-gray-800">
            <label className="text-sm text-gray-300">Card Number</label>
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    letterSpacing: "2px",
                  },
                  invalid: { color: "#f87171" },
                },
              }}
            />
          </div>

          {/* Expiry + CVC */}
          <div className="flex gap-3">
            <div className="flex-1 border border-gray-700 p-3 rounded-lg bg-gray-800">
              <label className="text-sm text-gray-300">Expiry</label>
              <CardExpiryElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: "#fff" },
                    invalid: { color: "#f87171" },
                  },
                }}
              />
            </div>
            <div className="flex-1 border border-gray-700 p-3 rounded-lg bg-gray-800">
              <label className="text-sm text-gray-300">CVC</label>
              <CardCvcElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: "#fff" },
                    invalid: { color: "#f87171" },
                  },
                }}
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="w-full py-3 btn-primary rounded-xl font-semibold text-white transition disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : `Pay ৳${session.registrationFee}`}
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-700">
          🔒 Your payment is secure and encrypted with Stripe.
        </div>
      </div>
    </div>
  );
}
