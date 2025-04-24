"use client"

import { useState } from "react"
import { useAlarm } from "../context/AlarmContext"
import Header from "./Header"
import StatusCard from "./StatusCard"
import AlertsPanel from "./AlertsPanel"
import TabView from "./TabView"
import LoadingSpinner from "./LoadingSpinner"

function Dashboard() {
  const { systemStatus, activeAlerts, isLoading, refreshData } = useAlarm()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle refresh with animation
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isRefreshing={isRefreshing} onRefresh={handleRefresh} />

      <main className="flex-1 p-4 pb-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          {/* System Status */}
          <StatusCard title="Worker Safety Monitoring System" status={systemStatus} activeAlerts={activeAlerts} />

          {/* Real-time Alerts Panel */}
          <AlertsPanel />

          {/* Tabs for Workers, Sensors, and Devices */}
          <TabView />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
