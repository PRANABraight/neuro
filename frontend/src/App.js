import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Servers from './pages/Servers';
import Settings from './pages/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const switchView = (view) => {
    setCurrentView(view);
  };

  return (
    <ThemeProvider>
      <DashboardLayout currentView={currentView} switchView={switchView}>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'alerts' && <Alerts />}
        {currentView === 'servers' && <Servers />}
        {currentView === 'settings' && <Settings />}
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;