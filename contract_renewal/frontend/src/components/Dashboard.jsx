import React from 'react';
import { TrendingUp, AlertTriangle, RotateCcw, DollarSign, Download } from 'lucide-react';

// Helper to download data as a CSV file
const downloadCSV = (data, filename = 'export.csv') => {
  const csvContent = "data:text/csv;charset=utf-8," + data.map(row => Object.values(row).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Dashboard = ({ contracts }) => {
  // Helper to sort priorities
  const priorityOrder = { high: 1, medium: 2, low: 3, TBD: 4 };

  // Export report function
  const handleExport = () => {
    // Sort contracts by priority and then by end date
    const sortedContracts = [...contracts].sort((a, b) => {
      const pa = priorityOrder[(a.priority || 'TBD').toLowerCase()] || 4;
      const pb = priorityOrder[(b.priority || 'TBD').toLowerCase()] || 4;
      if (pa !== pb) return pa - pb;
      const da = new Date(a.ends);
      const db = new Date(b.ends);
      return da - db;
    });

    // Prepare data for CSV
    const csvData = [
      ['Company', 'Service', 'Category', 'Status', 'Priority', 'Ends', 'Value', 'Action'],
      ...sortedContracts.map(c => [
        c.company,
        c.service,
        c.category,
        c.status,
        c.priority,
        c.ends,
        c.value,
        c.action,
      ]),
    ];
    downloadCSV(csvData, `contracts-report-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Calculate total contract value
  const getTotalContractValue = () => {
    let total = 0;
    contracts.forEach((c) => {
      if (typeof c.value === 'string' && c.value.startsWith('$')) {
        const num = parseFloat(c.value.replace(/[$,]/g, ''));
        if (!isNaN(num)) total += num;
      }
    });
    return `$${total.toLocaleString()}`;
  };

  // Calculate total contracts count
  const getTotalContractsCount = () => contracts.length;

  // Calculate expiring soon contracts (within next 30 days)
  const getExpiringSoonCount = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison

    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30); // 30 days from the start of today

    return contracts.filter((c) => {
      if (!c.ends || c.ends === 'TBD') return false;
      const endDate = new Date(c.ends);
      if (isNaN(endDate.getTime())) return false; // Ignore invalid dates
      return endDate >= now && endDate < in30Days;
    }).length;
  };

  // Calculate renewed this month (X/Y)
  const getRenewedThisMonth = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    // Contracts expiring this month
    const expiringThisMonth = contracts.filter((c) => {
      if (!c.ends || c.ends === 'TBD') return false;
      const endDate = new Date(c.ends);
      return endDate.getMonth() === thisMonth && endDate.getFullYear() === thisYear;
    });
    // Of those, how many are renewed
    const renewed = expiringThisMonth.filter((c) => c.action && c.action.toLowerCase() === 'renew');
    return `${renewed.length}/${expiringThisMonth.length}`;
  };

  // Calculate renewal pipeline data (next 30, 60, 90 days)
  const getRenewalPipelineData = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison

    const buckets = [30, 60, 90];
    return buckets.map((days, idx) => {
      const startDays = idx === 0 ? 0 : buckets[idx - 1];
      const endDays = days;

      const contractsInBucket = contracts.filter((c) => {
        if (!c.ends || c.ends === 'TBD') return false;
        const endDate = new Date(c.ends);
        if (isNaN(endDate.getTime())) return false; // Ignore invalid dates

        // Calculate full day difference from start of today
        const diffDays = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
        
        // Buckets: [0-29], [30-59], [60-89]
        return diffDays >= startDays && diffDays < endDays;
      });
      const totalValue = contractsInBucket.reduce((sum, c) => {
        if (typeof c.value === 'string' && c.value.startsWith('$')) {
          const num = parseFloat(c.value.replace(/[$,]/g, ''));
          if (!isNaN(num)) return sum + num;
        }
        return sum;
      }, 0);
      return {
        name: `Next ${endDays} Days`,
        value: contractsInBucket.length,
        totalValue: `$${totalValue.toLocaleString()}`,
      };
    });
  };

  // Get top 3 contracts expiring soon
  const getUpcomingExpirations = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today

    return contracts
      .filter((c) => {
        if (!c.ends || c.ends === 'TBD') return false;
        const endDate = new Date(c.ends);
        if (isNaN(endDate.getTime())) return false;
        return endDate >= now; // Filter for contracts expiring from today onwards
      })
      .sort((a, b) => new Date(a.ends) - new Date(b.ends)) // Sort by soonest end date
      .slice(0, 3); // Get top 3
  };

  const upcomingExpirations = getUpcomingExpirations();
  const pipelineData = getRenewalPipelineData();

  const metrics = [
    {
      title: 'Total Contracts',
      value: getTotalContractsCount(),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-600',
    },
    {
      title: 'Expiring Soon',
      value: getExpiringSoonCount(),
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-yellow-600',
    },
    {
      title: 'Renewed This Month',
      value: getRenewedThisMonth(),
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'text-green-600',
    },
    {
      title: 'Contract Value',
      value: getTotalContractValue(),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contract Dashboard</h2>
          <p className="text-gray-600">Monitor and manage your contract portfolio</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-600">{metric.title}</h3>
          </div>
        ))}
      </div>

      {/* Renewal Pipeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">📈 Renewal Pipeline</h3>
          <span className="text-sm text-gray-500">{getTotalContractsCount()} contracts</span>
        </div>
        <div className="space-y-4">
          {pipelineData.map((item, index) => (
            <div key={index} className="flex items-center">
              {/* Left-aligned name */}
              <span className="text-sm text-gray-600 flex-1">{item.name}</span>

              {/* Centered pipeline */}
              <div className="flex flex-1 justify-center space-x-3 items-center">
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${getTotalContractsCount() ? (item.value / getTotalContractsCount()) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value} contracts</span>
              </div>

              {/* Cost section beside the progress bar */}
              <div className="flex-1 flex justify-end">
                <span className="text-sm text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  Total Value: {item.totalValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Expirations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Top 3 Upcoming Expirations</h3>
        <ul className="divide-y divide-gray-200">
          {upcomingExpirations.length === 0 && (
            <li className="py-2 text-gray-500">No upcoming expirations found.</li>
          )}
          {upcomingExpirations.map((c, idx) => (
            <li key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <span className="font-medium text-gray-900">{c.company}</span>
                <p className="text-sm text-gray-500">{c.service}</p>
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span className="text-sm px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                  Ends: {c.ends}
                </span>
                <span className={`text-sm font-medium ${c.action === 'Renew' ? 'text-green-600' : 'text-red-600'}`}>
                  {c.action}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;