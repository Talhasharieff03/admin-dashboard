'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Building2 } from 'lucide-react'

interface Location {
  id: number
  name: string
  address: string
  type: 'Office' | 'Training Center' | 'Branch' | 'Warehouse'
  capacity: number
  status: 'Active' | 'Inactive' | 'Under Maintenance'
  facilities: string[]
  contactPerson: string
  phone: string
  operatingHours: string
}

export default function LocationManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Dummy data
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: 'Main Office HQ',
      address: '123 Corporate Drive, New York, NY 10001',
      type: 'Office',
      capacity: 500,
      status: 'Active',
      facilities: ['Meeting Rooms', 'Cafeteria', 'Gym', 'Parking'],
      contactPerson: 'John Smith',
      phone: '(555) 123-4567',
      operatingHours: '8:00 AM - 6:00 PM'
    },
    {
      id: 2,
      name: 'West Coast Training Center',
      address: '456 Learning Lane, San Francisco, CA 94105',
      type: 'Training Center',
      capacity: 200,
      status: 'Active',
      facilities: ['Classrooms', 'Computer Lab', 'Library', 'Cafeteria'],
      contactPerson: 'Sarah Johnson',
      phone: '(555) 987-6543',
      operatingHours: '7:00 AM - 9:00 PM'
    },
    {
      id: 3,
      name: 'Downtown Branch',
      address: '789 Business Ave, Chicago, IL 60601',
      type: 'Branch',
      capacity: 150,
      status: 'Under Maintenance',
      facilities: ['Meeting Rooms', 'Break Room'],
      contactPerson: 'Mike Wilson',
      phone: '(555) 456-7890',
      operatingHours: '9:00 AM - 5:00 PM'
    }
  ])

  const [formData, setFormData] = useState<Omit<Location, 'id'>>({
    name: '',
    address: '',
    type: 'Office',
    capacity: 0,
    status: 'Active',
    facilities: [],
    contactPerson: '',
    phone: '',
    operatingHours: ''
  })

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location)
      setFormData(location)
    } else {
      setEditingLocation(null)
      setFormData({
        name: '',
        address: '',
        type: 'Office',
        capacity: 0,
        status: 'Active',
        facilities: [],
        contactPerson: '',
        phone: '',
        operatingHours: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLocation) {
      setLocations(locations.map(loc => 
        loc.id === editingLocation.id ? { ...formData, id: loc.id } : loc
      ))
    } else {
      setLocations([...locations, { ...formData, id: locations.length + 1 }])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setLocations(locations.filter(loc => loc.id !== id))
  }

  const handleFacilityChange = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const facilityOptions = [
    'Meeting Rooms',
    'Cafeteria',
    'Gym',
    'Parking',
    'Computer Lab',
    'Library',
    'Break Room',
    'Training Room',
    'Reception'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations
          .filter(location => 
            location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.address.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-500">{location.address}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(location)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-900">{location.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="text-gray-900">{location.capacity} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 rounded-full text-xs font-medium ${
                      location.status === 'Active' ? 'bg-green-100 text-green-800' :
                      location.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {location.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contact:</span>
                    <span className="text-gray-900">{location.contactPerson}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hours:</span>
                    <span className="text-gray-900">{location.operatingHours}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <span className="text-sm text-gray-500">Facilities:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {location.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Location['type'] })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="Office">Office</option>
                    <option value="Training Center">Training Center</option>
                    <option value="Branch">Branch</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Location['status'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                <div className="grid grid-cols-2 gap-2">
                  {facilityOptions.map((facility) => (
                    <label key={facility} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </label>
                  ))}
                </div>
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
                  {editingLocation ? 'Save Changes' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}