import React, { useState, useContext } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';

function Settings() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    system: {
      pollingFrequency: 10,
      retentionDays: 30,
      enableNotifications: true,
      logLevel: 'info'
    },
    alertThresholds: {
      lowThreshold: 0.3,
      mediumThreshold: 0.5,
      highThreshold: 0.7,
      criticalThreshold: 0.9
    },
    apiSettings: {
      baseUrl: 'http://127.0.0.1:5000',
      timeout: 5000,
      retryAttempts: 3
    },
    userPreferences: {
      defaultView: 'dashboard',
      theme: darkMode ? 'dark' : 'light',
      tablePageSize: 10
    }
  });
  
  // Handle form change
  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  // Handle theme change
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setSettings(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        theme: newTheme
      }
    }));
    
    if ((newTheme === 'dark' && !darkMode) || (newTheme === 'light' && darkMode)) {
      toggleDarkMode();
    }
  };
  
  // Save settings
  const saveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };
  
  // Test API connection
  const testConnection = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Connection successful to ' + settings.apiSettings.baseUrl);
    }, 1000);
  };
  
  return (
    <>
      {/* Success message */}
      {isSaved && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiRefreshCw className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">System Settings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Polling Frequency (seconds)
                </label>
                <input
                  type="number"
                  value={settings.system.pollingFrequency}
                  onChange={(e) => handleSettingChange('system', 'pollingFrequency', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="5"
                  max="60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Retention (days)
                </label>
                <input
                  type="number"
                  value={settings.system.retentionDays}
                  onChange={(e) => handleSettingChange('system', 'retentionDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="90"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Log Level
                </label>
                <select
                  value={settings.system.logLevel}
                  onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="enable-notifications"
                  type="checkbox"
                  checked={settings.system.enableNotifications}
                  onChange={(e) => handleSettingChange('system', 'enableNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Desktop Notifications
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alert Thresholds */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Alert Thresholds</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Configure the probability thresholds for different severity levels.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Low Severity Threshold
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.alertThresholds.lowThreshold}
                    onChange={(e) => handleSettingChange('alertThresholds', 'lowThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 w-12">
                    {settings.alertThresholds.lowThreshold.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medium Severity Threshold
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.alertThresholds.mediumThreshold}
                    onChange={(e) => handleSettingChange('alertThresholds', 'mediumThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 w-12">
                    {settings.alertThresholds.mediumThreshold.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  High Severity Threshold
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.alertThresholds.highThreshold}
                    onChange={(e) => handleSettingChange('alertThresholds', 'highThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 w-12">
                    {settings.alertThresholds.highThreshold.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Critical Severity Threshold
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.alertThresholds.criticalThreshold}
                    onChange={(e) => handleSettingChange('alertThresholds', 'criticalThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 w-12">
                    {settings.alertThresholds.criticalThreshold.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* API Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">API Connection</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={settings.apiSettings.baseUrl}
                  onChange={(e) => handleSettingChange('apiSettings', 'baseUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Request Timeout (ms)
                </label>
                <input
                  type="number"
                  value={settings.apiSettings.timeout}
                  onChange={(e) => handleSettingChange('apiSettings', 'timeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1000"
                  step="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  value={settings.apiSettings.retryAttempts}
                  onChange={(e) => handleSettingChange('apiSettings', 'retryAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="5"
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={testConnection}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">User Preferences</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default View
                </label>
                <select
                  value={settings.userPreferences.defaultView}
                  onChange={(e) => handleSettingChange('userPreferences', 'defaultView', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="analytics">Analytics</option>
                  <option value="alerts">Alerts</option>
                  <option value="servers">Servers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme
                </label>
                <select
                  value={settings.userPreferences.theme}
                  onChange={handleThemeChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Table Page Size
                </label>
                <select
                  value={settings.userPreferences.tablePageSize}
                  onChange={(e) => handleSettingChange('userPreferences', 'tablePageSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
        >
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </>
  );
}

export default Settings;