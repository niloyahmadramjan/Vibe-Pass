"use client";
import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import {
  FaShieldAlt,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaSpinner,
  FaInfoCircle,
  FaCalendarAlt,
  FaFingerprint,
  FaStar,
  FaBolt,
} from "react-icons/fa";

export default function PaymentForm({ session }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [balance, setBalance] = useState(session.balance);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [cardBrand, setCardBrand] = useState("");

  // ✅ Create PaymentIntent on load
  useEffect(() => {
    fetch("http://localhost:5000/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: session.registrationFee * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else throw new Error(data.error || "Failed to initialize payment");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Payment Initialization Failed",
          text: err.message,
          background: "#1f2937",
          color: "white",
        });
      });
  }, [session]);

  // ✅ Handle card element changes with brand detection
  const handleCardChange = (field) => (event) => {
    setCardComplete((prev) => ({
      ...prev,
      [field]: event.complete,
    }));

    if (field === "cardNumber" && event.brand) {
      setCardBrand(event.brand);
    }
  };

  // ✅ Handle Payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    if (
      !cardComplete.cardNumber ||
      !cardComplete.cardExpiry ||
      !cardComplete.cardCvc
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Card Details",
        text: "Please fill in all card information correctly.",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Confirm Payment - ৳${session.registrationFee}`,
      html: `
        <div class="text-left">
          <p class="mb-2">You're about to pay for:</p>
          <div class="bg-gray-100 p-3 rounded-lg mb-3">
            <strong class="text-gray-900">${session.title}</strong>
          </div>
          <p class="text-sm text-gray-300">This transaction is secure and encrypted.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Pay ৳${session.registrationFee}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      background: "#1f2937",
      color: "white",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: "Customer",
            },
          },
        }
      );

      if (error) {
        throw error;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        setBalance((prev) => prev - session.registrationFee);

        // Save payment to DB
        await fetch("http://localhost:5000/api/save-payment", {
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

        Swal.fire({
          icon: "success",
          title: "🎉 Payment Successful!",
          html: `
            <div class="text-center">
              <div class="text-green-400 text-4xl mb-2">✓</div>
              <div class="text-lg font-semibold mb-1">৳${
                session.registrationFee
              } Paid</div>
              <div class="text-gray-300">${session.title}</div>
              <div class="mt-3 text-sm text-gray-400">Transaction ID: ${paymentIntent.id.slice(
                -8
              )}</div>
            </div>
          `,
          timer: 4000,
          showConfirmButton: false,
          background: "#1f2937",
          color: "white",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "white",
      });
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid =
    cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc;

  // Card brand icons
  const getCardBrandIcon = () => {
    const brands = {
      visa: "VISA",
      mastercard: "MC",
      amex: "AMEX",
      discover: "DISC",
      diners: "DINERS",
      jcb: "JCB",
      unionpay: "UNION",
    };
    return brands[cardBrand] || "CARD";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8 mt-10">
         
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
            Secure Payment
          </h1>
          <p className="text-gray-400 text-lg">Complete your cinema booking</p>
        </div>

        {/* Enhanced Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 transform hover:shadow-2xl transition-all duration-300">
          {/* Progress Header with Gradient */}
          <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-5 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaCreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <FaCheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    Payment Details
                  </div>
                  <div className="text-gray-300 text-sm">
                    Step 2 of 2 • Almost there!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Premium Ticket Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 mb-6 border border-red-200 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500 rounded-full -ml-8 -mb-8 opacity-20"></div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FaStar className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-gray-900 text-lg">
                    VibePass Premium
                  </span>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-red-600 border border-red-200">
                  TICKET
                </div>
              </div>

              <div className="text-center py-3">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ৳{session.registrationFee}
                </div>
                <div className="text-gray-600 text-sm">Registration Fee</div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <FaLock className="h-3 w-3 text-green-500" />
                <span>Secure SSL Encrypted Transaction</span>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                    <FaCreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current Balance</div>
                    <div className="text-xl font-bold text-gray-900">
                      ৳{balance}
                    </div>
                  </div>
                </div>
                {balance >= session.registrationFee ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Sufficient
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Low Balance
                  </div>
                )}
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Card Number with Brand Detection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-gray-700">
                    Card Number
                  </label>
                  {cardBrand && (
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono font-bold text-gray-600">
                      {getCardBrandIcon()}
                    </div>
                  )}
                </div>
                <div
                  className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                    cardComplete.cardNumber
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaCreditCard
                      className={`h-5 w-5 ${
                        cardComplete.cardNumber
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <CardNumberElement
                    onChange={handleCardChange("cardNumber")}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1f2937",
                          fontFamily: "ui-monospace, monospace",
                          fontWeight: "500",
                          "::placeholder": {
                            color: "#9ca3af",
                            fontWeight: "400",
                          },
                        },
                        invalid: {
                          color: "#dc2626",
                        },
                      },
                      placeholder: "4242 4242 4242 4242",
                    }}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Expiry Date
                  </label>
                  <div
                    className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                      cardComplete.cardExpiry
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaCalendarAlt
                        className={`h-4 w-4 ${
                          cardComplete.cardExpiry
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <CardExpiryElement
                      onChange={handleCardChange("cardExpiry")}
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#1f2937",
                            fontFamily: "ui-monospace, monospace",
                            fontWeight: "500",
                            "::placeholder": {
                              color: "#9ca3af",
                            },
                          },
                          invalid: {
                            color: "#dc2626",
                          },
                        },
                        placeholder: "MM/YY",
                      }}
                      className="pl-6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    CVC Code
                  </label>
                  <div
                    className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                      cardComplete.cardCvc
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaFingerprint
                        className={`h-4 w-4 ${
                          cardComplete.cardCvc
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <CardCvcElement
                      onChange={handleCardChange("cardCvc")}
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#1f2937",
                            fontFamily: "ui-monospace, monospace",
                            fontWeight: "500",
                            "::placeholder": {
                              color: "#9ca3af",
                            },
                          },
                          invalid: {
                            color: "#dc2626",
                          },
                        },
                        placeholder: "123",
                      }}
                      className="pl-6"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={
                  !stripe || !clientSecret || processing || !isFormValid
                }
                className={`
                  w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 
                  transform hover:scale-[1.02] active:scale-[0.98] mt-6
                  flex items-center justify-center space-x-3 shadow-lg
                  ${
                    !stripe || !clientSecret || processing || !isFormValid
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl"
                  }
                `}
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin h-6 w-6" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <FaLock className="h-5 w-5" />
                    <span>Pay ৳{session.registrationFee} Now</span>
                    <FaBolt className="h-5 w-5 text-yellow-300" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Enhanced Security Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <FaLock className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    SSL Encrypted
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Secure Payment
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">Powered by Stripe</div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
            <FaLock className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-gray-400">256-bit SSL</div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
            <FaShieldAlt className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xs text-gray-400">PCI DSS</div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
            <FaCheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-gray-400">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}
