"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
    {
        question: "What is VibePass?",
        answer:
            "VibePass is an online movie ticket booking platform that makes booking tickets easy, fast, and secure. Users can browse movies, select seats, and pay online anytime, anywhere.",
    },
    {
        question: "How does seat selection work?",
        answer:
            "You can view an interactive seat layout and pick your preferred seats in real-time, with live availability updates.",
    },
    {
        question: "Is my payment secure?",
        answer:
            "Yes. VibePass uses a secure payment gateway with encryption for all transactions. We also support multiple payment methods, including credit/debit cards and mobile banking.",
    },
    {
        question: "Can I use VibePass in Bangla?",
        answer:
            "Yes. The entire booking process supports local language, including Bangla, so it’s accessible to everyone.",
    },
    {
        question: "What makes VibePass unique?",
        answer:
            "Unlike other platforms, VibePass offers AI-based movie recommendations, a family mode with kids filter, trending movie discovery, and full local language support.",
    },
    {
        question: "How do theater owners use VibePass?",
        answer:
            "Theater owners get access to an admin dashboard where they can manage movies, showtimes, bookings, and view performance analytics.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="text-white max-w-7xl mx-auto py-12 px-4 sm:px-6 md:px-20">
            {/* Title aligned left with red highlight */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left text-red-500 mb-8">
                Frequently Asked <span className="text-red-500">Questions</span>
            </h2>

            {/* FAQ container */}
            <div className="max-w-7xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-700 rounded-lg overflow-hidden"
                    >
                        <button
                            className="w-full flex justify-between items-center px-6 py-5 text-left text-lg font-medium hover:bg-gray-800 transition"
                            onClick={() => toggleFAQ(index)}
                        >
                            <span>{faq.question}</span>
                            {openIndex === index ? (
                                <FaChevronUp className="w-5 h-5" />
                            ) : (
                                <FaChevronDown className="w-5 h-5" />
                            )}
                        </button>

                        {/* Smooth transition block */}
                        <div
                            className={`px-6 bg-gray-900 text-gray-300 transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? "max-h-40 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
                                }`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
