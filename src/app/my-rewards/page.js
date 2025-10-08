"use client";
import { useState, useEffect } from "react";
import {
  FiGift,
  FiStar,
  FiCopy,
  FiCheck,
  FiClock,
  FiAward,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiCalendar,
  FiUsers,
  FiCreditCard,
} from "react-icons/fi";

function RewardsPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [isClient, setIsClient] = useState(false);

  // Demo rewards data
  const rewards = [
    {
      id: 1,
      title: "Welcome Bonus",
      code: "WELCOME50",
      discount: "50% OFF",
      description: "Get 50% off on your first movie booking",
      expiry: "2024-12-31",
      minAmount: 500,
      maxDiscount: 1000,
      category: "first-time",
      isActive: true,
      isUsed: false,
    },
    {
      id: 2,
      title: "Weekend Special",
      code: "WEEKEND30",
      discount: "30% OFF",
      description: "Enjoy 30% off on all weekend shows",
      expiry: "2024-11-30",
      minAmount: 800,
      maxDiscount: 500,
      category: "weekend",
      isActive: true,
      isUsed: false,
    },
    {
      id: 3,
      title: "Family Package",
      code: "FAMILY25",
      discount: "25% OFF",
      description: "Special discount for family bookings (4+ tickets)",
      expiry: "2024-10-15",
      minAmount: 1200,
      maxDiscount: 800,
      category: "family",
      isActive: true,
      isUsed: false,
    },
  ];

  const userStats = {
    points: 1250,
    level: "Gold",
    availableRewards: 3,
    usedRewards: 2,
    nextReward: 1500,
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "first-time":
        return <FiZap className="text-yellow-400" size={20} />;
      case "weekend":
        return <FiCalendar className="text-blue-400" size={20} />;
      case "family":
        return <FiUsers className="text-green-400" size={20} />;
      default:
        return <FiGift className="text-purple-400" size={20} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "first-time":
        return "from-yellow-500 to-orange-500";
      case "weekend":
        return "from-blue-500 to-cyan-500";
      case "family":
        return "from-green-500 to-emerald-500";
      default:
        return "from-purple-500 to-pink-500";
    }
  };

  const filteredRewards = rewards.filter((reward) => {
    if (activeTab === "active") return reward.isActive && !reward.isUsed;
    if (activeTab === "used") return reward.isUsed;
    if (activeTab === "expired") return !reward.isActive;
    return true;
  });

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-full mb-6 shadow-2xl">
            <FiGift className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            My Rewards & Offers
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Unlock exclusive discounts, special offers, and earn rewards with
            every booking
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Points Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Reward Points
                </h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {userStats.points}
                </div>
                <p className="text-gray-400">
                  {userStats.nextReward - userStats.points} points to next
                  reward
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                  <FiAward className="mr-2" />
                  {userStats.level} Member
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((star) => (
                    <FiStar
                      key={star}
                      className={`${
                        star <=
                        (userStats.level === "Gold"
                          ? 3
                          : userStats.level === "Silver"
                          ? 2
                          : 1)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                      size={16}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${(userStats.points / userStats.nextReward) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>0</span>
              <span>{userStats.nextReward}</span>
            </div>
          </div>

          {/* Tabs Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Your Offers</h3>
            <div className="space-y-4">
              {[
                {
                  id: "active",
                  label: "Active Offers",
                  count: userStats.availableRewards,
                  color: "green",
                },
                {
                  id: "used",
                  label: "Used",
                  count: userStats.usedRewards,
                  color: "blue",
                },
                { id: "expired", label: "Expired", count: 0, color: "gray" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-red-600/20 border border-red-500/50"
                      : "bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        tab.color === "green"
                          ? "bg-green-500"
                          : tab.color === "blue"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="text-white font-semibold">
                      {tab.label}
                    </span>
                  </div>
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className={`bg-gradient-to-br ${getCategoryColor(
                reward.category
              )} rounded-3xl p-1.5 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl`}
            >
              <div className="bg-gray-900 rounded-2xl p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gray-800 rounded-xl">
                      {getCategoryIcon(reward.category)}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl">
                        {reward.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white bg-black/30 px-3 py-1 rounded-lg">
                      {reward.discount}
                    </div>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="bg-gray-800 rounded-xl p-4 mb-4 flex-1">
                  <p className="text-gray-400 text-sm mb-2 font-medium">
                    Promo Code
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-white font-mono text-2xl font-bold tracking-wider">
                      {reward.code}
                    </div>
                    <button
                      onClick={() => copyToClipboard(reward.code)}
                      className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300 group"
                    >
                      {copiedCode === reward.code ? (
                        <FiCheck className="text-green-400" size={20} />
                      ) : (
                        <FiCopy
                          className="text-gray-300 group-hover:text-white"
                          size={20}
                        />
                      )}
                    </button>
                  </div>
                  {copiedCode === reward.code && (
                    <p className="text-green-400 text-sm mt-2 text-center">
                      Copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center bg-gray-800/50 rounded-lg p-3">
                    <FiClock className="text-blue-400 mx-auto mb-2" size={18} />
                    <p className="text-gray-400 text-xs mb-1">Expires</p>
                    <p className="text-white font-semibold text-sm">
                      {formatDate(reward.expiry)}
                    </p>
                  </div>
                  <div className="text-center bg-gray-800/50 rounded-lg p-3">
                    <FiCreditCard
                      className="text-green-400 mx-auto mb-2"
                      size={18}
                    />
                    <p className="text-gray-400 text-xs mb-1">Min. Amount</p>
                    <p className="text-white font-semibold text-sm">
                      ৳{reward.minAmount}
                    </p>
                  </div>
                </div>

                <div className="text-center bg-gray-800/50 rounded-lg p-3 mb-4">
                  <FiAward className="text-yellow-400 mx-auto mb-2" size={18} />
                  <p className="text-gray-400 text-xs mb-1">Max Discount</p>
                  <p className="text-white font-semibold text-sm">
                    ৳{reward.maxDiscount}
                  </p>
                </div>

                {/* Terms */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-xs text-center">
                    Valid on all movie bookings. Cannot be combined with other
                    offers.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            How to Use Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Copy Code",
                description: "Copy the promo code by clicking the copy button",
                icon: <FiCopy className="text-white" size={24} />,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Apply at Checkout",
                description:
                  "Paste the code in the promo code field during payment",
                icon: <FiCreditCard className="text-white" size={24} />,
                color: "from-green-500 to-emerald-500",
              },
              {
                step: "3",
                title: "Enjoy Savings",
                description: "Your discount will be applied automatically",
                icon: <FiGift className="text-white" size={24} />,
                color: "from-purple-500 to-pink-500",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-sm">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Ready to enjoy your rewards?</p>
          <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Book Your Movie Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;
