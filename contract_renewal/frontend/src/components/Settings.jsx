import React, { useState } from 'react';
import { Settings as SettingsIcon, Link, Bell, User, Download, HelpCircle } from 'lucide-react';

const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [renewalReminders, setRenewalReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const integrations = [
    {
      name: 'Microsoft SharePoint',
      description: 'Sync contracts with SharePoint document library',
      status: 'Not Connected',
      statusColor: 'bg-red-100 text-red-700',
      icon: '🔵',
    },
   
  ];

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Configure your contract management preferences and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Third-Party Integrations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Link className="w-5 h-5 text-gray-400" />
            <h3 className="font-medium text-gray-900">Third-Party Integrations</h3>
          </div>
          
          <div className="space-y-4">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${integration.statusColor}`}>
                    {integration.status}
                  </span>
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-gray-400" />
            <h3 className="font-medium text-gray-900">Account Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization
              </label>
              <input
                type="text"
                value="Acme Corporation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>UTC-5 (EST)</option>
                <option>UTC-8 (PST)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>*/}
      </div> 

      {/* Notification Preferences */}
      {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-gray-900">Notification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Alerts</h4>
              <p className="text-sm text-gray-500">Receive email notifications for contract events</p>
            </div>
            <ToggleSwitch checked={emailAlerts} onChange={setEmailAlerts} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Slack Notifications</h4>
              <p className="text-sm text-gray-500">Send alerts to configured Slack channels</p>
            </div>
            <ToggleSwitch checked={slackNotifications} onChange={setSlackNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Renewal Reminders</h4>
              <p className="text-sm text-gray-500">Automatic reminders before contract expiration</p>
            </div>
            <ToggleSwitch checked={renewalReminders} onChange={setRenewalReminders} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Reports</h4>
              <p className="text-sm text-gray-500">Weekly summary of contract activities</p>
            </div>
            <ToggleSwitch checked={weeklyReports} onChange={setWeeklyReports} />
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Export */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Data Export</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Export All Contracts
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Export Settings
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Download Audit Log
            </button>
          </div>
        </div> */}

        {/* Support */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Support</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Contact Support
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Documentation
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Feature Requests
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Settings;