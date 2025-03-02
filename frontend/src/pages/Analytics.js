import React, { useMemo } from 'react';
import useIdsData from '../hooks/useIdsData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const { historicalData, loading, error, fetchData } = useIdsData();
  
  // Process data for charts
  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return {};
    
    // Severity distribution data
    const severityDistribution = historicalData.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {});
    
    const severityChartData = Object.entries(severityDistribution).map(([name, value]) => ({
      name,
      value
    }));
    
    // Protocol distribution data
    const protocolDistribution = historicalData.reduce((acc, item) => {
      acc[item.protocol] = (acc[item.protocol] || 0) + 1;
      return acc;
    }, {});
    
    const protocolChartData = Object.entries(protocolDistribution).map(([name, value]) => ({
      name,
      value
    }));
    
    // Alert trend data (by timestamp)
    const alertTrend = historicalData.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      severity: item.severity === 'Critical' ? 4 : 
               item.severity === 'High' ? 3 : 
               item.severity === 'Medium' ? 2 : 1
    }));
    
    return {
      severityChartData,
      protocolChartData,
      alertTrend
    };
  }, [historicalData]);
  
  // Colors for the charts
  const SEVERITY_COLORS = {
    'Critical': '#dc2626',
    'High': '#f97316',
    'Medium': '#facc15',
    'Low': '#22c55e'
  };
  
  const PROTOCOL_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16'];
  
  return (
    <>
      {error && <ErrorDisplay error={error} retry={fetchData} />}
      
      {loading && !historicalData.length && <LoadingSpinner />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Alert Severity Distribution</h3>
          </div>
          <div className="p-6 h-80">
            {chartData.severityChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.severityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.severityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
        
        {/* Protocol Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Protocol Distribution</h3>
          </div>
          <div className="p-6 h-80">
            {chartData.protocolChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.protocolChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count">
                    {chartData.protocolChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PROTOCOL_COLORS[index % PROTOCOL_COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
        
        {/* Alert Trend Over Time */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Alert Severity Trend</h3>
          </div>
          <div className="p-6 h-80">
            {chartData.alertTrend && chartData.alertTrend.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData.alertTrend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[1, 2, 3, 4]} 
                    tickFormatter={(value) => {
                      return value === 1 ? 'Low' : 
                             value === 2 ? 'Medium' : 
                             value === 3 ? 'High' : 
                             value === 4 ? 'Critical' : '';
                    }}
                  />
                  <Tooltip
                    formatter={(value) => {
                      return value === 1 ? 'Low' : 
                             value === 2 ? 'Medium' : 
                             value === 3 ? 'High' : 
                             value === 4 ? 'Critical' : '';
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="severity" 
                    name="Severity Level" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Not enough data for trend analysis
              </div>
            )}
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Alert Summary Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Critical Alerts */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                <h4 className="text-red-800 dark:text-red-300 text-sm font-medium">Critical Alerts</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                  {historicalData?.filter(item => item.severity === 'Critical').length || 0}
                </p>
              </div>
              
              {/* High Alerts */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <h4 className="text-orange-800 dark:text-orange-300 text-sm font-medium">High Alerts</h4>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {historicalData?.filter(item => item.severity === 'High').length || 0}
                </p>
              </div>
              
              {/* Medium Alerts */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <h4 className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">Medium Alerts</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                  {historicalData?.filter(item => item.severity === 'Medium').length || 0}
                </p>
              </div>
              
              {/* Low Alerts */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <h4 className="text-green-800 dark:text-green-300 text-sm font-medium">Low Alerts</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {historicalData?.filter(item => item.severity === 'Low').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;