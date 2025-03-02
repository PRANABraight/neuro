import React from 'react';
import { FiHome, FiPieChart, FiAlertCircle, FiServer, FiSettings, FiX } from 'react-icons/fi';

function Sidebar({ isOpen, setIsOpen, currentView, switchView }) {
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative md:translate-x-0 z-30 w-64 h-screen transition-transform duration-300 transform bg-white dark:bg-gray-800 shadow-lg`}>
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">IDS Dashboard</h2>
        <button 
          className="p-2 rounded-md md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
          onClick={() => setIsOpen(false)}
        >
          <FiX size={20} />
        </button>
      </div>
      
      <nav className="mt-5 px-2 space-y-1">
        <button 
          onClick={() => switchView('dashboard')} 
          className={`flex items-center w-full px-4 py-2 rounded-md ${currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <FiHome className="mr-3" size={18} />
          Dashboard
        </button>
        <button 
          onClick={() => switchView('analytics')} 
          className={`flex items-center w-full px-4 py-2 rounded-md ${currentView === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <FiPieChart className="mr-3" size={18} />
          Analytics
        </button>
        <button 
          onClick={() => switchView('alerts')} 
          className={`flex items-center w-full px-4 py-2 rounded-md ${currentView === 'alerts' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <FiAlertCircle className="mr-3" size={18} />
          Alerts
        </button>
        <button 
          onClick={() => switchView('servers')} 
          className={`flex items-center w-full px-4 py-2 rounded-md ${currentView === 'servers' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <FiServer className="mr-3" size={18} />
          Servers
        </button>
        <button 
          onClick={() => switchView('settings')} 
          className={`flex items-center w-full px-4 py-2 rounded-md ${currentView === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <FiSettings className="mr-3" size={18} />
          Settings
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;