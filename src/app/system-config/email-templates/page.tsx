'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Mail } from 'lucide-react'

interface EmailTemplate {
  id: number
  name: string
  subject: string
  type: 'Notification' | 'Welcome' | 'Alert' | 'Report' | 'Reminder'
  content: string
  variables: string[]
  lastModified: string
  status: 'Active' | 'Draft' | 'Archived'
  language: string
}

export default function EmailTemplatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to Our Platform',
      type: 'Welcome',
      content: 'Dear {{userName}}, Welcome to our platform...',
      variables: ['userName', 'companyName', 'loginUrl'],
      lastModified: '2024-02-15',
      status: 'Active',
      language: 'English'
    },
    {
      id: 2,
      name: 'Resource Allocation Alert',
      subject: 'Resource Assignment Update',
      type: 'Alert',
      content: 'Resource {{resourceName}} has been assigned to {{projectName}}...',
      variables: ['resourceName', 'projectName', 'startDate', 'endDate'],
      lastModified: '2024-02-10',
      status: 'Active',
      language: 'English'
    },
    {
      id: 3,
      name: 'Monthly Report Template',
      subject: 'Monthly Activity Report - {{month}}',
      type: 'Report',
      content: 'Please find attached the monthly report for {{month}}...',
      variables: ['month', 'year', 'departmentName', 'statistics'],
      lastModified: '2024-02-01',
      status: 'Draft',
      language: 'English'
    }
  ])

  const [formData, setFormData] = useState<Omit<EmailTemplate, 'id' | 'lastModified'>>({
    name: '',
    subject: '',
    type: 'Notification',
    content: '',
    variables: [],
    status: 'Draft',
    language: 'English'
  })

  const handleOpenModal = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template)
      const {  ...rest } = template
      setFormData(rest)
    } else {
      setEditingTemplate(null)
      setFormData({
        name: '',
        subject: '',
        type: 'Notification',
        content: '',
        variables: [],
        status: 'Draft',
        language: 'English'
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const currentDate = new Date().toISOString().split('T')[0]
    
    if (editingTemplate) {
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { ...formData, id: template.id, lastModified: currentDate }
          : template
      ))
    } else {
      const newTemplate = {
        ...formData,
        id: templates.length + 1,
        lastModified: currentDate
      }
      setTemplates([...templates, newTemplate])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id))
  }

  const getStatusColor = (status: EmailTemplate['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'Archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates
          .filter(template => 
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Mail className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.type}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOpenModal(template)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(template.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Subject:</span>
                    <p className="text-sm font-medium text-gray-900">{template.subject}</p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Variables:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {template.variables.map(variable => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Modified</span>
                    <span className="text-sm font-medium text-gray-900">{template.lastModified}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingTemplate ? 'Edit Template' : 'Add New Template'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EmailTemplate['type'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Notification">Notification</option>
                  <option value="Welcome">Welcome</option>
                  <option value="Alert">Alert</option>
                  <option value="Report">Report</option>
                  <option value="Reminder">Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Variables (comma-separated)</label>
                <input
                  type="text"
                  value={formData.variables.join(', ')}
                  onChange={(e) => setFormData({ ...formData, variables: e.target.value.split(',').map(v => v.trim()) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EmailTemplate['status'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
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
                  {editingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}