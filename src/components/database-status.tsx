'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface DatabaseStatus {
  status: 'healthy' | 'unhealthy' | 'error'
  database: 'connected' | 'disconnected' | 'error'
  error?: string
  timestamp: string
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        setStatus({
          status: 'error',
          database: 'error',
          error: 'Failed to check database status',
          timestamp: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    checkDatabaseStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking database...</span>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <span>Unable to check database status</span>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (status.database) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (status.database) {
      case 'connected':
        return 'Database Connected'
      case 'disconnected':
        return 'Database Disconnected'
      case 'error':
        return `Database Error: ${status.error || 'Unknown error'}`
      default:
        return 'Database Status Unknown'
    }
  }

  const getStatusColor = () => {
    switch (status.database) {
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-red-600'
      case 'error':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  )
}