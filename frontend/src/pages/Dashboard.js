import React from 'react';
import useIdsData from '../hooks/useIdsData';
import AlertCard from '../components/Dashboard/AlertCard';
import SeverityChart from '../components/Dashboard/SeverityChart';
import ProbabilitiesCard from '../components/Dashboard/ProbabilitiesCard';
import HistoricalTable from '../components/Dashboard/HistoricalTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';

function Dashboard() {
  const { predictionData, historicalData, loading, error, fetchData } = useIdsData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {error && (
        <ErrorDisplay 
          error={error} 
          retry={fetchData} 
          className="mb-6" 
        />
      )}
      
      {loading && !predictionData && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      )}
      
      {predictionData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AlertCard predictionData={predictionData} />
          <SeverityChart historicalData={historicalData} />
          <ProbabilitiesCard predictionData={predictionData} />
          <div className="md:col-span-2">
            <HistoricalTable data={historicalData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
