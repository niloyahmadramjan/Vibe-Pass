"use client";
import { useState, useRef } from "react";
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
  FiFilm,
  FiPlay,
  FiArrowRight,
} from "react-icons/fi";
import axiosSecure from "../api/axiosHook/useAxiosSecure";
import Swal from "sweetalert2";

function NewsLetter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axiosSecure.post("/api/newsletter/subscribe", {
        email,
      });

      if (response.data.success) {
        // ✅ SweetAlert success popup
        Swal.fire({
          title: "🎉 Subscribed Successfully!",
          text: "Welcome to our cinema family! You'll receive exclusive updates.",
          icon: "success",
          confirmButtonColor: "#ef4444",
          background: "#0f172a",
          color: "#fff",
        });

        // ✅ Reset form and disable button
        setIsSubscribed(true);
        setEmail("");
        setMessage({
          type: "success",
          text: "You're successfully subscribed!",
        });
      } else {
        Swal.fire({
          title: "Already Subscribed!",
          text: "You're already part of our cinema community 🍿",
          icon: "info",
          confirmButtonColor: "#ef4444",
          background: "#0f172a",
          color: "#fff",
        });
        setMessage({
          type: "error",
          text: response.data.message || "Already subscribed",
        });
        setIsSubscribed(true);
      }
    } catch (error) {
      Swal.fire({
        title: "Server Error!",
        text: error.response?.data?.message || "Please try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#0f172a",
        color: "#fff",
      });
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Server error, try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiBell,
      title: "First to Know",
      description:
        "Be the first to hear about new releases and special screenings",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: FiStar,
      title: "Exclusive Deals",
      description: "Get special discounts and offers before anyone else",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      icon: FiShield,
      title: "No Spam",
      description: "Quality content only. Unsubscribe anytime with one click",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: FiFilm,
      title: "Behind the Scenes",
      description: "Access exclusive content and interviews with filmmakers",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  const stats = [
    {
      icon: FiUsers,
      value: "50K+",
      label: "Movie Lovers",
      color: "text-blue-400",
    },
    {
      icon: FiHeart,
      value: "99%",
      label: "Satisfaction",
      color: "text-rose-400",
    },
    { icon: FiClock, value: "24/7", label: "Updates", color: "text-amber-400" },
    {
      icon: FiPlay,
      value: "1K+",
      label: "Screenings",
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-2xl shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-500 hover:scale-105 group">
            <FiMail className="text-white text-2xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Never Miss a{" "}
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent bg-300% animate-gradient">
              Blockbuster
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Join thousands of cinephiles who get exclusive early access to
            ticket sales, special screenings, and behind-the-scenes content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Features */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiStar className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Premium Benefits
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Exclusive member advantages
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`flex items-start space-x-4 p-4 rounded-2xl border ${feature.borderColor} ${feature.bgColor} hover:bg-white/5 transition-all duration-300 hover:transform hover:scale-105`}
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <feature.icon className="text-white text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="sticky top-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-red-500/5 transition-all duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-float">
                  <FiStar className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Subscribe Now
                </h2>
                <p className="text-slate-400 text-base">
                  Join Our Cinema Community
                </p>
              </div>

              <p className="text-slate-300 text-center mb-6 text-sm leading-relaxed">
                Enter your email to unlock premium benefits and be the first to
                experience exclusive cinema content and early ticket access.
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg transition-all duration-300 group-focus-within:text-red-500 group-focus-within:scale-110" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-sm border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-base hover:border-slate-500/50"
                      disabled={loading}
                    />
                  </div>

                  {message.text && (
                    <div
                      className={`p-3 rounded-xl border backdrop-blur-sm animate-fadeIn ${
                        message.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {message.type === "success" ? (
                          <FiCheck className="text-emerald-400 text-base flex-shrink-0" />
                        ) : (
                          <FiAlertCircle className="text-red-400 text-base flex-shrink-0" />
                        )}
                        <span className="font-medium text-sm">
                          {message.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || isSubscribed}
                  className={`w-full group relative overflow-hidden py-4 rounded-2xl font-semibold transition-all duration-500 transform focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-xl 
    ${
      isSubscribed
        ? "bg-gray-700 text-gray-300 cursor-not-allowed"
        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white hover:scale-105 hover:shadow-red-500/20"
    }`}
                >
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-base">Securing Your Spot...</span>
                      </>
                    ) : isSubscribed ? (
                      <span className="text-base">Subscribed ✅</span>
                    ) : (
                      <>
                        <span className="text-base">Subscribe Now</span>
                        <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-600/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <FiShield className="text-emerald-400 text-base" />
                    <span className="text-slate-400 text-xs">Secure</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <FiStar className="text-amber-400 text-base" />
                    <span className="text-slate-400 text-xs">No Spam</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <FiHeart className="text-rose-400 text-base" />
                    <span className="text-slate-400 text-xs">Easy Exit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-slower {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default NewsLetter;
