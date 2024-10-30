'use client'

import { useState } from 'react'
import { Shield, Lock, Key, Users, AlertTriangle, Save, RefreshCw } from 'lucide-react'

interface SecuritySetting {
  id: string
  category: 'Authentication' | 'Access Control' | 'Data Protection' | 'Monitoring'
  name: string
  description: string
  value: boolean | string | number
  type: 'toggle' | 'select' | 'number' | 'text'
  options?: string[]
  impact: 'High' | 'Medium' | 'Low'
  lastModified: string
  modifiedBy: string
}

const SecuritySettingsPage = () => {
  const [hasChanges, setHasChanges] = useState(false)
  const [settings, setSettings] = useState<SecuritySetting[]>([
    {
      id: 'mfa',
      category: 'Authentication',
      name: 'Multi-Factor Authentication',
      description: 'Require two-factor authentication for all users',
      value: true,
      type: 'toggle',
      impact: 'High',
      lastModified: '2024-02-15',
      modifiedBy: 'System Admin'
    },
    {
      id: 'password_policy',
      category: 'Authentication',
      name: 'Password Policy',
      description: 'Minimum password requirements',
      value: 'strong',
      type: 'select',
      options: ['basic', 'medium', 'strong', 'custom'],
      impact: 'High',
      lastModified: '2024-02-14',
      modifiedBy: 'Security Officer'
    },
    {
      id: 'session_timeout',
      category: 'Access Control',
      name: 'Session Timeout',
      description: 'Automatic logout after inactivity (minutes)',
      value: 30,
      type: 'number',
      impact: 'Medium',
      lastModified: '2024-02-13',
      modifiedBy: 'System Admin'
    },
    {
      id: 'ip_whitelist',
      category: 'Access Control',
      name: 'IP Whitelist',
      description: 'Allowed IP addresses for system access',
      value: '192.168.1.*, 10.0.0.*',
      type: 'text',
      impact: 'High',
      lastModified: '2024-02-12',
      modifiedBy: 'Security Officer'
    },
    {
      id: 'data_encryption',
      category: 'Data Protection',
      name: 'Data Encryption',
      description: 'Enable end-to-end encryption for sensitive data',
      value: true,
      type: 'toggle',
      impact: 'High',
      lastModified: '2024-02-11',
      modifiedBy: 'System Admin'
    },
    {
      id: 'audit_logging',
      category: 'Monitoring',
      name: 'Audit Logging',
      description: 'Enable detailed activity logging',
      value: true,
      type: 'toggle',
      impact: 'Medium',
      lastModified: '2024-02-10',
      modifiedBy: 'Security Officer'
    }
  ])

  const handleChange = (id: string, newValue: boolean | string | number) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { 
            ...setting, 
            value: newValue,
            lastModified: new Date().toISOString().split('T')[0],
            modifiedBy: 'Current User'
          }
        : setting
    ))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Implementation for saving security settings
    console.log('Saving security settings...')
    setHasChanges(false)
  }

  const getImpactColor = (impact: SecuritySetting['impact']) => {
    switch (impact) {
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

  const getCategoryIcon = (category: SecuritySetting['category']) => {
    switch (category) {
      case 'Authentication':
        return <Key className="w-5 h-5" />
      case 'Access Control':
        return <Users className="w-5 h-5" />
      case 'Data Protection':
        return <Shield className="w-5 h-5" />
      case 'Monitoring':
        return <RefreshCw className="w-5 h-5" />
      default:
        return <Lock className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(settings.reduce((acc, setting) => ({
          ...acc,
          [setting.category]: [...(acc[setting.category] || []), setting]
        }), {} as Record<SecuritySetting['category'], SecuritySetting[]>)).map((categorySettings, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(categorySettings[0].category)}
                <h2 className="text-lg font-semibold text-gray-900">{categorySettings[0].category}</h2>
              </div>

              <div className="space-y-6">
                {categorySettings.map(setting => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <span className={`text-xs font-medium ${getImpactColor(setting.impact)}`}>
                        {setting.impact} Impact
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {setting.type === 'toggle' && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value as boolean}
                            onChange={(e) => handleChange(setting.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}

                      {setting.type === 'select' && (
                        <select
                          value={setting.value as string}
                          onChange={(e) => handleChange(setting.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          {setting.options?.map(option => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      )}

                      {setting.type === 'number' && (
                        <input
                          type="number"
                          value={setting.value as number}
                          onChange={(e) => handleChange(setting.id, parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      )}

                      {setting.type === 'text' && (
                        <input
                          type="text"
                          value={setting.value as string}
                          onChange={(e) => handleChange(setting.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Last modified: {setting.lastModified}</span>
                      <span>By: {setting.modifiedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md flex items-center gap-2 shadow-lg">
          <AlertTriangle className="w-4 h-4" />
          You have unsaved changes
        </div>
      )}
    </div>
  )
}

export default SecuritySettingsPage