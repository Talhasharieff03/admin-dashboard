'use client'

import { useState } from 'react'
import { Bell, Clock, Plus, Edit2, Trash2, Search } from 'lucide-react'

interface NotificationConfig {
  id: number
  type: string
  channel: 'Email' | 'SMS' | 'In-App' | 'Push'
  frequency: 'Immediate' | 'Daily' | 'Weekly' | 'Monthly'
  enabled: boolean
  recipients: string[]
  priority: 'High' | 'Medium' | 'Low'
  retryAttempts: number
  template: string
}

export default function NotificationSettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState<NotificationConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [notifications, setNotifications] = useState<NotificationConfig[]>([
    {
      id: 1,
      type: 'Resource Assignment',
      channel: 'Email',
      frequency: 'Immediate',
      enabled: true,
      recipients: ['project_managers', 'resource_owners'],
      priority: 'High',
      retryAttempts: 3,
      template: 'resource_assignment_notification'
    },
    {
      id: 2,
      type: 'Maintenance Alert',
      channel: 'SMS',
      frequency: 'Daily',
      enabled: true,
      recipients: ['maintenance_team', 'facility_managers'],
      priority: 'Medium',
      retryAttempts: 2,
      template: 'maintenance_alert'
    },
    {
      id: 3,
      type: 'Usage Report',
      channel: 'In-App',
      frequency: 'Weekly',
      enabled: true,
      recipients: ['department_heads', 'administrators'],
      priority: 'Low',
      retryAttempts: 1,
      template: 'usage_report_notification'
    }
  ])

  const [formData, setFormData] = useState<Omit<NotificationConfig, 'id'>>({
    type: '',
    channel: 'Email',
    frequency: 'Immediate',
    enabled: true,
    recipients: [],
    priority: 'Medium',
    retryAttempts: 3,
    template: ''
  })

  const handleOpenModal = (notification?: NotificationConfig) => {
    if (notification) {
      setEditingNotification(notification)
      const {  ...rest } = notification
      setFormData(rest)
    } else {
      setEditingNotification(null)
      setFormData({
        type: '',
        channel: 'Email',
        frequency: 'Immediate',
        enabled: true,
        recipients: [],
        priority: 'Medium',
        retryAttempts: 3,
        template: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingNotification) {
      setNotifications(notifications.map(notif => 
        notif.id === editingNotification.id 
          ? { ...formData, id: notif.id }
          : notif
      ))
    } else {
      const newNotification = {
        ...formData,
        id: notifications.length + 1
      }
      setNotifications([...notifications, newNotification])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const toggleNotification = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
    ))
  }

  const getPriorityColor = (priority: NotificationConfig['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Notification
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications
          .filter(notification => 
            notification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.template.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(notification => (
            <div key={notification.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Bell className={`w-6 h-6 ${notification.enabled ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{notification.type}</h3>
                      <p className="text-sm text-gray-500">{notification.channel}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOpenModal(notification)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(notification.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.enabled}
                        onChange={() => toggleNotification(notification.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Frequency</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <Clock className="w-4 h-4" />
                      {notification.frequency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Priority</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Recipients:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {notification.recipients.map(recipient => (
                        <span
                          key={recipient}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {recipient}
                        </span>
                      ))}
                    </div>
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
              {editingNotification ? 'Edit Notification' : 'Add New Notification'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Notification Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as NotificationConfig['channel'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="In-App">In-App</option>
                  <option value="Push">Push</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as NotificationConfig['frequency'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as NotificationConfig['priority'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Recipients (comma-separated)</label>
                <input
                  type="text"
                  value={formData.recipients.join(', ')}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value.split(',').map(r => r.trim()) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <input
                  type="text"
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Retry Attempts</label>
                <input
                  type="number"
                  value={formData.retryAttempts}
                  onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
                  min="0"
                  max="5"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Enable Notification</label>
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
                  {editingNotification ? 'Save Changes' : 'Create Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}