import React from 'react';

function ProbabilitiesCard({ predictionData }) {
  if (!predictionData || !predictionData.probabilities) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Class Probabilities</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {predictionData.probabilities.map((prob, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class {index} {index === predictionData.predicted_class && "(Predicted)"}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(prob * 100).toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${prob * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProbabilitiesCard;