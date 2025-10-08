"use client";
import { useState } from "react";
import {
  FiMail,
  FiCheck,
  FiAlertCircle,
  FiBell,
  FiStar,
  FiShield,
  FiUsers,
  FiHeart,
  FiClock,
} from "react-icons/fi";

function NewsLetter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    setTimeout(() => {
      setMessage({
        type: "success",
        text: "Welcome to our cinema family! You'll receive exclusive updates.",
      });
      setEmail("");
      setLoading(false);
    }, 1500);
  };

  const features = [
    {
      icon: FiBell,
      title: "First to Know",
      description:
        "Be the first to hear about new releases and special screenings",
    },
    {
      icon: FiStar,
      title: "Exclusive Deals",
      description: "Get special discounts and offers before anyone else",
    },
    {
      icon: FiShield,
      title: "No Spam",
      description: "Quality content only. Unsubscribe anytime with one click",
    },
  ];

  const stats = [
    { icon: FiUsers, value: "50K+", label: "Movie Lovers" },
    { icon: FiHeart, value: "99%", label: "Satisfaction" },
    { icon: FiClock, value: "24/7", label: "Updates" },
  ];

  return (
    <div className="min-h-screen  py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#D32F2F] to-[#F44336] rounded-3xl mb-8 shadow-2xl shadow-red-500/20">
            <FiMail className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Never Miss a{" "}
            <span className="bg-gradient-to-r from-[#D32F2F] via-[#F44336] to-[#FF6B6B] bg-clip-text text-transparent">
              Blockbuster
            </span>
          </h1>
          <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">
            Join thousands of movie lovers who get exclusive early access to
            ticket sales, special screenings, and behind-the-scenes content
            delivered straight to their inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Features */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A1E1E] rounded-3xl p-8 border border-[#D32F2F]/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8">
                Why Join Our Newsletter?
              </h2>

              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#D32F2F] to-[#F44336] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-[#B0B0B0] text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>

          {/* Right Column - Newsletter Form */}
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A1E1E] rounded-3xl p-8 border border-[#D32F2F]/20 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#D32F2F] to-[#F44336] rounded-2xl flex items-center justify-center shadow-lg">
                  <FiStar className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Join the Cinema Club
                  </h2>
                  <p className="text-[#B0B0B0] text-lg">Become an Insider</p>
                </div>
              </div>
              <p className="text-[#B0B0B0] text-lg">
                Enter your email below and be part of our exclusive movie
                community. Get ready for an unparalleled cinema experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B0B0B0] text-xl transition-colors duration-300 group-focus-within:text-[#D32F2F]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your best email address..."
                    className="w-full pl-12 pr-4 py-4 bg-[#0A0A0A] border-2 border-[#B0B0B0]/20 rounded-2xl text-white placeholder-[#B0B0B0] focus:outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-[#D32F2F]/20 transition-all duration-300 text-lg backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>

                {/* Message Display */}
                {message.text && (
                  <div
                    className={`p-4 rounded-2xl border-2 backdrop-blur-sm ${
                      message.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    } animate-fadeIn`}
                  >
                    <div className="flex items-center space-x-3">
                      {message.type === "success" ? (
                        <FiCheck className="text-green-400 text-xl flex-shrink-0" />
                      ) : (
                        <FiAlertCircle className="text-red-400 text-xl flex-shrink-0" />
                      )}
                      <span className="font-medium text-lg">
                        {message.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden py-4 bg-gradient-to-r from-[#D32F2F] to-[#F44336] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#D32F2F]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
              >
                <div className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg">Securing Your Spot...</span>
                    </div>
                  ) : (
                    <span className="text-lg">Subscribe 🎬</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-[#B0B0B0]/20">
              <div className="flex items-center justify-center space-x-8 text-[#B0B0B0] text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <FiShield className="text-green-400" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiStar className="text-[#FFD700]" />
                  <span>No Spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default NewsLetter;
