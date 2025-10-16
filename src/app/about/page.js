'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import {
  FaFilm,
  FaUsers,
  FaCreditCard,
  FaMobileAlt,
  FaStar,
  FaChair,
  FaGithub,
  FaLinkedin,
  FaRocket,
  FaHeart,
  FaPlay,
  FaCrown,
} from 'react-icons/fa'

// Features with enhanced descriptions
const features = [
  {
    icon: <FaFilm className="w-8 h-8" />,
    title: 'Cinematic Universe',
    desc: 'Immerse yourself in our vast collection of blockbusters, indie gems, and international cinema from every corner of the globe.',
  },
  {
    icon: <FaUsers className="w-8 h-8" />,
    title: 'Family First Experience',
    desc: 'Smart content filtering ensures perfect movie nights for all ages with customized recommendations for every family member.',
  },
  {
    icon: <FaCreditCard className="w-8 h-8" />,
    title: 'Fortress Security',
    desc: 'Bank-grade encryption protects every transaction with multiple payment options for your convenience and peace of mind.',
  },
  {
    icon: <FaMobileAlt className="w-8 h-8" />,
    title: 'Digital Concierge',
    desc: 'Smart QR tickets delivered instantly with personalized recommendations and exclusive behind-the-scenes content.',
  },
  {
    icon: <FaStar className="w-8 h-8" />,
    title: 'Trend Radar',
    desc: 'Stay ahead of the curve with AI-powered trending analysis and community-driven popularity metrics.',
  },
  {
    icon: <FaChair className="w-8 h-8" />,
    title: 'Immersive Seating',
    desc: '3D theater layouts with real-time seat availability and premium spot recommendations for optimal viewing.',
  },
]

// Enhanced Team Members
const teamMembers = [
  {
    name: 'MD RAMJAN ALI',
    role: 'MERN Stack Developer',
    skills: ['React', 'Next.js', 'Node.js', 'MongoDB'],
    bio: 'Architecting digital experiences with precision and passion, leading teams to build the future of entertainment technology.',
    photo: 'https://avatars.githubusercontent.com/u/105724190?v=4',
    github: 'https://github.com/niloyahmaramjan',
    linkedin: 'https://www.linkedin.com/in/niloyahmedramjan',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Mohammad Zubaed Hasan',
    role: 'Frontend Developer',
    skills: ['React', 'Next.js', 'Tailwind CSS'],
    bio: 'Crafting pixel-perfect interfaces that blend aesthetics with functionality for unforgettable user journeys.',
    photo: 'https://i.ibb.co.com/848Hr24Z/done4.png',
    github: 'https://github.com/Zihad-pro',
    linkedin: 'https://www.linkedin.com/in/zubaed',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Shaikh Rasedul Islam',
    role: 'Backend Developer',
    skills: ['Node.js', 'Express', 'MongoDB'],
    bio: 'Building robust server architectures that power seamless experiences with security and scalability at the core.',
    photo: 'https://i.postimg.cc/wxXyQZQf/a-studio-portrait-photograph-of-a-young-nu-XA88c-XS5-C6u10u-FLo37g-Yre-LDNYa-TAax-Xyxp-NOL3h-A.jpg',
    github: 'https://github.com/skrased2006',
    linkedin: 'https://www.linkedin.com/in/shaikh-rasedul-islam/',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Shakil Ayan',
    role: 'Frontend Developer',
    skills: ['React', 'CSS', 'Redux'],
    bio: 'Transforming complex ideas into intuitive interfaces that captivate users and enhance engagement.',
    photo: 'https://i.ibb.co.com/NgHYtZwz/IMG-20250723-191547.png',
    github: 'https://github.com/shakilahamed07',
    linkedin: 'https://www.linkedin.com/in/shakil-ahmed-745566379/',
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Md Ashifur Rahman Shaikat',
    role: 'Frontend Developer',
    skills: ['React', 'Next.js', 'Tailwind CSS'],
    bio: 'Pushing the boundaries of web animation and interaction design to create living, breathing digital experiences.',
    photo: 'https://i.ibb.co.com/jZjtNtWH/White-Gradient-Creative-Instagram-Profile-Picture.png',
    github: 'https://github.com/Pixelcodenow',
    linkedin: 'https://www.linkedin.com/in/shaikat-codes/',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    name: 'Md Shafayat Hosan',
    role: 'MERN Stack Developer',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
    bio: 'Engineering full-stack solutions that bridge creative vision with technical excellence and performance.',
    photo: 'https://i.ibb.co.com/VchQpQDY/Whats-App-Image-2025-08-23-at-14-35-37-e0ccedee-removebg-preview.png',
    github: 'https://github.com/shafayat783593',
    linkedin: 'https://www.linkedin.com/in/md-shafayat-hosan',
    color: 'from-indigo-500 to-purple-500',
  },
]

export default function AboutSection() {
  const router = useRouter()

  const handleNavigateHome = () => {
    router.push('/')
  }

  return (
    <section className="text-white py-16 px-6 md:px-20 ">
      {/* Hero Section with Enhanced Design */}
      <div className="relative w-full h-[70vh] flex items-center justify-center text-center px-6 mb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-red-900/20 z-10" />
        <Image
          src="https://i.ibb.co.com/cK3r4vZJ/Zk-RCOGZId3c.jpg"
          alt="Cinema Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
        
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative z-20 max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-purple-600 px-6 py-3 rounded-full mb-6"
          >
            <FaRocket className="w-4 h-4" />
            <span className="text-sm font-semibold">THE FUTURE OF CINEMA</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-purple-500 bg-clip-text text-transparent">
              Vibe Pass
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Where every ticket unlocks a <span className="text-yellow-400">new adventure</span>. 
            Experience cinema like never before.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigateHome}
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-semibold cursor-pointer transition-all duration-300"
          >
            <FaPlay className="w-4 h-4" />
            Explore the Experience
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Team Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-28 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <span className="text-red-400 font-semibold">CREATIVE MINDS</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            The Visionaries Behind Vibe Pass
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
            Meet the passionate team revolutionizing how you experience cinema through innovation and creativity.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="relative mx-auto mb-6">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${member.color} p-1`}>
                      <Image
                        width={128}
                        height={128}
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover border-4 border-gray-900"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900" />
                  </div>

                  <h4 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {member.name}
                  </h4>
                  <p className="text-red-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {member.skills.map((skill, j) => (
                      <span
                        key={j}
                        className="bg-gray-700/50 text-xs px-3 py-2 rounded-full text-gray-300 border border-gray-600 hover:border-red-500 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-600 hover:border-white transition-all duration-300 transform hover:scale-110"
                    >
                      <FaGithub size={18} />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-gray-700/50 text-gray-400 hover:text-white hover:bg-[#0A66C2] border border-gray-600 hover:border-[#0A66C2] transition-all duration-300 transform hover:scale-110"
                    >
                      <FaLinkedin size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-28 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <span className="text-purple-400 font-semibold">WHY CHOOSE US</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>

          <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Beyond Movie Tickets
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-12 text-lg">
            We're not just another booking platform - we're your gateway to unforgettable cinematic experiences with features designed for the modern movie enthusiast.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500"
              >
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl group-hover:from-purple-600 group-hover:to-red-500 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <span className="text-yellow-400 font-semibold">GET STARTED</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          </div>

          <h3 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Your Journey Begins Here
          </h3>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent transform -translate-y-1/2 z-0" />
            
            <div className="flex flex-col md:flex-row justify-center gap-8 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  desc: 'Join our community in seconds and personalize your movie preferences for tailored recommendations.',
                  icon: <FaHeart className="w-6 h-6" />,
                  color: 'from-red-500 to-pink-500',
                },
                {
                  step: '02',
                  title: 'Discover & Explore',
                  desc: 'Dive into our curated collections, trending picks, and exclusive content to find your perfect movie.',
                  icon: <FaFilm className="w-6 h-6" />,
                  color: 'from-purple-500 to-indigo-500',
                },
                {
                  step: '03',
                  title: 'Experience Magic',
                  desc: 'Book seamlessly, enjoy premium features, and create memories that last beyond the credits.',
                  icon: <FaStar className="w-6 h-6" />,
                  color: 'from-yellow-500 to-amber-500',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex-1 group"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/50 transition-all duration-500 h-full">
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-yellow-500 text-2xl font-bold mb-4">{item.step}</div>
                    <h5 className="text-xl font-semibold mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.title}
                    </h5>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative bg-gradient-to-br from-purple-900/40 to-red-900/40 rounded-4xl p-16 border border-gray-700 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <FaCrown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-4xl md:text-5xl font-black mb-6">
                Ready for the{' '}
                <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                  Ultimate Experience
                </span>
                ?
              </h3>
              <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of movie lovers who have already stepped into the future of cinema. 
                Your next unforgettable movie experience is just one click away.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNavigateHome}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-yellow-600 hover:to-red-600 px-16 py-6 rounded-2xl font-black text-xl cursor-pointer shadow-2xl transition-all duration-300 inline-flex items-center gap-3">
                  <FaRocket className="w-6 h-6" />
                  Start Your Journey Today
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}