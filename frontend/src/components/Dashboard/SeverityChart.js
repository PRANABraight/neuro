import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function SeverityChart({ historicalData }) {
  // Generate chart data from historical alerts
  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    
    const severityCounts = historicalData.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
  }, [historicalData]);

  const SEVERITY_COLORS = {
    'Critical': '#dc2626',
    'High': '#f97316',
    'Medium': '#facc15',
    'Low': '#22c55e'
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b dark:border-gray-700">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Severity Distribution</h3>
        </div>
        <div className="p-6 flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Severity Distribution</h3>
      </div>
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SeverityChart;