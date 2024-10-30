'use client'

import { useState } from 'react'
import { Database, Trash2, Download, Upload, Filter, Search, AlertCircle, Archive, RefreshCw } from 'lucide-react'

interface DataRecord {
  id: number
  type: 'Personal' | 'Financial' | 'Operational' | 'System'
  category: string
  retention: string
  size: string
  lastAccessed: string
  status: 'Active' | 'Archived' | 'Pending Deletion'
  sensitivity: 'High' | 'Medium' | 'Low'
  owner: string
  location: string
  backupStatus: 'Current' | 'Pending' | 'Failed'
  encryptionStatus: boolean
}

const DataManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null)

  const [records, setRecords] = useState<DataRecord[]>([
    {
      id: 1,
      type: 'Personal',
      category: 'Employee Data',
      retention: '7 years',
      size: '2.5 GB',
      lastAccessed: '2024-02-15',
      status: 'Active',
      sensitivity: 'High',
      owner: 'HR Department',
      location: 'Main Database',
      backupStatus: 'Current',
      encryptionStatus: true
    },
    {
      id: 2,
      type: 'Financial',
      category: 'Transaction Records',
      retention: '10 years',
      size: '5.8 GB',
      lastAccessed: '2024-02-14',
      status: 'Active',
      sensitivity: 'High',
      owner: 'Finance Team',
      location: 'Secure Storage',
      backupStatus: 'Current',
      encryptionStatus: true
    },
    {
      id: 3,
      type: 'Operational',
      category: 'Resource Logs',
      retention: '3 years',
      size: '1.2 GB',
      lastAccessed: '2024-02-13',
      status: 'Archived',
      sensitivity: 'Medium',
      owner: 'Operations',
      location: 'Archive Storage',
      backupStatus: 'Current',
      encryptionStatus: true
    },
    {
      id: 4,
      type: 'System',
      category: 'Application Logs',
      retention: '1 year',
      size: '800 MB',
      lastAccessed: '2024-02-12',
      status: 'Pending Deletion',
      sensitivity: 'Low',
      owner: 'System Admin',
      location: 'Log Server',
      backupStatus: 'Failed',
      encryptionStatus: false
    }
  ])

  const handleDelete = (record: DataRecord) => {
    setSelectedRecord(record)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (selectedRecord) {
      setRecords(records.filter(r => r.id !== selectedRecord.id))
      setShowDeleteConfirm(false)
      setSelectedRecord(null)
    }
  }

  const handleArchive = (id: number) => {
    setRecords(records.map(record =>
      record.id === id ? { ...record, status: 'Archived' } : record
    ))
  }

  const handleBackup = (id: number) => {
    setRecords(records.map(record =>
      record.id === id ? { ...record, backupStatus: 'Current' } : record
    ))
  }

  const getStatusColor = (status: DataRecord['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Archived':
        return 'bg-blue-100 text-blue-800'
      case 'Pending Deletion':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSensitivityColor = (sensitivity: DataRecord['sensitivity']) => {
    switch (sensitivity) {
      case 'High':
        return 'text-red-600'
      case 'Medium':
        return 'text-yellow-600'
      case 'Low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="Personal">Personal</option>
            <option value="Financial">Financial</option>
            <option value="Operational">Operational</option>
            <option value="System">System</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
            <option value="Pending Deletion">Pending Deletion</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensitivity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records
                .filter(record => 
                  (filterType === 'all' || record.type === filterType) &&
                  (filterStatus === 'all' || record.status === filterStatus) &&
                  (record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   record.owner.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        <span className="text-sm text-gray-900">{record.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.category}</div>
                      <div className="text-sm text-gray-500">{record.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getSensitivityColor(record.sensitivity)}`}>
                        {record.sensitivity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.lastAccessed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          record.backupStatus === 'Current' ? 'bg-green-100 text-green-800' :
                          record.backupStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.backupStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleArchive(record.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleBackup(record.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete {selectedRecord.category}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataManagementPage