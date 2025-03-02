import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
      <span className="ml-3 text-gray-700 dark:text-gray-300">Loading data...</span>
    </div>
  );
}

export default LoadingSpinner;