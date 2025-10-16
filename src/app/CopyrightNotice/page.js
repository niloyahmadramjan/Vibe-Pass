'use client';

import { useState } from 'react';
import {
    FiCheck,
    FiX,
    FiExternalLink,
    FiShield,
    FiLock,
    FiUser,
    FiCreditCard,
    FiDatabase,
} from 'react-icons/fi';
import PrivacyPolicy from '../PrivacyPolicy/page';

export function PrivacyNotice({ onAccept, onDecline, compact = false }) {
    const [accepted, setAccepted] = useState(false);
    const [showFullPolicy, setShowFullPolicy] = useState(false);

    const handleAccept = () => {
        if (accepted) {
            onAccept?.();
        }
    };

    if (showFullPolicy) {
        return <PrivacyPolicy />;
    }

    if (compact) {
        return (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 ">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="privacy-accept-compact"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                    />
                    <label
                        htmlFor="privacy-accept-compact"
                        className="text-gray-300 text-sm flex-1"
                    >
                        I agree to the{' '}
                        <button
                            onClick={() => setShowFullPolicy(true)}
                            className="text-purple-400 hover:text-purple-300 underline inline-flex items-center gap-1"
                        >
                            Privacy Policy <FiExternalLink size={12} />
                        </button>{' '}
                        and data processing for service provision.
                    </label>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FiShield className="text-purple-400 text-xl" />
                </div>
                <h3 className="text-white font-semibold text-lg">
                    Privacy & Data Protection
                </h3>
            </div>

            <div className="text-gray-300 space-y-3 mb-4 text-sm">
                <p>To provide our services, we collect and process:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                    <div className="flex items-center gap-2">
                        <FiUser className="text-blue-400 text-sm" />
                        <span>Contact & profile information</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiCreditCard className="text-green-400 text-sm" />
                        <span>Secure payment details</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiDatabase className="text-yellow-400 text-sm" />
                        <span>Booking history & preferences</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiLock className="text-red-400 text-sm" />
                        <span>Encrypted technical data</span>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                    <p className="text-blue-300 text-xs">
                        <strong>Your data is protected with:</strong> Bank-level encryption,
                        strict access controls, and compliance with global privacy
                        regulations. We never sell your personal information.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
                <input
                    type="checkbox"
                    id="privacy-accept"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                />
                <label htmlFor="privacy-accept" className="text-gray-300 text-sm flex-1">
                    I have read and agree to the{' '}
                    <button
                        onClick={() => setShowFullPolicy(true)}
                        className="text-purple-400 hover:text-purple-300 underline inline-flex items-center gap-1"
                    >
                        Privacy Policy <FiExternalLink size={12} />
                    </button>{' '}
                    and understand how my data will be processed.
                </label>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onDecline}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <FiX />
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    disabled={!accepted}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm ${accepted
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <FiCheck />
                    Accept & Continue
                </button>
            </div>
        </div>
    );
}

// ✅ Default export required by Next.js
export default function Page() {
    return (
        <div className=" min-h-50 py-40 md:y-0   md:min-h-screen  bg-black flex items-center justify-center p-6">
            <div className="max-w-4xl  w-full">
                <PrivacyNotice />
            </div>
        </div>
    );
}
