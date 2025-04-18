import React from 'react';

const ProgressCard = ({
  progress,
  title,
  description,
  onDetailsClick,
}) => {
  // Calculate the circle's circumference and stroke-dasharray
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm flex flex-col items-center space-y-4">
      {/* Circular Progress */}
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="stroke-gray-200 dark:stroke-gray-700 fill-none"
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            className="stroke-blue-500 fill-none transition-all duration-300 ease-in-out"
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {progress}%
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {description}
      </p>

      {/* Details Button */}
      <button
        onClick={onDetailsClick}
        className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
      >
        More Details
      </button>
    </div>
  );
};

export default ProgressCard; 