// components/QnA.jsx
'use client'

import { useState } from 'react'
import ContactSupportSection from './ContactModal'

const QnA = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('booking')

  const faqData = [
    {
      id: 1,
      question: 'How do I book movie tickets online?',
      answer:
        "Booking tickets is simple! Select your movie, choose showtime, pick seats, and proceed to payment. You'll receive e-tickets via email and SMS.",
      category: 'booking',
    },
    {
      id: 2,
      question: 'Can I cancel or refund my tickets?',
      answer:
        'Tickets can be cancelled up to 2 hours before showtime. Refunds are processed within 5-7 business days. Some special events may have different policies.',
      category: 'cancellation',
    },
    {
      id: 3,
      question: 'What payment methods do you accept?',
      answer:
        'We accept credit/debit cards, UPI, net banking, and popular digital wallets like PayPal, Google Pay, and PhonePe. All payments are secure and encrypted.',
      category: 'payment',
    },
    {
      id: 4,
      question: 'Are there any booking fees?',
      answer:
        'We charge a nominal convenience fee of ₹20 per ticket. This helps maintain our booking platform and provide 24/7 customer support.',
      category: 'fees',
    },
    {
      id: 5,
      question: 'Do you offer student discounts?',
      answer:
        'Yes! Students get 20% off on weekdays with valid student ID. The discount applies to standard tickets only, not premium formats.',
      category: 'discounts',
    },
    {
      id: 6,
      question: 'How early should I arrive for the movie?',
      answer:
        'We recommend arriving 20-30 minutes before showtime. This gives you enough time for security check, collecting snacks, and finding your seats.',
      category: 'general',
    },
    {
      id: 7,
      question: 'Can I choose my seats in advance?',
      answer:
        'Absolutely! Our interactive seat map lets you select preferred seats during booking. Premium seats are marked accordingly with different pricing.',
      category: 'booking',
    },
    {
      id: 8,
      question: 'What if I miss my show?',
      answer:
        'Unfortunately, missed shows cannot be refunded. However, you can contact our support team within 24 hours for possible rescheduling options.',
      category: 'cancellation',
    },
    {
      id: 9,
      question: 'Do you have wheelchair accessible seating?',
      answer:
        'Yes, all our theaters have wheelchair accessible seating. You can select these seats during booking or inform our staff for assistance.',
      category: 'accessibility',
    },
    {
      id: 10,
      question: "What's the difference between 2D, 3D, and IMAX?",
      answer:
        '2D is standard format, 3D offers immersive depth experience, and IMAX provides enhanced picture quality with premium sound. Pricing varies accordingly.',
      category: 'general',
    },
  ]

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

  const filteredFaqs =
    selectedCategory === 'all'
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory)

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

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

  return (
    <section className="py-16  relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
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
            Find quick answers to common questions about booking, payments, and
            your movie experience.
          </p>
        </div>

        {/* Category Filters */}
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

        {/* Search Bar */}
        {/* <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full px-6 py-4 bg-[#1E1E1E] border border-[#333] rounded-2xl text-white placeholder-[#666] focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-[#666]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div> */}

        {/* FAQ Accordion */}
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

        {/* Contact CTA */}
        <div className="text-center mt-12 pt-8 border-t border-[#333]">
          <p className="text-[#B0B0B0] mb-6">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ContactSupportSection />
            <button className="btn-secondary border-2 border-[#D32F2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#D32F2F] transition-all duration-300">
              Live Chat
            </button>
          </div>
        </div>
      </div>

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
  )
}

export default QnA
