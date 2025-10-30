"use client";
import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FaHeadset, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";


export default function ContactSupportSection({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  
  const form = useRef();

  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);


  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .sendForm(
        "service_zp1jfs7",
        "template_g2gq80v",
        form.current,
        "xZmqbvWVTF2XVpI3S"
      )
      .then(
        () => {
          const confettiColors = ["#ff0000", "#ff6666", "#ffb3b3", "#ffffff"];
          const modal = document.querySelector(".fixed.inset-0");
          if (modal) {
            confettiColors.forEach((color, index) => {
              const confetti = document.createElement("div");
              confetti.className = "absolute w-2 h-2 rounded-full";
              confetti.style.backgroundColor = color;
              confetti.style.left = `${50 + Math.random() * 40 - 20}%`;
              confetti.style.top = `${50 + Math.random() * 40 - 20}%`;
              confetti.style.animation = `confettiFall 1s ease-out ${index * 0.1}s forwards`;
              modal.appendChild(confetti);
              setTimeout(() => {
                if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
              }, 1000);
            });
          }
         toast.success("Message sent successfully!");

          e.target.reset();
          setCharCount(0);
          setIsOpen(false);
        },
        (error) => {
          toast.success("Failed to send message.");
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleMessageChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <div className="dark:bg-gray-950 transition-colors duration-300">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            toast.type === "success"
              ? "bg-red-600 text-white border-l-4 border-red-700"
              : "bg-gray-700 text-white border-l-4 border-gray-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
           
            </span>
            <div>
              <span className="font-semibold block">
               
              </span>
              <span className="text-sm opacity-90">{toast.message}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 animate-progress"></div>
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-red-700 to-red-900 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl shadow-red-500/30 relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center gap-2">
          <FaHeadset /> Contact Support
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 left-0 w-2 h-full bg-white opacity-20 -skew-x-12 transform -translate-x-4 group-hover:translate-x-96 transition-transform duration-700"></div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative border-2 border-red-300 dark:border-red-700 transform scale-95 animate-modalEnter">
            <div className="absolute -top-4 -right-4 bg-red-600 text-white p-3 rounded-full shadow-lg animate-bounce">
              <FaHeadset className="text-xl" />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  isTyping ? "bg-red-500" : "bg-gray-400"
                }`}
              ></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {isTyping ? "Typing..." : "Contact Support"}
              </h2>
            </div>

            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <input
                type="text"
                name="subject"
                placeholder="Subject of your message"
                required
                className="border-2 border-gray-200 dark:border-gray-700 p-3 rounded-lg w-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              <input
                type="text"
                name="user_name"
                placeholder="Your name"
                required
                className="border-2 border-gray-200 dark:border-gray-700 p-3 rounded-lg w-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              <input
                type="email"
                name="user_email"
                defaultValue={user?.email || ""}
                placeholder="you@company.com"
                required
                className="border-2 border-gray-200 dark:border-gray-700 p-3 rounded-lg w-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              <div className="relative">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell us how we can help you..."
                  required
                  onChange={handleMessageChange}
                  className="border-2 border-gray-200 dark:border-gray-700 p-3 rounded-lg w-full resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[120px]"
                ></textarea>

                <div className="flex justify-end mt-2">
                  <span
                    className={`text-xs ${
                      charCount > 200 ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {charCount}/500
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-900 w-full transition-all duration-300 transform hover:scale-[1.02] active:scale-95 font-semibold shadow-lg ${
                  isSending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  " Send Message"
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-400 font-medium mb-2">
                 Quick Tips:
              </p>
              <ul className="text-xs text-red-600 dark:text-red-300 space-y-1">
                <li>• Include specific error messages</li>
                <li>• Describe what you were doing when the issue occurred</li>
                <li>• We typically respond within 2 hours</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(0.95) translateY(0);
          }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-modalEnter {
          animation: modalEnter 0.3s ease-out forwards;
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
}
