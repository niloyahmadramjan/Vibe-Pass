'use client'
import { motion } from 'framer-motion'
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
} from 'react-icons/fa'

// Features
const features = [
  {
    icon: <FaFilm className="w-8 h-8 text-red-500" />,
    title: 'Wide Movie Collection',
    desc: 'Browse and book tickets from the latest blockbusters, regional films, and classics.',
  },
  {
    icon: <FaUsers className="w-8 h-8 text-red-500" />,
    title: 'Family Mode',
    desc: 'Filter movies by age category, ensuring safe and fun viewing for kids and families.',
  },
  {
    icon: <FaCreditCard className="w-8 h-8 text-red-500" />,
    title: 'Secure Online Payments',
    desc: 'Pay safely with credit/debit cards or mobile banking. All transactions are encrypted.',
  },
  {
    icon: <FaMobileAlt className="w-8 h-8 text-red-500" />,
    title: 'Digital E-Tickets',
    desc: 'Instant QR-based tickets sent directly to your app and email. Easy to scan at theaters.',
  },
  {
    icon: <FaStar className="w-8 h-8 text-red-500" />,
    title: 'Trending & Popular Movies',
    desc: 'Discover what’s hot right now with a dedicated section for most booked and trending films.',
  },

  {
    icon: <FaChair className="w-8 h-8 text-red-500" />,
    title: 'Smart Seat Selection',
    desc: 'Choose your favorite seats with an interactive theater layout before confirming your booking.',
  },
]

// Team Members
const teamMembers = [
  {
    name: 'MD RAMJAN ALI',
    role: 'MERN Stack Developer',
    skills: ['React', 'Next.js', 'Node.js', 'MongoDB'],
    bio: 'A MERN Stack developer and team leader who builds and deploys scalable web applications, adept at leading teams to deliver high-quality, efficient projects.',
    photo: 'https://avatars.githubusercontent.com/u/105724190?v=4',
    github: 'https://github.com/niloyahmaramjan',
    linkedin: 'https://www.linkedin.com/in/niloyahmedramjan',
  },
  {
    name: 'Mohammad Zubaed Hasan',
    role: 'Frontend Developer',
    skills: ['React', 'Next.js', 'Tailwind CSS'],
    bio: 'Passionate frontend developer focused on building responsive, user-friendly interfaces with modern web technologies.',
    photo: 'https://i.ibb.co.com/848Hr24Z/done4.png',
    github: 'https://github.com/Zihad-pro',
    linkedin: 'https://www.linkedin.com/in/zubaed',
  },
  {
    name: 'Shaikh Rasedul Islam',
    role: 'Backend Developer',
    skills: ['Node.js', 'Express', 'MongoDB'],
    bio: 'Backend engineer who builds secure, scalable APIs and ensures high-performance server-side applications.',
    photo:
      'https://i.postimg.cc/wxXyQZQf/a-studio-portrait-photograph-of-a-young-nu-XA88c-XS5-C6u10u-FLo37g-Yre-LDNYa-TAax-Xyxp-NOL3h-A.jpg',
    github: 'https://github.com/skrased2006',
    linkedin: 'https://www.linkedin.com/in/shaikh-rasedul-islam/',
  },
  {
    name: 'Shakil Ayan',
    role: 'Frontend Developer',
    skills: ['React', 'CSS', 'Redux'],
    bio: 'Frontend enthusiast dedicated to creating interactive and accessible web applications with modern frameworks.',
    photo: 'https://i.ibb.co.com/NgHYtZwz/IMG-20250723-191547.png',
    github: 'https://github.com/shakilahamed07',
    linkedin: 'https://www.linkedin.com/in/shakil-ahmed-745566379/',
  },
  {
    name: 'Md Ashifur Rahman Shaikat',
    role: 'Frontend Developer',
    skills: ['React', 'Next.js', 'Tailwind CSS'],
    bio: 'Passionate frontend developer focused on building responsive, user-friendly interfaces with modern web technologies.',
    photo:
      'https://i.ibb.co.com/jZjtNtWH/White-Gradient-Creative-Instagram-Profile-Picture.png',
    github: 'https://github.com/Pixelcodenow',
    linkedin: 'https://www.linkedin.com/in/shaikat-codes/',
  },
  {
    name: 'Md Shafayat Hosan',
    role: 'MERN Stack Developer',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
    bio: 'Dedicated backend developer ensuring data integrity, performance, and security in all server-side applications.',
    photo:
      'https://i.ibb.co.com/VchQpQDY/Whats-App-Image-2025-08-23-at-14-35-37-e0ccedee-removebg-preview.png',
    github: 'https://github.com/shafayat783593',
    linkedin: 'https://www.linkedin.com/in/md-shafayat-hosan',
  },
]

export default function AboutSection() {
  return (
    <section className="text-white py-16 px-6 md:px-20">
      <div className="relative w-full h-[60vh] flex items-center justify-center text-center px-6 mb-10">
        <Image
          src="https://i.ibb.co.com/cK3r4vZJ/Zk-RCOGZId3c.jpg"
          alt="Cinema Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
            Welcome to Vibe-Pass
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Your ultimate movie ticket booking platform – seamless, fast, and
            designed for movie lovers like you.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <h3 className="text-3xl font-bold mb-10"> Meet Our Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg text-center"
              >
                <Image
                  width={28}
                  height={28}
                  src={member.photo}
                  alt={member.name}
                  className="w-30 h-30 mx-auto rounded-full border-4 border-red-500 object-cover mb-4"
                />
                <h4 className="text-xl font-semibold">{member.name}</h4>
                <p className="text-red-400 font-medium">{member.role}</p>
                <p className="text-gray-400 text-sm mt-2">{member.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {member.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="bg-gray-700 text-xs px-3 py-1 rounded-full text-red-500"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mt-4">
                  {/* GitHub */}
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-700 text-gray-400 
                                       hover:text-white hover:bg-gray-900 
                                       transition-all duration-300 transform hover:scale-110"
                  >
                    <FaGithub size={20} className="text-inherit" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-700 text-gray-400 
                                       hover:text-white hover:bg-[#0A66C2] 
                                       transition-all duration-300 transform hover:scale-110"
                  >
                    <FaLinkedin size={20} className="text-inherit" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-3xl font-bold mb-4"> Our Core Features</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10">
            Explore the key features that make{' '}
            <span className="text-red-400 font-semibold">Vibe Pass </span>
            the ultimate movie booking experience.
          </p>
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
          <h3 className="text-3xl font-bold mb-8"> How It Works</h3>
          <div className="flex flex-col md:flex-row justify-center gap-10 text-left md:text-center">
            {[
              {
                step: '01',
                title: 'Create an Account',
                desc: 'Sign up easily with email or phone number to start your journey.',
              },
              {
                step: '02',
                title: 'Choose Your Movie',
                desc: 'Browse categories, languages, and trending films to find your favorite.',
              },
              {
                step: '03',
                title: 'Book & Enjoy',
                desc: 'Select seats, pay securely, and get your QR ticket instantly.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 flex-1"
              >
                <h4 className="text-red-500 text-4xl font-bold mb-2">
                  {item.step}
                </h4>
                <h5 className="text-lg font-semibold mb-2">{item.title}</h5>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
