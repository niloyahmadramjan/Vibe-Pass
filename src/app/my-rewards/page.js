"use client";
import { useState, useEffect } from "react";
import {
  FiClock,
  FiAward,
  FiStar,
  FiZap,
  FiTrendingUp,
  FiShield,
  FiGift,
  FiCheckCircle,
  FiDollarSign,
  FiLock,
  FiInfo,
} from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../hooks/LoadingSpiner";

export default function RewardsPage() {
  const { user } = useAuth();
  const userEmail = user?.email;

  const [rewardData, setRewardData] = useState(null);
  const [timers, setTimers] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [claiming, setClaiming] = useState({
    daily: false,
    weekly: false,
    monthly: false,
  });

  // Fetch reward data
  useEffect(() => {
    if (!userEmail) return;
    const fetchRewardData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rewards/${userEmail}`
        );
        setRewardData(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to load rewards data",
          icon: "error",
          confirmButtonColor: "#6366f1",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRewardData();
  }, [userEmail]);

  // Update cooldown timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (rewardData) {
        setTimers({
          daily: calculateTimeLeft(rewardData, "daily"),
          weekly: calculateTimeLeft(rewardData, "weekly"),
          monthly: calculateTimeLeft(rewardData, "monthly"),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [rewardData]);

  const calculateTimeLeft = (data, type) => {
    if (!data) return 0;
    const now = new Date();
    let lastClaim, cooldown;

    if (type === "daily") {
      lastClaim = data.lastDailyClaim;
      cooldown = 24 * 60 * 60 * 1000;
    } else if (type === "weekly") {
      lastClaim = data.lastWeeklyClaim;
      cooldown = 7 * 24 * 60 * 60 * 1000;
      if ((data.dailyStreak ?? 0) < 7) return Infinity;
    } else if (type === "monthly") {
      lastClaim = data.lastMonthlyClaim;
      cooldown = 30 * 24 * 60 * 60 * 1000;
      if ((data.dailyStreak ?? 0) < 28) return Infinity;
    }

    if (!lastClaim) return 0;
    const diff = new Date(lastClaim).getTime() + cooldown - now.getTime();
    return diff > 0 ? diff : 0;
  };

  const formatTime = (ms) => {
    if (ms === Infinity) return "Locked";
    if (ms <= 0) return "Ready!";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Claim bonus
  const handleClaim = async (type) => {
    setClaiming((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rewards/claim`,
        {
          email: userEmail,
          type,
        }
      );
      setRewardData(res.data.reward);

      Swal.fire({
        title: "Reward Claimed!",
        text: res.data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: "#1f2937",
        color: "white",
      });
    } catch (err) {
      Swal.fire({
        title: "Not Available",
        text: err.response?.data?.message || "Try again later",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        background: "#1f2937",
        color: "white",
      });
    } finally {
      setClaiming((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Redeem points
  const handleRedeem = async (points, tkValue) => {
    const confirmResult = await Swal.fire({
      title: "Redeem Points?",
      html: `Do you want to redeem <strong>${points} points</strong> for <strong class="text-green-400">${tkValue} TK</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, redeem!",
      confirmButtonColor: "#10b981",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#1f2937",
      color: "white",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rewards/redeem`,
        {
          email: userEmail,
          points,
        }
      );
      setRewardData(res.data.reward);
      Swal.fire({
        title: "Success!",
        html: `You've successfully redeemed <strong>${points} points</strong> for <strong class="text-green-400">${tkValue} TK</strong>!`,
        icon: "success",
        confirmButtonColor: "#10b981",
        background: "#1f2937",
        color: "white",
      });
    } catch (err) {
      Swal.fire({
        title: "Cannot Redeem",
        text: err.response?.data?.message || "Try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "white",
      });
    }
  };

  // Redemption options with TK values
  const redemptionOptions = [
    { points: 100, tk: 5 },
    { points: 200, tk: 10 },

    {
      points: 500,
      tk: 25,
    },
  ];

  // Loading skeleton
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!userEmail || !rewardData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl font-light mb-2">
            Unable to load rewards
          </div>
          <div className="text-gray-400">
            Please check your connection and try again
          </div>
        </div>
      </div>
    );

  const rewardCards = [
    {
      type: "daily",
      icon: FiClock,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
      points: "10-50",
      requirement: "Available every 24 hours",
    },
    {
      type: "weekly",
      icon: FiTrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
      points: "100-200",
      requirement: "7+ day streak required",
    },
    {
      type: "monthly",
      icon: FiShield,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
      points: "500-1000",
      requirement: "28+ day streak required",
    },
  ];

  return (
    <div className="min-h-screen  py-8 pt-20 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-800/70 backdrop-blur-xl px-6 py-3 rounded-2xl border border-gray-700 mb-6 shadow-lg">
            <FiGift className="text-purple-400 text-xl" />
            <span className="text-gray-200 font-semibold tracking-wide">
              Loyalty Rewards Program
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Earn & Redeem Rewards
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Collect points, maintain your streak, and unlock exclusive rewards.
            Your dedication deserves recognition!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Points Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Total Points
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-yellow-400">
                    {rewardData.points}
                  </span>
                  <FiStar className="text-yellow-400 text-xl" />
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Available for redemption
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <FiAward className="text-yellow-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Current Streak Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Current Streak
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-400">
                    {rewardData.dailyStreak}
                  </span>
                  <span className="text-gray-400 text-lg">days</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <FiZap className="text-orange-400 text-sm" />
                  <p className="text-gray-400 text-sm">
                    Keep the streak alive!
                  </p>
                </div>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <FiZap className="text-orange-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Total Earnings
                </h3>
                <div className="flex items-baseline gap-2">
                  <FiDollarSign className="text-green-400 text-xl" />
                  <span className="text-3xl font-bold text-green-400">
                    {rewardData.totalRedeemed || 0} TK
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Total value redeemed
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <FiDollarSign className="text-green-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Claim Rewards Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-white">
              Available Rewards
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewardCards.map(
              ({ type, icon: Icon, color, bgColor, points, requirement }) => (
                <div
                  key={type}
                  className={`group relative overflow-hidden rounded-2xl p-1 ${bgColor} backdrop-blur-lg border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="relative bg-gray-900/80 rounded-xl p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`bg-gradient-to-r ${color} p-3 rounded-lg shadow-lg`}
                      >
                        <Icon className="text-white text-xl" />
                      </div>
                      <span className="text-xs font-semibold text-white bg-black/40 px-3 py-1 rounded-full border border-gray-600/50">
                        {points} pts
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 capitalize">
                      {type} Bonus
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {requirement}
                    </p>

                    <button
                      onClick={() => handleClaim(type)}
                      disabled={
                        timers[type] > 0 ||
                        timers[type] === Infinity ||
                        claiming[type]
                      }
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden ${
                        timers[type] > 0 ||
                        timers[type] === Infinity ||
                        claiming[type]
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : `bg-gradient-to-r ${color} text-white hover:shadow-lg hover:scale-105`
                      }`}
                    >
                      {claiming[type] ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Claiming...
                        </div>
                      ) : timers[type] === Infinity ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiClock className="text-sm" />
                          Locked
                        </span>
                      ) : timers[type] > 0 ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiClock className="text-sm" />
                          {formatTime(timers[type])}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FiAward className="text-sm" />
                          Claim Reward
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="relative mb-16">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#9292FF]/10 via-cyan-500/5 to-emerald-500/5 rounded-3xl blur-xl"></div>

          <div className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-4 md:p-8 border border-[#9292FF]/30 shadow-2xl">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#9292FF] rounded-full blur-lg opacity-50"></div>
                  <FiDollarSign className="relative text-3xl md:text-4xl text-[#e22727] z-10" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Select Points to Redeem
                </h2>
              </div>
              <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                Choose your redemption amount and convert points to TK instantly
              </p>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[600px] space-y-4 max-w-4xl mx-auto">
                {redemptionOptions.map((option, index) => (
                  <div
                    key={option.points}
                    className={`group relative transition-all duration-300 ${
                      rewardData.points >= option.points
                        ? "hover:scale-[1.02] cursor-pointer"
                        : "opacity-60"
                    }`}
                  >
                    {/* Selection Item */}
                    <div
                      onClick={() =>
                        rewardData.points >= option.points &&
                        handleRedeem(option.points, option.tk)
                      }
                      className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 ${
                        rewardData.points >= option.points
                          ? "bg-gradient-to-r from-gray-800 to-gray-900 border-[#9292FF]/40 hover:border-[#9292FF]/60 hover:bg-gradient-to-r hover:from-[#9292FF]/10 hover:to-cyan-500/10"
                          : "bg-gray-800/50 border-gray-600/30 cursor-not-allowed"
                      }`}
                    >
                      {/* Left Side - Points and Info */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                        <div className="flex items-center gap-4 md:gap-6 flex-1">
                          {/* Selection Indicator */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              rewardData.points >= option.points
                                ? "border-[#9292FF] bg-[#9292FF]/20 group-hover:bg-[#9292FF]/30"
                                : "border-gray-500 bg-gray-600/20"
                            }`}
                          >
                            {rewardData.points >= option.points && (
                              <div className="w-3 h-3 bg-[#9292FF] rounded-full animate-pulse"></div>
                            )}
                          </div>

                          {/* Points and TK Value */}
                          <div className="flex items-center gap-3 md:gap-6 flex-wrap">
                            {/* Points Amount */}
                            <div className="flex items-center gap-2 md:gap-4">
                              <div
                                className={`text-2xl md:text-3xl font-black ${
                                  rewardData.points >= option.points
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                {option.points}
                              </div>
                              <div className="text-gray-400 text-base md:text-lg">
                                points
                              </div>
                            </div>

                            {/* Arrow Separator */}
                            <div className="text-gray-500 text-lg md:text-xl hidden sm:block">
                              →
                            </div>

                            {/* TK Value */}
                            <div className="flex items-center gap-2 md:gap-3">
                              <FiDollarSign
                                className={`text-lg md:text-xl ${
                                  rewardData.points >= option.points
                                    ? "text-yellow-400"
                                    : "text-gray-500"
                                }`}
                              />
                              <span
                                className={`text-xl md:text-2xl font-black ${
                                  rewardData.points >= option.points
                                    ? "text-yellow-300"
                                    : "text-gray-500"
                                }`}
                              >
                                {option.tk} TK
                              </span>
                            </div>

                            {/* Bonus Label */}
                            {option.label && (
                              <div
                                className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold border ${
                                  rewardData.points >= option.points
                                    ? "bg-[#9292FF]/20 text-[#9292FF] border-[#9292FF]/30"
                                    : "bg-gray-600/20 text-gray-400 border-gray-500/30"
                                }`}
                              >
                                {option.label}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side - Status and Action */}
                        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                          {/* Progress Indicator */}
                          <div className="flex items-center gap-3">
                            <div className="w-16 md:w-24 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  rewardData.points >= option.points
                                    ? "bg-gradient-to-r from-[#9292FF] to-cyan-500"
                                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (rewardData.points / option.points) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span
                              className={`text-xs md:text-sm font-medium w-14 md:w-16 ${
                                rewardData.points >= option.points
                                  ? "text-[#9292FF]"
                                  : "text-orange-400"
                              }`}
                            >
                              {rewardData.points >= option.points
                                ? "Ready"
                                : `${option.points - rewardData.points} needed`}
                            </span>
                          </div>

                          {/* Action Button */}
                          <button
                            disabled={rewardData.points < option.points}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRedeem(option.points, option.tk);
                            }}
                            className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden min-w-[100px] ${
                              rewardData.points >= option.points
                                ? "bg-[#5b5bac] text-white hover:shadow-lg hover:scale-105"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {rewardData.points >= option.points ? (
                              <span className="flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base">
                                <FiGift className="text-base md:text-lg" />
                                Redeem
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base">
                                <FiLock className="text-base md:text-lg" />
                                Locked
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bonus Description */}
                      {option.bonus && (
                        <div
                          className={`mt-3 ml-0 md:ml-12 text-xs md:text-sm ${
                            rewardData.points >= option.points
                              ? "text-cyan-300"
                              : "text-gray-500"
                          }`}
                        >
                          🎁 {option.bonus}
                        </div>
                      )}
                    </div>

                    {/* Hover Effect */}
                    {rewardData.points >= option.points && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9292FF]/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Indicator for Mobile */}
            <div className="flex justify-center mt-4 md:hidden">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>← Scroll →</span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress & Info Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-gray-800/40 backdrop-blur-lg rounded-xl px-6 py-4 border border-gray-700/50">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FiTrendingUp className="text-purple-400" />
              <span>Weekly rewards unlock at 7-day streak</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FiShield className="text-blue-400" />
              <span>Monthly rewards unlock at 28-day streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
