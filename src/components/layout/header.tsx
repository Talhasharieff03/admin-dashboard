import { Bell, User, Search } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="p-2">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span>Admin User</span>
          </button>
        </div>
      </div>
    </header>
  )
}