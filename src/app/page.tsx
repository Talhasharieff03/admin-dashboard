'use client'

import { useState } from 'react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Users, Database, Shield, Activity, ArrowUp } from 'lucide-react'

export default function DashboardPage() {
  const [loading] = useState(false)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: 5 mins ago</div>
      </div>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="1,234"
          icon={<Users className="w-6 h-6 text-blue-600" />}
          description={
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>12% from last month</span>
            </div>
          }
        />
        <StatsCard
          title="Active Programs"
          value="45"
          icon={<Database className="w-6 h-6 text-green-600" />}
          description="5 programs added this week"
        />
        <StatsCard
          title="System Health"
          value="98.5%"
          icon={<Activity className="w-6 h-6 text-purple-600" />}
          description="All systems operational"
        />
        <StatsCard
          title="Critical Alerts"
          value="2"
          icon={<Shield className="w-6 h-6 text-red-600" />}
          description="2 new alerts"
        />
      </div>

      {/* Activity and Status Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { title: 'New user registered', time: '2 minutes ago', icon: Users },
              { title: 'System backup completed', time: '1 hour ago', icon: Database },
              { title: 'Security scan finished', time: '3 hours ago', icon: Shield },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            {[
              { name: 'API Server', status: 'Operational', color: 'bg-green-500' },
              { name: 'Database', status: 'Operational', color: 'bg-green-500' },
              { name: 'Storage', status: 'Operational', color: 'bg-green-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm text-gray-500">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}