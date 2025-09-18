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
        {/* Main spinning container with a single ring that rotates */}
        <div
          className="absolute w-full h-full rounded-full flex justify-center items-center"
          style={{
            // Creating the outer ring using borders and a hole in the middle
            border: '8px solid transparent',
            borderTopColor:
              '#E21018' /* Vivid Red for the main spinning color */,
            borderRightColor: '#E21018',
            animation: 'spin-circle 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }}
        >
          {/* The inner circle to create a hole in the spinner */}
          <div
            className="w-24 h-24 rounded-full absolute"
            style={{
              backgroundColor:
                '#200903' /* This color matches the background to create a hole effect */,
            }}
          ></div>
        </div>
        {/* The 'V' icon that remains stationary in the center */}
        <span
          className="absolute font-bold text-5xl"
          style={{
            color: '#E57E81' /* Salmon Pink */,
            animation: 'pulse-v 1.5s infinite ease-in-out',
          }}
        >
          V
        </span>
      </div>
      {/* Custom keyframes for animation */}
      <style>{`
        @keyframes spin-circle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-v {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
