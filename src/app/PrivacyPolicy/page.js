'use client';
import { useState } from 'react';
import {
    FiChevronDown,
    FiChevronUp,
    FiShield,
    FiLock,
    FiUser,
    FiCreditCard,
    FiMail,
    FiDatabase,
    FiEye,
    FiShare2,
    FiGlobe,
    FiDownload,
    FiTrash2,
    FiSettings
} from 'react-icons/fi';

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const sections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            icon: <FiShield className="text-purple-400" />,
            content: `Welcome to Vibe Pass. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our movie ticket booking platform.`
        },
        {
            id: 'information-collection',
            title: '2. Information We Collect',
            icon: <FiDatabase className="text-blue-400" />,
            content: `**Personal Information:**
- Contact Details: Name, email address, phone number
- Account Information: Username, password, profile preferences
- Booking Information: Movie preferences, seating choices, booking history
- Payment Information: Card details, billing address (processed securely via payment processors)

**Technical Information:**
- Device Information: IP address, browser type, operating system
- Usage Data: Pages visited, features used, booking patterns
- Location Data: General location for theater recommendations (with your consent)`
        },
        {
            id: 'how-we-use',
            title: '3. How We Use Your Information',
            icon: <FiSettings className="text-green-400" />,
            content: `We use your information to:
- Process ticket bookings and manage your Vibe Pass subscription
- Send booking confirmations and updates
- Provide personalized movie recommendations
- Improve our platform and services
- Communicate important updates and offers
- Ensure platform security and prevent fraud
- Comply with legal obligations`
        },
        {
            id: 'information-sharing',
            title: '4. Information Sharing & Disclosure',
            icon: <FiShare2 className="text-yellow-400" />,
            content: `We may share your information with:
- **Movie Theaters**: Necessary booking details for ticket fulfillment
- **Payment Processors**: Secure payment processing
- **Service Providers**: Analytics, customer support, marketing partners
- **Legal Authorities**: When required by law or to protect our rights

We never sell your personal information to third parties.`
        },
        {
            id: 'data-security',
            title: '5. Data Security',
            icon: <FiLock className="text-red-400" />,
            content: `We implement robust security measures including:
- SSL encryption for all data transmissions
- Secure payment processing compliant with PCI DSS
- Regular security assessments and monitoring
- Access controls and authentication protocols
- Employee training on data protection

While we take reasonable precautions, no internet transmission is 100% secure.`
        },
        {
            id: 'data-retention',
            title: '6. Data Retention',
            icon: <FiDatabase className="text-indigo-400" />,
            content: `We retain your information only as long as necessary for:
- Providing services and managing your account
- Compliance with legal obligations
- Resolving disputes and enforcing agreements
- Business operations and analytics

Booking records are typically retained for 3-5 years for accounting and legal purposes.`
        },
        {
            id: 'user-rights',
            title: '7. Your Rights & Choices',
            icon: <FiUser className="text-teal-400" />,
            content: `You have the right to:
- Access and review your personal information
- Correct inaccurate or incomplete data
- Request deletion of your personal data
- Object to certain processing activities
- Data portability in a machine-readable format
- Withdraw consent for marketing communications
- Lodge complaints with supervisory authorities

Contact us at privacy@vibepass.com to exercise these rights.`
        },
        {
            id: 'cookies-tracking',
            title: '8. Cookies & Tracking Technologies',
            icon: <FiEye className="text-orange-400" />,
            content: `We use cookies and similar technologies for:
- Essential functionality (session management, bookings)
- Performance monitoring and analytics
- Personalization and recommendations
- Advertising and marketing (with your consent)

You can manage cookie preferences through your browser settings.`
        },
        {
            id: 'third-party',
            title: '9. Third-Party Services',
            icon: <FiGlobe className="text-pink-400" />,
            content: `Our platform may integrate with third-party services including:
- Payment processors (Stripe, PayPal, etc.)
- Analytics services (Google Analytics)
- Social media platforms
- Customer support tools

These services have their own privacy policies governing data handling.`
        },
        {
            id: 'children-privacy',
            title: '10. Children\'s Privacy',
            icon: <FiUser className="text-cyan-400" />,
            content: `Vibe Pass is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.`
        },
        {
            id: 'international-transfer',
            title: '11. International Data Transfers',
            icon: <FiGlobe className="text-purple-400" />,
            content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable data protection laws.`
        },
        {
            id: 'policy-updates',
            title: '12. Policy Updates',
            icon: <FiSettings className="text-gray-400" />,
            content: `We may update this Privacy Policy periodically. Significant changes will be notified through:
- Platform notifications
- Email communications
- Updated "Last Updated" date

Continued use of our services constitutes acceptance of updated terms.`
        },
        {
            id: 'contact',
            title: '13. Contact Information',
            icon: <FiMail className="text-blue-400" />,
            content: `For privacy-related inquiries or to exercise your rights, contact us:

**Data Protection Officer:**
- Email: ph.novasquad@gmail.com
- Phone: +60 11-3545 1398
- Address: [dhaka bangladesh]

**General Privacy Questions:**
- Email: ph.novasquad@gmail.com
- Response Time: Within 30 days`
        }
    ];

    return (
        <div className="min-h-screen   py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto py-12">
                {/* Header */}
                <div className="text-center mb-8">
                  
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
                        Privacy Policy
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
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <FiLock className="text-blue-400 text-2xl mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-blue-400 font-semibold text-lg mb-2">Your Privacy Matters</h3>
                            <p className="text-gray-300">
                                We are committed to protecting your personal information and being transparent about
                                how we collect, use, and share your data. This policy explains our practices in clear,
                                straightforward language.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-center">
                        <FiUser className="text-green-400 text-2xl mx-auto mb-2" />
                        <h4 className="text-white font-semibold mb-1">Your Control</h4>
                        <p className="text-gray-400 text-sm">Access, update, or delete your data anytime</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-center">
                        <FiLock className="text-red-400 text-2xl mx-auto mb-2" />
                        <h4 className="text-white font-semibold mb-1">Bank-Level Security</h4>
                        <p className="text-gray-400 text-sm">Enterprise-grade protection for your information</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-center">
                        <FiShare2 className="text-yellow-400 text-2xl mx-auto mb-2" />
                        <h4 className="text-white font-semibold mb-1">No Data Selling</h4>
                        <p className="text-gray-400 text-sm">We never sell your personal information</p>
                    </div>
                </div>

                {/* Privacy Policy Sections */}
                <div className="space-y-4 mb-8">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {section.icon}
                                    <span className="text-white font-semibold text-lg">{section.title}</span>
                                </div>
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

                {/* Your Privacy Rights Section */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
                    <h3 className="text-purple-400 font-semibold text-xl mb-4 flex items-center gap-3">
                        <FiUser />
                        Your Privacy Rights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FiDownload className="text-green-400" />
                                <span className="text-gray-300">Right to Access</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiSettings className="text-blue-400" />
                                <span className="text-gray-300">Right to Correction</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiTrash2 className="text-red-400" />
                                <span className="text-gray-300">Right to Deletion</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FiShare2 className="text-yellow-400" />
                                <span className="text-gray-300">Right to Portability</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiEye className="text-orange-400" />
                                <span className="text-gray-300">Right to Object</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiMail className="text-cyan-400" />
                                <span className="text-gray-300">Right to Withdraw Consent</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Protection Commitment */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                    <h3 className="text-green-400 font-semibold text-xl mb-4 flex items-center gap-3">
                        <FiShield />
                        Our Data Protection Commitment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-white font-semibold mb-3">We Protect Your Data Through:</h4>
                            <ul className="text-gray-300 space-y-2">
                                <li>• Regular security audits and penetration testing</li>
                                <li>• Employee privacy training and confidentiality agreements</li>
                                <li>• Data minimization and purpose limitation principles</li>
                                <li>• Secure development lifecycle practices</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-3">Transparency Promise:</h4>
                            <ul className="text-gray-300 space-y-2">
                                <li>• Clear communication about data practices</li>
                                <li>• Timely notification of significant changes</li>
                                <li>• Responsive handling of privacy inquiries</li>
                                <li>• Compliance with global privacy regulations</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact & Support */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-blue-400 font-semibold text-lg mb-3 flex items-center gap-2">
                            <FiMail />
                            Contact Our Privacy Team
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-300"><strong>General Inquiries:</strong>ph.novasquad@gmail.com</p>
                            <p className="text-gray-300"><strong>Phone Support:</strong> +60 11-3545 1398</p>
                            <p className="text-gray-300"><strong>Response Time:</strong> Within 30 days</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-green-400 font-semibold text-lg mb-3 flex items-center gap-2">
                            <FiSettings />
                            Manage Your Preferences
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                            Control how we use your information through your account settings.
                        </p>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm">
                            Access Privacy Settings
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 pt-6 border-t border-gray-700">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Vibe Pass. All rights reserved.
                        This Privacy Policy may be updated to reflect changes in our practices or legal requirements.
                    </p>
                </div>
            </div>
        </div>
    );
}