import React from 'react';

function AlertCard({ predictionData }) {
  if (!predictionData) return null;
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-400';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Current Alert Status</h3>
      </div>
      <div className="p-6">
        <div className={`mb-4 p-4 rounded-lg text-center font-bold text-lg ${predictionData.alert ? 'bg-red-600 text-white' : 'bg-green-500 text-white'}`}>
          {predictionData.alert ? 'ACTIVE ALERT' : 'No Active Alerts'}
        </div>
        
        <div className={`mb-5 p-4 rounded-lg text-center font-semibold ${getSeverityColor(predictionData.severity)} text-white`}>
          Threat Severity: {predictionData.severity}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
            <span className="font-medium text-gray-800 dark:text-white">{new Date(predictionData.timestamp).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Source IP:</span>
            <span className="font-medium text-gray-800 dark:text-white">{predictionData.source_ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Destination IP:</span>
            <span className="font-medium text-gray-800 dark:text-white">{predictionData.destination_ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Protocol:</span>
            <span className="font-medium text-gray-800 dark:text-white">{predictionData.protocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Predicted Class:</span>
            <span className="font-medium text-gray-800 dark:text-white">{predictionData.predicted_class}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;