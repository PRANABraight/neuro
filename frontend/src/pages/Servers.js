import React from 'react';
import { FiServer, FiCpu, FiHardDrive, FiWifi } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Servers() {
  const [loading, setLoading] = React.useState(false);
  
  // Example server data
  const servers = [
    {
      id: 1,
      name: "IDS-Server-01",
      ip: "192.168.1.100",
      status: "Online",
      cpu: 65,
      memory: 48,
      disk: 72,
      uptime: "45 days, 3 hours"
    },
    {
      id: 2,
      name: "IDS-Server-02",
      ip: "192.168.1.101",
      status: "Online",
      cpu: 32,
      memory: 25,
      disk: 58,
      uptime: "23 days, 12 hours"
    },
    {
      id: 3,
      name: "IDS-Backup-01",
      ip: "192.168.1.102",
      status: "Offline",
      cpu: 0,
      memory: 0,
      disk: 45,
      uptime: "0 days, 0 hours"
    }
  ];

  // Network devices being monitored
  const networkDevices = [
    {
      id: 1,
      name: "Main Router",
      ip: "192.168.1.1",
      type: "Router",
      status: "Online",
      location: "Server Room"
    },
    {
      id: 2,
      name: "Core Switch",
      ip: "192.168.1.2",
      type: "Switch",
      status: "Online",
      location: "Server Room"
    },
    {
      id: 3,
      name: "DMZ Firewall",
      ip: "192.168.2.1",
      type: "Firewall",
      status: "Online", 
      location: "DMZ"
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Online' ? 'text-green-500' : 'text-red-500';
  };

  const getUsageColor = (usage) => {
    if (usage > 80) return 'bg-red-600';
    if (usage > 60) return 'bg-orange-500';
    if (usage > 40) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Server Monitoring</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                <FiServer className="mr-2" /> IDS Servers
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Server</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CPU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Memory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Disk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uptime</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {servers.map(server => (
                    <tr key={server.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{server.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{server.ip}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                          {server.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                          <div className={`h-2.5 rounded-full ${getUsageColor(server.cpu)}`} style={{ width: `${server.cpu}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{server.cpu}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                          <div className={`h-2.5 rounded-full ${getUsageColor(server.memory)}`} style={{ width: `${server.memory}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{server.memory}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                          <div className={`h-2.5 rounded-full ${getUsageColor(server.disk)}`} style={{ width: `${server.disk}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{server.disk}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {server.uptime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                <FiWifi className="mr-2" /> Monitored Network Devices
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {networkDevices.map(device => (
                    <tr key={device.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{device.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Servers;