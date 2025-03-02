import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

function ErrorDisplay({ error, retry }) {
  return (
    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
      <div className="flex items-center">
        <FiAlertCircle className="text-red-500 mr-3" size={24} />
        <div>
          <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
          {retry && (
            <button 
              onClick={retry}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;