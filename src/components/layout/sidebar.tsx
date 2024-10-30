'use client'

import { Home, Users, Settings, Shield, Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()
  
  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/' 
    },
    { 
      icon: Users, 
      label: 'Users', 
      href: '/users' 
    },
    {
      icon: Settings,
      label: 'Program Configuration',
      href: '/program-config',
      subItems: [
        { label: 'Program Setup', href: '/program-config/setup' },
        { label: 'Location Management', href: '/program-config/locations' },
        { label: 'Resource Allocation', href: '/program-config/resources' },
        { label: 'Global Settings', href: '/program-config/settings' }
      ]
    },
    {
      icon: Mail,
      label: 'System Configuration',
      href: '/system-config',
      subItems: [
        { label: 'Email Templates', href: '/system-config/email-templates' },
        { label: 'Notification Settings', href: '/system-config/notifications' },
        { label: 'Integration Management', href: '/system-config/integrations' },
        { label: 'API Settings', href: '/system-config/api' }
      ]
    },
    {
      icon: Shield,
      label: 'Audit & Compliance',
      href: '/audit',
      subItems: [
        { label: 'Activity Logs', href: '/audit/logs' },
        { label: 'Compliance Reports', href: '/audit/reports' },
        { label: 'Security Settings', href: '/audit/security' },
        { label: 'Data Management', href: '/audit/data' }
      ]
    }
  ]

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Portal</h2>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Link
              href={item.href}
              className={`flex items-center w-full px-6 py-3 hover:bg-gray-700 ${
                pathname === item.href ? 'bg-gray-700' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
            {item.subItems && (
              <div className="ml-6 border-l border-gray-700">
                {item.subItems.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.href}
                    className={`flex items-center w-full px-6 py-2 hover:bg-gray-700 ${
                      pathname === subItem.href ? 'bg-gray-700' : ''
                    }`}
                  >
                    <span className="text-sm">{subItem.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}