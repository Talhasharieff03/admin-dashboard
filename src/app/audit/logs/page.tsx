'use client'

import { useState } from 'react'
import { Search, Filter, Download, Clock, User, Activity } from 'lucide-react'

interface ActivityLog {
  id: number
  action: string
  userEmail: string
  userRole: string
  timestamp: string
  ipAddress: string
  module: string
  details: string
  status: 'Success' | 'Failed' | 'Warning'
  metadata?: Record<string, any>
}

const ActivityLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModule, setFilterModule] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: 1,
      action: 'User Login',
      userEmail: 'john.doe@example.com',
      userRole: 'Admin',
      timestamp: '2024-02-15 14:30:00',
      ipAddress: '192.168.1.1',
      module: 'Authentication',
      details: 'Successful login attempt',
      status: 'Success',
      metadata: {
        browser: 'Chrome',
        platform: 'Windows'
      }
    },
    {
      id: 2,
      action: 'Resource Modified',
      userEmail: 'jane.smith@example.com',
      userRole: 'Manager',
      timestamp: '2024-02-15 15:45:00',
      ipAddress: '192.168.1.2',
      module: 'Resource Management',
      details: 'Updated resource allocation for Project A',
      status: 'Success',
      metadata: {
        resourceId: 'RES-001',
        changes: ['status', 'assignee']
      }
    },
    {
      id: 3,
      action: 'Failed Login Attempt',
      userEmail: 'unknown@example.com',
      userRole: 'Unknown',
      timestamp: '2024-02-15 16:20:00',
      ipAddress: '192.168.1.3',
      module: 'Authentication',
      details: 'Invalid credentials provided',
      status: 'Failed',
      metadata: {
        attemptCount: 3,
        browser: 'Firefox'
      }
    },
    {
      id: 4,
      action: 'Configuration Change',
      userEmail: 'admin@example.com',
      userRole: 'System Admin',
      timestamp: '2024-02-15 17:10:00',
      ipAddress: '192.168.1.4',
      module: 'System Settings',
      details: 'Modified email notification settings',
      status: 'Warning',
      metadata: {
        settingType: 'Notifications',
        changes: ['frequency', 'recipients']
      }
    }
  ])

  const getStatusColor = (status: ActivityLog['status']) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExport = () => {
    // Implementation for exporting logs
    const filteredLogs = logs
      .filter(log => 
        (filterModule === 'all' || log.module === filterModule) &&
        (filterStatus === 'all' || log.status === filterStatus) &&
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const csv = [
      ['ID', 'Action', 'User', 'Role', 'Timestamp', 'IP Address', 'Module', 'Details', 'Status'],
      ...filteredLogs.map(log => [
        log.id,
        log.action,
        log.userEmail,
        log.userRole,
        log.timestamp,
        log.ipAddress,
        log.module,
        log.details,
        log.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const uniqueModules = Array.from(new Set(logs.map(log => log.module)))

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Modules</option>
            {uniqueModules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Warning">Warning</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-1/2 border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-1/2 border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs
                .filter(log => 
                  (filterModule === 'all' || log.module === filterModule) &&
                  (filterStatus === 'all' || log.status === filterStatus) &&
                  (log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   log.details.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.userEmail}</div>
                          <div className="text-sm text-gray-500">{log.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate">
                        {log.details}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogsPage