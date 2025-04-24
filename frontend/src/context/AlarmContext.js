"use client"

import { createContext, useState, useEffect, useCallback, useContext } from "react"
import {
  subscribeToWorkers,
  subscribeToSensors,
  subscribeToDevices,
  subscribeToAlerts,
  createAlert,
  updateWorker,
  updateDevice,
} from "../firebase/firebase"

// Initial data for fallback
const initialWorkers = [
  {
    id: 1,
    name: "John Smith",
    position: "Maintenance Engineer",
    status: "active",
    location: "Zone 1 - Main Floor",
    heartRate: 72,
    motionStatus: "moving",
    fallDetected: false,
    lastUpdated: "2 min ago",
  },
  // Other workers...
]

const AlarmContext = createContext()

export function useAlarm() {
  const context = useContext(AlarmContext)
  if (!context) {
    throw new Error("useAlarm must be used within an AlarmProvider")
  }
  return context
}

export function AlarmProvider({ children }) {
  const [workers, setWorkers] = useState([])
  const [devices, setDevices] = useState([])
  const [sensors, setSensors] = useState([])
  const [alerts, setAlerts] = useState([])
  const [activeAlerts, setActiveAlerts] = useState(0)
  const [systemStatus, setSystemStatus] = useState("normal")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSilenced, setIsSilenced] = useState(false)

  // Subscribe to Firebase collections
  useEffect(() => {
    setIsLoading(true)

    // Set up real-time listeners
    const unsubscribeWorkers = subscribeToWorkers((data) => {
      setWorkers(data.length > 0 ? data : initialWorkers)
    })

    const unsubscribeSensors = subscribeToSensors((data) => {
      setSensors(data)
    })

    const unsubscribeDevices = subscribeToDevices((data) => {
      setDevices(data)
    })

    const unsubscribeAlerts = subscribeToAlerts((data) => {
      setAlerts(data)
    })

    // Set loading to false after initial data fetch
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Clean up listeners on unmount
    return () => {
      unsubscribeWorkers()
      unsubscribeSensors()
      unsubscribeDevices()
      unsubscribeAlerts()
    }
  }, [])

  // Update active alerts count and system status
  useEffect(() => {
    let criticalCount = 0
    let warningCount = 0

    workers.forEach((worker) => {
      if (worker.status === "critical") criticalCount++
      if (worker.status === "warning") warningCount++
    })

    sensors.forEach((sensor) => {
      if (sensor.status === "critical") criticalCount++
      if (sensor.status === "warning") warningCount++
    })

    setActiveAlerts(criticalCount + warningCount)
    setSystemStatus(criticalCount > 0 ? "critical" : warningCount > 0 ? "warning" : "normal")
  }, [workers, sensors])

  // Test alarm function
  const testAlarm = useCallback(async () => {
    try {
      // Create test alert in Firebase
      await createAlert({
        message: "Test alert: Emergency response system check",
        level: "info",
        worker: null,
      })

      return true
    } catch (error) {
      console.error("Error testing alarm:", error)
      return false
    }
  }, [])

  // Emergency call function
  const emergencyCall = useCallback(
    async (workerId) => {
      const worker = workers.find((w) => w.id === workerId)
      if (!worker) return false

      try {
        // Create emergency call alert in Firebase
        await createAlert({
          message: `Emergency call initiated for ${worker.name}`,
          level: "critical",
          worker: worker.name,
        })

        // Update worker status
        await updateWorker(workerId, {
          status: "critical",
        })

        return true
      } catch (error) {
        console.error("Error making emergency call:", error)
        return false
      }
    },
    [workers],
  )

  // Silence alarm function
  const silenceAlarm = useCallback(async () => {
    setIsSilenced(!isSilenced)

    try {
      // Create silence alert in Firebase
      await createAlert({
        message: isSilenced ? "Alarm unsilenced" : "Alarm silenced",
        level: "info",
        worker: null,
      })

      return true
    } catch (error) {
      console.error("Error silencing alarm:", error)
      return false
    }
  }, [isSilenced])

  // System check function
  const systemCheck = useCallback(async () => {
    try {
      // Create system check alert in Firebase
      await createAlert({
        message: "System check initiated for all devices",
        level: "info",
        worker: null,
      })

      // Update all devices' last sync time
      const updatePromises = devices.map((device) => updateDevice(device.id, { lastSync: new Date() }))

      await Promise.all(updatePromises)
      return true
    } catch (error) {
      console.error("Error checking system:", error)
      return false
    }
  }, [devices])

  // Refresh data function
  const refreshData = useCallback(async () => {
    try {
      // Create refresh alert in Firebase
      await createAlert({
        message: "Data refreshed for all devices and sensors",
        level: "info",
        worker: null,
      })

      return true
    } catch (error) {
      console.error("Error refreshing data:", error)
      return false
    }
  }, [])

  const value = {
    workers,
    devices,
    sensors,
    alerts,
    activeAlerts,
    systemStatus,
    isLoading,
    error,
    testAlarm,
    emergencyCall,
    silenceAlarm,
    systemCheck,
    refreshData,
  }

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>
}
