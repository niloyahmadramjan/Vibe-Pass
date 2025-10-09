"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiStar,
  FiGift,
  FiAward,
  FiShield,
  FiTrendingUp,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function LoyaltyRewards() {
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const handleJoinProgram = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      router.push("/my-rewards");
    }, 1500);
  };

  const loyaltyFeatures = [
    {
      icon: FiStar,
      title: "Earn Points",
      description:
        "Collect points for every booking and climb the reward tiers.",
      color: "from-yellow-400 to-orange-400",
      bgColor: "from-yellow-400/10 to-orange-400/10",
      points: "+100 pts",
    },
    {
      icon: FiGift,
      title: "Free Tickets",
      description: "Redeem your points for free movie tickets or merch.",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-500/10 to-pink-500/10",
      points: "500 pts",
    },
    {
      icon: FiAward,
      title: "Exclusive Perks",
      description: "Get early access to screenings and member-only events.",
      color: "from-blue-500 to-cyan-400",
      bgColor: "from-blue-500/10 to-cyan-400/10",
      points: "VIP Access",
    },
    {
      icon: FiShield,
      title: "VIP Status",
      description: "Unlock premium privileges and concierge-style support.",
      color: "from-green-500 to-lime-400",
      bgColor: "from-green-500/10 to-lime-400/10",
      points: "Elite Tier",
    },
  ];

  const programStats = [
    { icon: FiUsers, end: 100, suffix: "+", label: "Active Members" },
    { icon: FiGift, end: 50, suffix: "+", label: "Rewards Redeemed" },
    { icon: FiTrendingUp, end: 200, suffix: "+", label: "Points Earned" },
    { icon: FiClock, end: 24, suffix: "/7", label: "Access Anytime" },
  ];

  return (
    <div className="min-h-screen py-20 px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-red-600 to-rose-600 shadow-lg shadow-red-500/30">
            <FiAward className="text-5xl" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Loyalty &{" "}
            <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Rewards
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Earn points every time you enjoy a movie. Unlock free tickets, VIP
            perks, and exclusive experiences crafted for true cinema lovers.
          </p>
        </motion.div>

        {/* ===== PROGRAM DETAILS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-3xl p-10 shadow-2xl shadow-red-600/10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-xl">
                <FiTrendingUp className="text-4xl" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold">
                  Cinema Rewards Program
                </h2>
                <p className="text-gray-400 mt-1 text-lg">
                  Collect points and unlock premium benefits.
                </p>
              </div>
            </div>

            <button
              onClick={handleJoinProgram}
              disabled={isJoining}
              className="btn-primary w-full sm:w-full md:w-auto lg:w-auto"
            >
              {isJoining ? (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Joining...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">
                  Join Rewards Program 🎁
                </span>
              )}
            </button>
          </div>

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {programStats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white/5 rounded-2xl border border-white/10 p-8 transition-all hover:border-red-500/40"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-600 shadow-md">
                  <stat.icon className="text-2xl" />
                </div>
                <h3 className="text-3xl font-bold">
                  <CountUp
                    end={stat.end}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                    enableScrollSpy
                  />
                </h3>
                <p className="text-gray-400 text-lg mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== FEATURES GRID ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {loyaltyFeatures.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-gradient-to-br ${feature.bgColor} rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-red-500/10`}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-6`}
              >
                <feature.icon className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                {feature.description}
              </p>
              <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium">
                {feature.points}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== FOOTER ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-10 border-t border-white/10"
        >
          <p className="text-xl text-gray-300">
            <span className="text-red-500 font-semibold">
              Start earning rewards
            </span>{" "}
            with your next movie booking 🎬
          </p>
          <p className="text-gray-500 mt-2">
            Instant points • No hidden fees • Redeem anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
