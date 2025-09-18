"use client";
import Image from "next/image"; // Make sure to import Image from next/image
import { motion } from "framer-motion";
import {
    FaFilm,
    FaUsers,
    FaCreditCard,
    FaMobileAlt,
    FaStar,
    FaShieldAlt,
    FaChair,
} from "react-icons/fa";

const features = [
    {
        icon: <FaFilm className="w-8 h-8 text-pink-500" />,
        title: "Wide Movie Collection",
        desc: "Browse and book tickets from the latest blockbusters, regional films, and classics.",
    },
    {
        icon: <FaUsers className="w-8 h-8 text-pink-500" />,
        title: "Family Mode",
        desc: "Filter movies by age category, ensuring safe and fun viewing for kids and families.",
    },
    {
        icon: <FaCreditCard className="w-8 h-8 text-pink-500" />,
        title: "Secure Online Payments",
        desc: "Pay safely with credit/debit cards or mobile banking. All transactions are encrypted.",
    },
    {
        icon: <FaMobileAlt className="w-8 h-8 text-pink-500" />,
        title: "Digital E-Tickets",
        desc: "Instant QR-based tickets sent directly to your app and email. Easy to scan at theaters.",
    },
    {
        icon: <FaStar className="w-8 h-8 text-pink-500" />,
        title: "Trending & Popular Movies",
        desc: "Discover what’s hot right now with a dedicated section for most booked and trending films.",
    },
    {
        icon: <FaShieldAlt className="w-8 h-8 text-pink-500" />,
        title: "Multi-Language Support",
        desc: "Browse and book tickets in your preferred language, including Bangla for local users.",
    },
    {
        icon: <FaChair className="w-8 h-8 text-pink-500" />,
        title: "Smart Seat Selection",
        desc: "Choose your favorite seats with an interactive theater layout before confirming your booking.",
    },
];

export default function AboutSection() {
    return (
        <section className="bg-[#1A1A1A] text-white py-11 px-6 md:px-20">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mb-10 max-w-8xl mx-auto shadow-lg rounded-xl overflow-hidden"
                style={{ maxHeight: '700px' }} // container max height bigger
            >
                <div className="flex justify-center mt-12">
                    <div className="max-w-8xl w-full overflow-hidden rounded-xl shadow-lg">
                        <Image
                            src="https://i.ibb.co/mVq8T6dV/about.jpg"
                            alt="Vibe Pass Preview"
                            width={1400}     // bigger width
                            height={800}     // adjusted height for aspect ratio
                            className="w-full h-auto object-cover rounded-xl"
                            style={{ maxHeight: '600px' }} // image max height bigger
                            priority={true}  // optional: prioritize loading
                        />
                    </div>
                </div>
            </motion.div>




            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                        <div className="mb-4">{item.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* How It Works */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="mt-20 text-center"
            >
                <h3 className="text-3xl font-bold mb-8">⚡ How It Works</h3>
                <div className="flex flex-col md:flex-row justify-center gap-10 text-left md:text-center">
                    {[
                        {
                            step: "01",
                            title: "Create an Account",
                            desc: "Sign up easily with email or phone number to start your journey.",
                        },
                        {
                            step: "02",
                            title: "Choose Your Movie",
                            desc: "Browse categories, languages, and trending films to find your favorite.",
                        },
                        {
                            step: "03",
                            title: "Book & Enjoy",
                            desc: "Select seats, pay securely, and get your QR ticket instantly.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-800 rounded-lg p-6 flex-1"
                        >
                            <h4 className="text-pink-500 text-4xl font-bold mb-2">
                                {item.step}
                            </h4>
                            <h5 className="text-lg font-semibold mb-2">{item.title}</h5>
                            <p className="text-gray-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
