"use client";
import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Headphones, Send, X } from "lucide-react";

export default function ContactSupportSection({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const form = useRef();

  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

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
          const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
          const modal = document.querySelector('.fixed.inset-0');

          if (modal) {
            confettiColors.forEach((color, index) => {
              const confetti = document.createElement('div');
              confetti.className = 'absolute w-2 h-2 rounded-full';
              confetti.style.backgroundColor = color;
              confetti.style.left = `${50 + Math.random() * 40 - 20}%`;
              confetti.style.top = `${50 + Math.random() * 40 - 20}%`;
              confetti.style.animation = `confettiFall 1s ease-out ${index * 0.1}s forwards`;

              modal.appendChild(confetti);

              setTimeout(() => {
                if (confetti.parentNode) {
                  confetti.parentNode.removeChild(confetti);
                }
              }, 1000);
            });
          }

          showToast("🎉 Message sent successfully!", "success");
          e.target.reset();
          setCharCount(0);
          setIsOpen(false);
        },
        (error) => {
          showToast("❌ Failed to send message.", "error");
          console.log(error.text);
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
    <div>
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${toast.type === "success"
          ? "bg-green-500 text-white border-l-4 border-green-600"
          : "bg-red-500 text-white border-l-4 border-red-600"
          } ${toast.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{toast.type === "success" ? "✅" : "❌"}</span>
            <div>
              <span className="font-semibold block">
                {toast.type === "success" ? "Success!" : "Error!"}
              </span>
              <span className="text-sm opacity-90">{toast.message}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 animate-progress"></div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#F44336] hover:to-[#D32F2F] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl shadow-red-500/25 relative overflow-hidden group"
      >
        <span className="relative z-10">Contact Support</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F44336] to-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 left-0 w-2 h-full bg-white opacity-30 -skew-x-12 transform -translate-x-4 group-hover:translate-x-96 transition-transform duration-700"></div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative border-2 border-blue-100 transform scale-95 animate-modalEnter">

            <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg animate-bounce">
              <Headphones className="w-6 h-6" />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black transition-colors duration-200 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isTyping ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isTyping ? "Typing..." : "Contact Support"}
              </h2>
            </div>

            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <input
                type="text"
                name="subject"
                placeholder="Subject of your message"
                required
                className="border-2 border-gray-200 p-3 rounded-lg w-full bg-white text-gray-800 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

              <input
                type="text"
                name="user_name"
                placeholder="Your name"
                required
                className="border-2 border-gray-200 p-3 rounded-lg w-full bg-white text-gray-800 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

              <input
                type="email"
                name="user_email"
                defaultValue={user?.email || ""}
                placeholder="you@company.com"
                required
                className="border-2 border-gray-200 p-3 rounded-lg w-full bg-white text-gray-800 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

              <div className="relative">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell us how we can help you..."
                  required
                  onChange={handleMessageChange}
                  className="border-2 border-gray-200 p-3 rounded-lg w-full resize-none bg-white text-gray-800 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px]"
                ></textarea>

                <div className="flex justify-end mt-2">
                  <span className={`text-xs ${charCount > 200 ? "text-red-500" : "text-gray-500"}`}>
                    {charCount}/500
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 w-full transition-all duration-300 transform hover:scale-[1.02] active:scale-95 font-semibold shadow-lg ${isSending ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Quick Tips:</p>
              <ul className="text-xs text-blue-600 space-y-1">
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
          from { opacity: 0; transform: scale(0.8) translateY(-20px); }
          to { opacity: 1; transform: scale(0.95) translateY(0); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
        }
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
        .animate-modalEnter { animation: modalEnter 0.3s ease-out forwards; }
        .animate-progress { animation: progress 3s linear forwards; }
      `}</style>
    </div>
  );
}
