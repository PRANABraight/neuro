import React, { useState } from 'react';
import useIdsData from '../hooks/useIdsData';
import HistoricalTable from '../components/Dashboard/HistoricalTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { FiFilter, FiDownload, FiRefreshCw, FiCalendar } from 'react-icons/fi';

function Alerts() {
  const { historicalData, loading, error, fetchData } = useIdsData();
  const [filters, setFilters] = useState({
    severity: 'all',
    dateRange: {
      start: '',
      end: ''
    },
    sourceIp: '',
    destinationIp: ''
  });
  
  // Filter data based on selected filters
  const filteredData = historicalData.filter(alert => {
    // Filter by severity
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    
    // Filter by source IP
    if (filters.sourceIp && !alert.source_ip.includes(filters.sourceIp)) return false;
    
    // Filter by destination IP
    if (filters.destinationIp && !alert.destination_ip.includes(filters.destinationIp)) return false;
    
    // Filter by date range (if implemented)
    // Add date range filtering logic here
    
    return true;
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      severity: 'all',
      dateRange: {
        start: '',
        end: ''
      },
      sourceIp: '',
      destinationIp: ''
    });
  };
  
  const exportData = () => {
    // Create CSV content from filtered data
    const csvHeader = 'Timestamp,Source IP,Destination IP,Protocol,Severity,Alert\n';
    const csvRows = filteredData.map(alert => 
      `${alert.timestamp},${alert.source_ip},${alert.destination_ip},${alert.protocol},${alert.severity},${alert.alert}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ids_alerts_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      {error && <ErrorDisplay error={error} retry={fetchData} />}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Alert Management</h3>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchData} 
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Refresh alerts"
            >
              <FiRefreshCw size={18} />
            </button>
            <button 
              onClick={exportData}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Export to CSV"
            >
              <FiDownload size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                name="severity"
                value={filters.severity}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source IP
              </label>
              <input
                type="text"
                name="sourceIp"
                value={filters.sourceIp}
                onChange={handleFilterChange}
                placeholder="e.g., 192.168.1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination IP
              </label>
              <input
                type="text"
                name="destinationIp"
                value={filters.destinationIp}
                onChange={handleFilterChange}
                placeholder="e.g., 10.0.0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex-1 min-w-[200px] flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center"
              >
                <FiFilter className="mr-2" /> Reset Filters
              </button>
            </div>
          </div>
          
          {loading ? <LoadingSpinner /> : (
            <>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Displaying {filteredData.length} alerts {filters.severity !== 'all' ? `with ${filters.severity} severity` : ''}
              </div>
              <HistoricalTable data={filteredData} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Alerts;