'use client';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
export default function TermsAndConditions() {
    const [activeSection, setActiveSection] = useState(null);
    const [accepted, setAccepted] = useState(false);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const sections = [
        {
            id: 'acceptance',
            title: '1. Acceptance of Terms',
            content: `By accessing and using Vibe Pass (the "Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`
        },
        {
            id: 'services',
            title: '2. Services Description',
            content: `Vibe Pass provides an online platform for booking movie tickets, purchasing passes, and related services. We partner with theaters and cinemas to offer these services. All bookings are subject to theater availability and policies.`
        },
        {
            id: 'account',
            title: '3. User Accounts',
            content: `- You must be at least 18 years old to create an account
- You are responsible for maintaining account confidentiality
- Provide accurate and complete information during registration
- Notify us immediately of any unauthorized account use
- We reserve the right to suspend accounts violating these terms`
        },
        {
            id: 'booking',
            title: '4. Ticket Booking & Vibe Pass',
            content: `**Ticket Bookings:**
- All bookings are subject to availability
- Prices are subject to change without notice
- Booking confirmation is subject to payment verification

**Vibe Pass:**
- Pass validity and benefits are as described at time of purchase
- Passes are non-transferable unless specified
- We reserve the right to modify pass terms with prior notice
- Pass benefits cannot be combined with other offers unless stated`
        },
        {
            id: 'payments',
            title: '5. Payments & Refunds',
            content: `**Payments:**
- All payments are processed securely
- We accept various payment methods as displayed on the Platform
- You authorize us to charge the provided payment method

**Refunds & Cancellations:**
- Standard ticket bookings are generally non-refundable
- Cancellation policies vary by theater and show timing
- Vibe Pass subscriptions may have specific cancellation terms
- Refunds, if applicable, will be processed within 7-14 business days`
        },
        {
            id: 'cancellation',
            title: '6. Show Cancellations & Changes',
            content: `**Theater Responsibilities:**
- Theaters may cancel or reschedule shows due to technical issues, weather, or other reasons
- In case of show cancellation, we will notify you and process refunds if applicable

**User Responsibilities:**
- Arrive at the theater on time
- Carry valid ID and booking confirmation
- Follow theater rules and regulations
- Late arrivals may result in seat forfeiture`
        },
       
        {
            id: 'privacy',
            title: '8. Privacy & Data Protection',
            content: `Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data. By using our services, you consent to our data practices.`
        },
      
        {
            id: 'limitation',
            title: '10. Limitation of Liability',
            content: `Vibe Pass is not liable for:
- Theater service quality or show content
- Technical issues at partner theaters
- User errors in booking or payment
- Indirect, incidental, or consequential damages
Our total liability shall not exceed the amount paid for the specific booking.`
        },
      
    ,
        {
            id: 'governing',
            title: '13. Governing Law',
            content: `These Terms and Conditions are governed by the laws of [Your Country/State]. Any disputes shall be resolved in the courts of [Your Jurisdiction].`
        },
        {
            id: 'contact',
            title: '14. Contact Information',
            content: `For questions about these Terms and Conditions, please contact us at:
- Email: legal@vibepass.com
- Phone: [Your Customer Service Number]
- Address: [Your Company Address]`
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto pt-9">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <FiAlertTriangle className="text-yellow-400 text-2xl mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-yellow-400 font-semibold text-lg mb-2">Important Notice</h3>
                            <p className="text-gray-300">
                                Please read these terms carefully before using Vibe Pass. By accessing or using our platform,
                                you agree to be bound by these Terms and Conditions. If you disagree with any part, you may not access our services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-4 mb-8">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                            >
                                <span className="text-white font-semibold text-lg">{section.title}</span>
                                {activeSection === section.id ? (
                                    <FiChevronUp className="text-purple-400 text-xl" />
                                ) : (
                                    <FiChevronDown className="text-purple-400 text-xl" />
                                )}
                            </button>
                            {activeSection === section.id && (
                                <div className="px-6 py-4 border-t border-gray-700">
                                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                                        {section.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Acceptance Section */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex items-center justify-center w-6 h-6 mt-1">
                            <input
                                type="checkbox"
                                id="accept-terms"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="accept-terms" className="text-white font-semibold text-lg block mb-2">
                                Acceptance of Terms
                            </label>
                            <p className="text-gray-400">
                                I have read, understood, and agree to be bound by these Terms and Conditions.
                                I acknowledge that these terms constitute a legal agreement between me and Vibe Pass.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            onClick={() => setAccepted(false)}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <FiX />
                            Decline
                        </button>
                        <button
                            onClick={() => {
                                if (accepted) {
                                    // Handle acceptance - e.g., proceed to booking
                                    toast.success("Terms accepted! You can now proceed with your booking.");
                                    
                              
                                } else {
                                    toast.success('Please accept the Terms and Conditions to continue.');
                                }
                            }}
                            disabled={!accepted}
                            className={`px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${accepted
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <FiCheck />
                            Accept & Continue
                        </button>
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                        <h3 className="text-purple-400 font-semibold text-lg mb-3">Key Points</h3>
                        <ul className="text-gray-300 space-y-2">
                            <li>• Bookings subject to theater availability</li>
                            <li>• Standard tickets are generally non-refundable</li>
                            <li>• Vibe Pass terms may vary by subscription</li>
                            <li>• Follow theater rules and arrival times</li>
                            <li>• Keep your account credentials secure</li>
                        </ul>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                        <h3 className="text-blue-400 font-semibold text-lg mb-3">Need Help?</h3>
                        <p className="text-gray-300 mb-4">
                            Contact our support team for questions about these terms or your bookings.
                        </p>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-400 flex items-center gap-2"><IoMdMail /> ph.novasquad@gmail.com</p>
                            <p className="text-gray-400 flex items-center gap-2"><FaPhoneAlt /> +60 11-3545 1398S</p>
                            <p className="text-gray-400 flex items-center gap-2"><MdOutlineAccessTimeFilled /> 24/7 Customer Support</p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 pt-6 border-t border-gray-700">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Vibe Pass. All rights reserved.
                        These terms are subject to change without prior notice.
                    </p>
                </div>
            </div>
        </div>
    );
}