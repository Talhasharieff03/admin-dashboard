'use client'

import { useState } from 'react'
import { Key, RefreshCw, Plus, Edit2, Trash2, Search } from 'lucide-react'

interface APIConfig {
  id: number
  name: string
  key: string
  status: 'Active' | 'Inactive' | 'Expired'
  permissions: string[]
  rateLimit: number
  expiryDate: string
  ipWhitelist: string[]
  lastUsed: string
  environment: 'Production' | 'Development' | 'Testing'
  description?: string
}

export default function APISettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAPI, setEditingAPI] = useState<APIConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [apiKeys, setApiKeys] = useState<APIConfig[]>([
    {
      id: 1,
      name: 'Production API Key',
      key: 'prod_****************************************',
      status: 'Active',
      permissions: ['read', 'write', 'delete'],
      rateLimit: 1000,
      expiryDate: '2025-02-15',
      ipWhitelist: ['192.168.1.1', '10.0.0.1'],
      lastUsed: '2024-02-15 16:30:00',
      environment: 'Production',
      description: 'Main production API key for resource management'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'dev_*****************************************',
      status: 'Active',
      permissions: ['read', 'write'],
      rateLimit: 500,
      expiryDate: '2024-08-15',
      ipWhitelist: ['192.168.1.*'],
      lastUsed: '2024-02-15 15:45:00',
      environment: 'Development',
      description: 'Development environment API key'
    },
    {
      id: 3,
      name: 'Testing API Key',
      key: 'test_****************************************',
      status: 'Inactive',
      permissions: ['read'],
      rateLimit: 100,
      expiryDate: '2024-12-31',
      ipWhitelist: ['*'],
      lastUsed: '2024-02-14 09:20:00',
      environment: 'Testing',
      description: 'Testing and integration API key'
    }
  ])

  const [formData, setFormData] = useState<Omit<APIConfig, 'id' | 'lastUsed'>>({
    name: '',
    key: '',
    status: 'Active',
    permissions: [],
    rateLimit: 1000,
    expiryDate: '',
    ipWhitelist: [],
    environment: 'Development',
    description: ''
  })

  const handleOpenModal = (apiConfig?: APIConfig) => {
    if (apiConfig) {
      setEditingAPI(apiConfig)
      const {  ...rest } = apiConfig
      setFormData(rest)
    } else {
      setEditingAPI(null)
      setFormData({
        name: '',
        key: `key_${Math.random().toString(36).substr(2, 9)}`,
        status: 'Active',
        permissions: [],
        rateLimit: 1000,
        expiryDate: '',
        ipWhitelist: [],
        environment: 'Development',
        description: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    if (editingAPI) {
      setApiKeys(apiKeys.map(api => 
        api.id === editingAPI.id 
          ? { ...formData, id: api.id, lastUsed: api.lastUsed }
          : api
      ))
    } else {
      const newAPI = {
        ...formData,
        id: apiKeys.length + 1,
        lastUsed: currentTime
      }
      setApiKeys([...apiKeys, newAPI])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setApiKeys(apiKeys.filter(api => api.id !== id))
  }

  const regenerateKey = (id: number) => {
    const newKey = `key_${Math.random().toString(36).substr(2, 9)}`
    setApiKeys(apiKeys.map(api =>
      api.id === id ? { ...api, key: newKey } : api
    ))
  }

  const getStatusColor = (status: APIConfig['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEnvironmentColor = (environment: APIConfig['environment']) => {
    switch (environment) {
      case 'Production':
        return 'bg-purple-100 text-purple-800'
      case 'Development':
        return 'bg-blue-100 text-blue-800'
      case 'Testing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">API Settings</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Generate New API Key
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search API keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      {/* API Keys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiKeys
          .filter(api => 
            api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            api.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(api => (
            <div key={api.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Key className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnvironmentColor(api.environment)}`}>
                        {api.environment}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => regenerateKey(api.id)}
                      className="text-gray-400 hover:text-blue-500"
                      title="Regenerate Key"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(api)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(api.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {api.description && (
                    <p className="text-sm text-gray-600">{api.description}</p>
                  )}

                  <div>
                    <span className="text-sm text-gray-500">API Key:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">{api.key}</code>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(api.status)}`}>
                      {api.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Permissions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {api.permissions.map(permission => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Rate Limit</span>
                    <span className="text-sm font-medium text-gray-900">{api.rateLimit} requests/hour</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Expiry Date</span>
                    <span className="text-sm font-medium text-gray-900">{api.expiryDate}</span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">IP Whitelist:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {api.ipWhitelist.map(ip => (
                        <span
                          key={ip}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {ip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Used</span>
                    <span className="text-sm font-medium text-gray-900">{api.lastUsed}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingAPI ? 'Edit API Key' : 'Generate New API Key'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Environment</label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value as APIConfig['environment'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Production">Production</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as APIConfig['status'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Permissions</label>
                <div className="mt-2 space-y-2">
                  {['read', 'write', 'delete'].map(permission => (
                    <label key={permission} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...formData.permissions, permission]
                            : formData.permissions.filter(p => p !== permission)
                          setFormData({ ...formData, permissions: newPermissions })
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  value={formData.rateLimit}
                  onChange={(e) => setFormData({ ...formData, rateLimit: parseInt(e.target.value) })}
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">IP Whitelist (comma-separated)</label>
                <input
                  type="text"
                  value={formData.ipWhitelist.join(', ')}
                  onChange={(e) => setFormData({ ...formData, ipWhitelist: e.target.value.split(',').map(ip => ip.trim()) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="e.g., 192.168.1.1, 10.0.0.*"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingAPI ? 'Save Changes' : 'Generate Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}