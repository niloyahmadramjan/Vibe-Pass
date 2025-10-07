"use client";
import { useState, useEffect } from "react";
import {
  FiCreditCard,
  FiDollarSign,
  FiPlus,
  FiMinus,
  FiArrowUp,
  FiArrowDown,
  FiShoppingBag,
  FiFilm,
  FiCoffee,
  FiGift,
  FiShield,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiShare2,
  FiBarChart2,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

function MyWallet() {
  const [showBalance, setShowBalance] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");
  const [isClient, setIsClient] = useState(false);

  // Demo wallet data
  const walletData = {
    balance: 12500.75,
    currency: "BDT",
    cards: [
      {
        id: 1,
        type: "Visa",
        number: "**** **** **** 4242",
        holder: "John Doe",
        expiry: "12/25",
        cvv: "***",
        isDefault: true,
        color: "from-blue-600 to-purple-600",
      },
      {
        id: 2,
        type: "Mastercard",
        number: "**** **** **** 5689",
        holder: "John Doe",
        expiry: "08/24",
        cvv: "***",
        isDefault: false,
        color: "from-red-500 to-orange-500",
      },
    ],
    transactions: [
      {
        id: 1,
        type: "debit",
        amount: 1200.0,
        description: "Movie Tickets - Avengers",
        category: "entertainment",
        date: "2024-01-15",
        time: "14:30",
        icon: <FiFilm className="text-blue-400" />,
        status: "completed",
      },
      {
        id: 2,
        type: "credit",
        amount: 5000.0,
        description: "Wallet Top-up",
        category: "topup",
        date: "2024-01-14",
        time: "10:15",
        icon: <FiPlus className="text-green-400" />,
        status: "completed",
      },
      {
        id: 3,
        type: "debit",
        amount: 350.5,
        description: "Coffee Shop",
        category: "food",
        date: "2024-01-13",
        time: "08:45",
        icon: <FiCoffee className="text-orange-400" />,
        status: "completed",
      },
      {
        id: 4,
        type: "debit",
        amount: 2400.0,
        description: "Shopping Mall",
        category: "shopping",
        date: "2024-01-12",
        time: "16:20",
        icon: <FiShoppingBag className="text-purple-400" />,
        status: "completed",
      },
      {
        id: 5,
        type: "credit",
        amount: 1500.0,
        description: "Reward Points",
        category: "reward",
        date: "2024-01-11",
        time: "12:00",
        icon: <FiGift className="text-yellow-400" />,
        status: "completed",
      },
    ],
    stats: {
      totalSpent: 3950.5,
      totalReceived: 6500.0,
      monthlyLimit: 20000.0,
      cardsLinked: 2,
    },
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "entertainment":
        return "bg-blue-500/20 text-blue-400";
      case "topup":
        return "bg-green-500/20 text-green-400";
      case "food":
        return "bg-orange-500/20 text-orange-400";
      case "shopping":
        return "bg-purple-500/20 text-purple-400";
      case "reward":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const monthlySpending =
    (walletData.stats.totalSpent / walletData.stats.monthlyLimit) * 100;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 pt-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            My Wallet
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage your balance, track expenses, and view payment methods
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                    Total Balance
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl md:text-5xl font-bold text-white">
                      {showBalance
                        ? formatCurrency(walletData.balance)
                        : "••••••"}
                    </div>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {showBalance ? (
                        <FiEyeOff className="text-gray-400 text-xl" />
                      ) : (
                        <FiEye className="text-gray-400 text-xl" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                    <FiArrowUp className="mr-1" />
                    Active
                  </div>
                  <p className="text-gray-400 text-sm">Wallet Status</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105">
                  <FiPlus size={20} />
                  <span>Add Money</span>
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105">
                  <FiShare2 size={20} />
                  <span>Send Money</span>
                </button>
              </div>

              {/* Spending Progress */}
              <div className="bg-gray-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Monthly Spending
                  </h3>
                  <span className="text-gray-400 text-sm">
                    {formatCurrency(walletData.stats.totalSpent)} /{" "}
                    {formatCurrency(walletData.stats.monthlyLimit)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${monthlySpending}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0%</span>
                  <span>{Math.round(monthlySpending)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Wallet Stats
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <FiArrowDown className="text-red-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(walletData.stats.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <FiArrowUp className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Received</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(walletData.stats.totalReceived)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <FiCreditCard className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Cards Linked</p>
                    <p className="text-white font-semibold">
                      {walletData.stats.cardsLinked}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <FiBarChart2 className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Limit</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(walletData.stats.monthlyLimit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-700/50">
            {[
              {
                id: "transactions",
                label: "Transactions",
                count: walletData.transactions.length,
              },
              {
                id: "cards",
                label: "Payment Methods",
                count: walletData.cards.length,
              },
              { id: "analytics", label: "Analytics", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-6 px-4 font-semibold text-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-red-600/20 text-white border-b-2 border-red-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-white/20" : "bg-gray-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "transactions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-white">
                    Recent Transactions
                  </h3>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <FiDownload size={18} />
                    <span>Export</span>
                  </button>
                </div>

                {walletData.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-700 rounded-xl group-hover:bg-gray-600 transition-colors">
                        {transaction.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-gray-400 text-sm flex items-center space-x-1">
                            <FiCalendar size={12} />
                            <span>{formatDate(transaction.date)}</span>
                          </span>
                          <span className="text-gray-400 text-sm flex items-center space-x-1">
                            <FiClock size={12} />
                            <span>{transaction.time}</span>
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                              transaction.category
                            )}`}
                          >
                            {transaction.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-right ${
                        transaction.type === "credit"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      <div className="font-bold text-lg">
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-gray-400 text-sm capitalize">
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "cards" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-white">
                    Payment Methods
                  </h3>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 transition-all duration-300">
                    <FiPlus size={18} />
                    <span>Add New Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {walletData.cards.map((card) => (
                    <div
                      key={card.id}
                      className={`bg-gradient-to-br ${card.color} rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-500 shadow-2xl`}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-2xl font-bold">{card.type}</div>
                        {card.isDefault && (
                          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-mono tracking-wider mb-6">
                        {card.number}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm">Card Holder</p>
                          <p className="font-semibold">{card.holder}</p>
                        </div>
                        <div>
                          <p className="text-white/70 text-sm">Expires</p>
                          <p className="font-semibold">{card.expiry}</p>
                        </div>
                        <div>
                          <p className="text-white/70 text-sm">CVV</p>
                          <p className="font-semibold">{card.cvv}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <div className="bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto border border-gray-700/50">
                  <FiBarChart2 className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-400">
                    Detailed spending analytics and insights will be available
                    soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center space-x-4">
            <FiShield className="text-blue-400 text-2xl" />
            <div>
              <h4 className="text-white font-semibold mb-1">
                Your wallet is secure
              </h4>
              <p className="text-blue-200 text-sm">
                All transactions are encrypted and protected by advanced
                security measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyWallet;
