'use client'

import { useState } from 'react'
import { RefreshCw, Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react'

interface Integration {
  id: number
  name: string
  type: 'API' | 'OAuth' | 'SAML' | 'Webhook'
  status: 'Active' | 'Inactive' | 'Error' | 'Pending'
  lastSync: string
  apiKey?: string
  endpoint: string
  description: string
  configurations: Record<string, string>
}

const IntegrationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 1,
      name: 'Slack Integration',
      type: 'OAuth',
      status: 'Active',
      lastSync: '2024-02-15 14:30:00',
      endpoint: 'https://api.slack.com/webhook',
      description: 'Slack notifications for resource updates',
      configurations: {
        workspace: 'company-workspace',
        channel: '#resources-updates'
      }
    },
    {
      id: 2,
      name: 'Google Calendar',
      type: 'OAuth',
      status: 'Active',
      lastSync: '2024-02-15 15:00:00',
      endpoint: 'https://calendar.google.com/api',
      description: 'Calendar sync for resource scheduling',
      configurations: {
        calendarId: 'primary',
        syncInterval: '15m'
      }
    },
    {
      id: 3,
      name: 'JIRA Integration',
      type: 'API',
      status: 'Error',
      lastSync: '2024-02-15 10:15:00',
      apiKey: '********-****-****-****-************',
      endpoint: 'https://your-domain.atlassian.net/rest/api',
      description: 'Project management integration',
      configurations: {
        projectKey: 'RES',
        issueType: 'Resource Request'
      }
    }
  ])

  const [formData, setFormData] = useState<Omit<Integration, 'id' | 'lastSync'>>({
    name: '',
    type: 'API',
    status: 'Pending',
    endpoint: '',
    description: '',
    configurations: {},
    apiKey: ''
  })

  const handleOpenModal = (integration?: Integration) => {
    if (integration) {
      setEditingIntegration(integration)
      const {  ...rest } = integration
      setFormData(rest)
    } else {
      setEditingIntegration(null)
      setFormData({
        name: '',
        type: 'API',
        status: 'Pending',
        endpoint: '',
        description: '',
        configurations: {},
        apiKey: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    if (editingIntegration) {
      setIntegrations(integrations.map(integration => 
        integration.id === editingIntegration.id 
          ? { ...formData, id: integration.id, lastSync: currentTime }
          : integration
      ))
    } else {
      const newIntegration = {
        ...formData,
        id: integrations.length + 1,
        lastSync: currentTime
      }
      setIntegrations([...integrations, newIntegration])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setIntegrations(integrations.filter(integration => integration.id !== id))
  }

  const handleSync = (id: number) => {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, lastSync: currentTime } : integration
    ))
  }

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      case 'Error':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleConfigChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      configurations: {
        ...prev.configurations,
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Integration Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search integrations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations
          .filter(integration => 
            integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            integration.type.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(integration => (
            <div key={integration.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSync(integration.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(integration)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(integration.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Endpoint:</span>
                    <p className="text-sm font-mono text-gray-900 mt-1 truncate">{integration.endpoint}</p>
                  </div>

                  {integration.apiKey && (
                    <div>
                      <span className="text-sm text-gray-500">API Key:</span>
                      <p className="text-sm font-mono text-gray-900 mt-1">{integration.apiKey}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-sm text-gray-500">Last Sync:</span>
                    <p className="text-sm text-gray-900 mt-1">{integration.lastSync}</p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Configurations:</span>
                    <div className="mt-1 space-y-1">
                      {Object.entries(integration.configurations).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {integration.status === 'Error' && (
                    <div className="mt-4 p-2 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Connection error. Please check configuration.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingIntegration ? 'Edit Integration' : 'Add New Integration'}
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
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Integration['type'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="API">API</option>
                  <option value="OAuth">OAuth</option>
                  <option value="SAML">SAML</option>
                  <option value="Webhook">Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Integration['status'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                <input
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              {formData.type === 'API' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Configurations</label>
                {Object.entries(formData.configurations).map(([key, value]) => (
                  <div key={key} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newConfigs = { ...formData.configurations }
                        delete newConfigs[key]
                        handleConfigChange(e.target.value, value)
                      }}
                      placeholder="Key"
                      className="mt-1 block w-1/2 rounded-md border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleConfigChange(key, e.target.value)}
                      placeholder="Value"
                      className="mt-1 block w-1/2 rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleConfigChange(`key${Object.keys(formData.configurations).length + 1}`, '')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Configuration
                </button>
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
                  {editingIntegration ? 'Save Changes' : 'Create Integration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntegrationsPage