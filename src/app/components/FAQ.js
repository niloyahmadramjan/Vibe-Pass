'use client'

import { useState, useEffect, useRef } from 'react'
import ContactSupportSection from './ContactModal'
import AiChat from './AiChat'
import AdminChat from './UserLiveChat'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

const QnA = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('booking')
  const [activeChat, setActiveChat] = useState(null) // 'ai' or 'admin'
  const chatRef = useRef(null)

  // Disable body scroll when chat is open - FIXED VERSION
  useEffect(() => {
    if (activeChat) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    };
  }, [activeChat]);

  // Handle click outside chat to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeChat && chatRef.current && !chatRef.current.contains(event.target)) {
        handleCloseChat();
      }
    };

    // Add event listener when chat is open
    if (activeChat) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeChat]);

  // FAQ data array with questions and answers
  const faqData = [
    {
      id: 1,
      question: 'How do I book movie tickets online?',
      answer: "Booking tickets is simple! Select your movie, choose showtime, pick seats, and proceed to payment. You'll receive e-tickets via email and SMS.",
      category: 'booking',
    },
    {
      id: 2,
      question: 'Can I cancel or refund my tickets?',
      answer: 'Tickets can be cancelled up to 2 hours before showtime. Refunds are processed within 5-7 business days. Some special events may have different policies.',
      category: 'cancellation',
    },
    {
      id: 3,
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, UPI, net banking, and popular digital wallets like PayPal, Google Pay, and PhonePe. All payments are secure and encrypted.',
      category: 'payment',
    },
    {
      id: 4,
      question: 'Are there any booking fees?',
      answer: 'We charge a nominal convenience fee of ₹20 per ticket. This helps maintain our booking platform and provide 24/7 customer support.',
      category: 'fees',
    },
    {
      id: 5,
      question: 'Do you offer student discounts?',
      answer: 'Yes! Students get 20% off on weekdays with valid student ID. The discount applies to standard tickets only, not premium formats.',
      category: 'discounts',
    },
    {
      id: 6,
      question: 'How early should I arrive for the movie?',
      answer: 'We recommend arriving 20-30 minutes before showtime. This gives you enough time for security check, collecting snacks, and finding your seats.',
      category: 'general',
    },
    {
      id: 7,
      question: 'Can I choose my seats in advance?',
      answer: 'Absolutely! Our interactive seat map lets you select preferred seats during booking. Premium seats are marked accordingly with different pricing.',
      category: 'booking',
    },
    {
      id: 8,
      question: 'What if I miss my show?',
      answer: 'Unfortunately, missed shows cannot be refunded. However, you can contact our support team within 24 hours for possible rescheduling options.',
      category: 'cancellation',
    },
    {
      id: 9,
      question: 'Do you have wheelchair accessible seating?',
      answer: 'Yes, all our theaters have wheelchair accessible seating. You can select these seats during booking or inform our staff for assistance.',
      category: 'accessibility',
    },
    {
      id: 10,
      question: "What's the difference between 2D, 3D, and IMAX?",
      answer: '2D is standard format, 3D offers immersive depth experience, and IMAX provides enhanced picture quality with premium sound. Pricing varies accordingly.',
      category: 'general',
    },
  ]

  // Categories for filtering FAQ items
  const categories = [
    {
      id: 'booking',
      name: 'Booking',
      count: faqData.filter((item) => item.category === 'booking').length,
    },
    {
      id: 'payment',
      name: 'Payment',
      count: faqData.filter((item) => item.category === 'payment').length,
    },
    {
      id: 'cancellation',
      name: 'Cancellation',
      count: faqData.filter((item) => item.category === 'cancellation').length,
    },
    {
      id: 'discounts',
      name: 'Discounts',
      count: faqData.filter((item) => item.category === 'discounts').length,
    },
    {
      id: 'general',
      name: 'General',
      count: faqData.filter((item) => item.category === 'general').length,
    },
  ]

  // Filter FAQs based on selected category
  const filteredFaqs = selectedCategory === 'all'
    ? faqData
    : faqData.filter((item) => item.category === selectedCategory)

  // Toggle accordion open/close state
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  // Get color for category badges
  const getCategoryColor = (category) => {
    const colors = {
      booking: 'bg-[#D32F2F]',
      payment: 'bg-[#2196F3]',
      cancellation: 'bg-[#FF9800]',
      discounts: 'bg-[#4CAF50]',
      fees: 'bg-[#9C27B0]',
      accessibility: 'bg-[#607D8B]',
      general: 'bg-[#795548]',
    }
    return colors[category] || 'bg-[#D32F2F]'
  }

  // Handle Live Chat click - Check login first
  const handleLiveChatClick = () => {
    if (!user) {
      // Redirect to login page if not logged in
      router.push('/login')
      return
    }

    // If logged in, directly open Admin Chat (no popup)
    setActiveChat('admin')
  }

  // Close active chat
  const handleCloseChat = () => {
    setActiveChat(null)
  }

  // Switch between chat types
  const switchToAiChat = () => {
    setActiveChat('ai')
  }

  const switchToAdminChat = () => {
    setActiveChat('admin')
  }

  return (
    <>
      {/* Main content with conditional overflow */}
      <div className={activeChat ? 'overflow-hidden h-screen' : ''}>
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12 fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-[#D32F2F] rounded-full"></div>
                <span className="text-[#FFD700] font-semibold text-sm uppercase tracking-wider">
                  FAQ
                </span>
                <div className="w-3 h-3 bg-[#D32F2F] rounded-full"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Frequently Asked
                <span className="text-gradient bg-gradient-to-r from-[#D32F2F] to-[#FF5252] bg-clip-text text-transparent">
                  {' '}
                  Questions
                </span>
              </h2>
              <p className="text-[#B0B0B0] text-lg max-w-7xl mx-auto">
                Find quick answers to common questions about booking, payments, and your movie experience.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${selectedCategory === category.id
                    ? 'bg-[#D32F2F] border-[#D32F2F] text-white shadow-lg shadow-red-500/25'
                    : 'border-[#333] text-[#B0B0B0] hover:border-[#D32F2F] hover:text-white'
                    }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === category.id
                      ? 'bg-white text-[#D32F2F]'
                      : 'bg-[#333] text-[#B0B0B0]'
                      }`}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* FAQ Accordion Items */}
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className={`bg-[#1E1E1E] border border-[#333] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#D32F2F]/50 ${activeIndex === index
                      ? 'ring-2 ring-[#D32F2F]/20 border-[#D32F2F]'
                      : ''
                      }`}
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-2 h-2 rounded-full mt-3 ${getCategoryColor(
                            faq.category
                          )}`}
                        ></div>
                        <div>
                          <h3 className="text-lg font-semibold text-white pr-8">
                            {faq.question}
                          </h3>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              faq.category
                            )} text-white bg-opacity-20`}
                          >
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''
                          }`}
                      >
                        <svg
                          className="w-6 h-6 text-[#D32F2F]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    <div
                      className={`px-6 pb-5 transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'
                        }`}
                    >
                      <div className="pl-6 border-l-2 border-[#D32F2F]">
                        <p className="text-[#B0B0B0] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Call-to-Action Section */}
            <div className="text-center mt-12 pt-8 border-t border-[#333]">
              <p className="text-[#B0B0B0] mb-6">
                Still have questions? We're here to help!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ContactSupportSection />
                {/* Live Chat Button - Now directly opens Admin Chat if logged in */}
                <button
                  onClick={handleLiveChatClick}
                  className="btn-secondary border-2 border-[#D32F2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#D32F2F] transition-all duration-300"
                >
                  Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* Custom CSS Styles */}
          <style jsx>{`
            .text-gradient {
              background: linear-gradient(135deg, #d32f2f 0%, #ff5252 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .fade-in {
              animation: fadeIn 0.8s ease-out;
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </section>
      </div>

      {/* Unified Chat Component with Tabs - NO BLUR */}
      {(activeChat === 'ai' || activeChat === 'admin') && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end md:justify-end p-4 bg-black/50"
          onClick={handleCloseChat} // Close when clicking on backdrop
        >
          <div
            ref={chatRef}
            className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-lg h-[550px] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside chat
          >
            {/* Chat Header with Tabs */}
            <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900 broder-t-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeChat === 'ai'
                    ? 'bg-gradient-to-br from-red-500 to-red-600'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {activeChat === 'ai' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {activeChat === 'ai' ? 'VibePass AI Assistant' : 'Live Support'}
                    </h2>
                    <p className="text-gray-400 text-xs">
                      {activeChat === 'ai' ? 'Powered by Gemini AI' : "We're here to help you!"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseChat}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tab Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={switchToAdminChat}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeChat === 'admin'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Admin Chat</span>
                  </div>
                </button>

                <button
                  onClick={switchToAiChat}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeChat === 'ai'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>AI Chat</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1">
              {activeChat === 'ai' ? (
                <AiChat
                  isOpen={true}
                  onClose={handleCloseChat}
                  embedded={true}
                />
              ) : (
                <AdminChat
                  isOpen={true}
                  onClose={handleCloseChat}
                  embedded={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QnA