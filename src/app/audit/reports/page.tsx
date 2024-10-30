'use client'

import { useState } from 'react'
import { Download, FileText, Calendar, CheckCircle, AlertCircle, Clock, Filter, Search } from 'lucide-react'

interface ComplianceReport {
  id: number
  name: string
  type: 'Security' | 'Privacy' | 'Resource' | 'Access' | 'Audit'
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Failed'
  generatedDate: string
  scheduledDate?: string
  compliance: number
  findings: number
  assignee: string
  framework: string
  description: string
  fileSize: string
}

const ComplianceReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: 1,
      name: 'Q1 Security Compliance Report',
      type: 'Security',
      status: 'Completed',
      generatedDate: '2024-02-15',
      compliance: 98,
      findings: 3,
      assignee: 'John Smith',
      framework: 'ISO 27001',
      description: 'Quarterly security compliance assessment report',
      fileSize: '2.5 MB'
    },
    {
      id: 2,
      name: 'Data Privacy Audit Report',
      type: 'Privacy',
      status: 'In Progress',
      generatedDate: '2024-02-14',
      scheduledDate: '2024-02-16',
      compliance: 85,
      findings: 7,
      assignee: 'Sarah Johnson',
      framework: 'GDPR',
      description: 'Annual data privacy compliance audit',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      name: 'Resource Utilization Report',
      type: 'Resource',
      status: 'Completed',
      generatedDate: '2024-02-13',
      compliance: 92,
      findings: 5,
      assignee: 'Mike Wilson',
      framework: 'Internal Policy',
      description: 'Monthly resource utilization compliance check',
      fileSize: '1.2 MB'
    },
    {
      id: 4,
      name: 'Access Control Audit',
      type: 'Access',
      status: 'Failed',
      generatedDate: '2024-02-12',
      compliance: 75,
      findings: 12,
      assignee: 'Emma Davis',
      framework: 'SOC 2',
      description: 'Quarterly access control compliance audit',
      fileSize: '3.1 MB'
    }
  ])

  const getStatusColor = (status: ComplianceReport['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600'
    if (compliance >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleDownload = (id: number) => {
    // Implementation for downloading reports
    console.log(`Downloading report ${id}`)
  }

  const handleGenerateReport = () => {
    const newReport: ComplianceReport = {
      id: reports.length + 1,
      name: 'New Compliance Report',
      type: 'Audit',
      status: 'Scheduled',
      generatedDate: new Date().toISOString().split('T')[0],
      scheduledDate: new Date().toISOString().split('T')[0],
      compliance: 0,
      findings: 0,
      assignee: 'System',
      framework: 'Internal',
      description: 'New compliance report',
      fileSize: '0 KB'
    }
    setReports([...reports, newReport])
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
        <button
          onClick={handleGenerateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="Security">Security</option>
            <option value="Privacy">Privacy</option>
            <option value="Resource">Resource</option>
            <option value="Access">Access</option>
            <option value="Audit">Audit</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-1/2 border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-1/2 border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports
          .filter(report => 
            (filterType === 'all' || report.type === filterType) &&
            (filterStatus === 'all' || report.status === filterStatus) &&
            (report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             report.framework.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map(report => (
            <div key={report.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.framework}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Compliance Score</span>
                    <span className={`text-lg font-semibold ${getComplianceColor(report.compliance)}`}>
                      {report.compliance}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Findings</span>
                    <span className="text-sm font-medium text-gray-900">{report.findings}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Generated Date</span>
                    <span className="text-sm text-gray-900">{report.generatedDate}</span>
                  </div>

                  {report.scheduledDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Scheduled Date</span>
                      <span className="text-sm text-gray-900">{report.scheduledDate}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Assignee</span>
                    <span className="text-sm text-gray-900">{report.assignee}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">File Size</span>
                    <span className="text-sm text-gray-900">{report.fileSize}</span>
                  </div>

                  <p className="text-sm text-gray-600">{report.description}</p>

                  {report.status === 'Completed' && (
                    <button
                      onClick={() => handleDownload(report.id)}
                      className="w-full mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-100"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ComplianceReportsPage