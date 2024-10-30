'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react'

interface Resource {
  id: number
  name: string
  type: 'Equipment' | 'Software' | 'Room' | 'Vehicle' | 'Personnel'
  status: 'Available' | 'In Use' | 'Under Maintenance' | 'Reserved'
  assignedTo: string
  location: string
  scheduledUntil?: string
  cost: string
  utilization: number
  lastMaintenance?: string
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export default function ResourceAllocationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // Dummy data
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      name: 'Training Room A',
      type: 'Room',
      status: 'Available',
      assignedTo: '-',
      location: 'Main Building',
      cost: '$200/day',
      utilization: 75,
      lastMaintenance: '2024-01-15'
    },
    {
      id: 2,
      name: 'Laptop Set 1',
      type: 'Equipment',
      status: 'In Use',
      assignedTo: 'IT Training',
      location: 'Tech Center',
      scheduledUntil: '2024-03-15',
      cost: '$1500/month',
      utilization: 90
    },
    {
      id: 3,
      name: 'Project Vehicle 1',
      type: 'Vehicle',
      status: 'Reserved',
      assignedTo: 'Field Team',
      location: 'Garage',
      scheduledUntil: '2024-03-10',
      cost: '$100/day',
      utilization: 60,
      lastMaintenance: '2024-02-01'
    }
  ])

  const handleDelete = (id: number) => {
    setResources(resources.filter(resource => resource.id !== id))
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setIsModalOpen(true)
  }

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'In Use':
        return 'bg-blue-100 text-blue-800'
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'Reserved':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-500'
    if (utilization >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Resource Allocation</h1>
        <button
          onClick={() => {
            setEditingResource(null)
            setIsModalOpen(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Types</option>
          <option value="Equipment">Equipment</option>
          <option value="Software">Software</option>
          <option value="Room">Room</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Personnel">Personnel</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources
          .filter(resource => 
            (filterType === 'all' || resource.type === filterType) &&
            (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             resource.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map(resource => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                    <p className="text-sm text-gray-500">{resource.type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-gray-400 hover:text-blue-500"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Assigned To</span>
                    <span className="text-sm font-medium text-gray-900">{resource.assignedTo}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium text-gray-900">{resource.location}</span>
                  </div>

                  {resource.scheduledUntil && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Scheduled Until</span>
                      <span className="text-sm font-medium text-gray-900">{resource.scheduledUntil}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Cost</span>
                    <span className="text-sm font-medium text-gray-900">{resource.cost}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Utilization</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(resource.utilization)}`}>
                      {resource.utilization}%
                    </span>
                  </div>

                  {resource.lastMaintenance && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Last Maintenance</span>
                      <span className="text-sm font-medium text-gray-900">{resource.lastMaintenance}</span>
                    </div>
                  )}
                </div>

                {resource.utilization >= 90 && (
                  <div className="mt-4 p-2 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    High utilization alert
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Add/Edit Modal would go here */}
    </div>
  )
}