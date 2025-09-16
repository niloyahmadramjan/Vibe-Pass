"use client";

import React, { useEffect, useRef } from "react";

const Hero = () => {
  const swiperRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Avatar",
      description: "A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BNzM2MDk3MTcyMV5BMl5BanBnXkFtZTcwNjg0MTUzNA@@._V1_SX1777_CR0,0,1777,999_AL_.jpg",
    },
    {
      id: 2,
      title: "I Am Legend",
      description: "Years after a plague kills most of humanity and transforms the rest into monsters, the sole survivor in New York City struggles valiantly to find a cure.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTIwMDg2MDU4M15BMl5BanBnXkFtZTYwMTA0Nzc4._V1_.jpg",
    },
    {
      id: 3,
      title: "The Avengers",
      description: "Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMjMwMzM2MTg1M15BMl5BanBnXkFtZTcwNjM4ODY3Nw@@._V1_SX1777_CR0,0,1777,999_AL_.jpg",
    },
    {
      id: 4,
      title: "The Wolf of Wall Street",
      description: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgzMTg4MDI0Ml5BMl5BanBnXkFtZTgwOTY0MzQ4MDE@._V1_SY1000_CR0,0,1553,1000_AL_.jpg",
    },
    {
      id: 5,
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTg4Njk4MzY0Nl5BMl5BanBnXkFtZTgwMzIyODgxMzE@._V1_SX1500_CR0,0,1500,999_AL_.jpg",
    },
    {
      id: 6,
      title: "Game of Thrones",
      description: "While a civil war brews between several noble families in Westeros, the children of the former rulers of the land attempt to rise up to power. Meanwhile a forgotten race, bent on destruction, plans to return after thousands of years in the North.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BNDc1MGUyNzItNWRkOC00MjM1LWJjNjMtZTZlYWIxMGRmYzVlXkEyXkFqcGdeQXVyMzU3MDEyNjk@._V1_SX1777_CR0,0,1777,999_AL_.jpg",
    },
    {
      id: 7,
      title: "Breaking Bad",
      description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's financial future.",
      image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQ2NDkwNDk5NV5BMl5BanBnXkFtZTgwNDM0MTI2MDE@._V1_SY1000_CR0,0,1495,1000_AL_.jpg",
    }
  ];

  useEffect(() => {
    // Ensuring Swiper library is loaded before initializing
    const swiperScript = document.createElement("script");
    swiperScript.src = "https://unpkg.com/swiper@8/swiper-bundle.min.js";
    document.body.appendChild(swiperScript);

    swiperScript.onload = () => {
      if (window.Swiper && swiperRef.current) {
        new window.Swiper(swiperRef.current, {
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          speed: 1000,
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden relative">
      {/* Swiper CSS from CDN */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/swiper@8/swiper-bundle.min.css"
      />

      {/* Styles for Swiper and responsiveness */}
      <style jsx>{`
        .swiper-container {
          width: 100%;
          height: 100%;
        }
        .swiper-slide {
          position: relative;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          color: white;
          height: 100vh;
          transition: transform 1000ms ease;
          transform: scale(1.05);
        }
        .swiper-slide-active {
          transform: scale(1);
        }
        .swiper-slide::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7),
            transparent
          );
          z-index: 1;
        }
        .swiper-slide::after {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: 100%;
          bottom: 0;
          background: radial-gradient(
            circle at bottom,
            rgba(0, 0, 0, 0.9) 0%,
            transparent 70%
          );
          z-index: 1;
        }
        .swiper-pagination {
          bottom: 2rem !important;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
        .swiper-pagination-bullet {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          background-color: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 4px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 40px;
          background-color: #fff;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          opacity: 0.8;
          transition: opacity 0.3s ease;
          width: 44px;
          height: 44px;
          display: none;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          opacity: 1;
        }
        .content-container {
          position: absolute;
          left: 50%;
          bottom: 15%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 900px;
          text-align: center;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .button-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        /* Mobile-first approach for text and buttons */
        .content-container h1 {
          font-size: 2.25rem; /* base font size for h1 */
        }
        .content-container p {
          font-size: 1rem; /* base font size for p */
        }
        @media (max-width: 500px) {
          .button-group {
            flex-direction: column; /* Stack buttons on small phones */
          }
        }
        /* Tablet and larger */
        @media (min-width: 768px) {
          .content-container {
            left: 10%;
            transform: translateX(0);
            text-align: left;
            align-items: flex-start;
            bottom: 18%; /* Adjusted for better spacing on tablets */
          }
          .content-container h1 {
            font-size: 4rem;
          }
          .content-container p {
            font-size: 1.25rem;
          }
          .swiper-button-next,
          .swiper-button-prev {
            display: flex;
          }
          .button-group {
            flex-direction: row; /* Horizontal layout on tablets */
          }
        }
        /* Desktop */
        @media (min-width: 1024px) {
          .content-container {
            bottom: 22%; /* Higher for a more cinematic feel on large screens */
          }
          .content-container h1 {
            font-size: 5rem;
          }
          .content-container p {
            font-size: 1.5rem;
          }
        }
        /* Extra large desktop */
        @media (min-width: 1400px) {
          .content-container {
            bottom: 25%;
          }
          .content-container h1 {
            font-size: 6rem;
          }
        }
      `}</style>

      <div ref={swiperRef} className="swiper-container">
        <div className="swiper-wrapper">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="swiper-slide"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="content-container">
                <h1 className="font-extrabold mb-4 drop-shadow-lg text-shadow">
                  {slide.title}
                </h1>
                <p className="max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed drop-shadow-md text-shadow">
                  {slide.description}
                </p>
<div className="button-group">
  <button
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-tl-2xl rounded-br-2xl transition duration-300 transform hover:scale-105 shadow-lg"
    aria-label={`Watch ${slide.title} now`}
  >
    Watch Now
  </button>
  <button
    className="bg-transparent border-2 border-white hover:bg-white hover:text-red-600 text-white font-bold py-3 px-8 rounded-tl-full rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
    aria-label={`Watch ${slide.title} trailer`}
  >
    Watch Trailer
  </button>
</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="swiper-pagination"></div>
        {/* Navigation arrows */}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </div>
  );
};

export default Hero;