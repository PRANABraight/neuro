import React, { useState, useContext } from 'react';
import Sidebar from '../Navigation/Sidebar';
import Header from '../Navigation/Header';
import { ThemeContext } from '../../context/ThemeContext';

function DashboardLayout({ children, currentView, switchView }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  
  // Remove the local currentView state since it's coming from props now
  // const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        currentView={currentView}
        switchView={switchView} // Pass the switchView function from props
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
        
        <footer className="bg-white dark:bg-gray-800 p-4 shadow-inner text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;