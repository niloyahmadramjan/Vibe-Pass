import React from 'react'

// Use Tailwind CSS classes for styling
// Note: Assumes Tailwind CSS is configured in your project
const LoadingSpinner = () => {
  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: '#200903' }}
    >
      <div className="relative flex justify-center items-center w-36 h-36">
        {/* Outer spinning ring with Tailwind classes and custom style */}
        <div
          className="absolute w-full h-full rounded-full animate-spin"
          style={{
            border: '8px solid transparent',
            borderTopColor: '#E21018' /* Vivid Red */,
            borderRightColor: '#731616' /* Deep Maroon */,
          }}
        ></div>
        {/* Inner VibePass text with custom styling */}
        <span
          className="font-bold text-2xl"
          style={{
            color: '#E57E81' /* Salmon Pink for a soft contrast */,
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        >
          VibePass
        </span>
      </div>
      {/* Custom keyframes for animation in CSS-in-JS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
