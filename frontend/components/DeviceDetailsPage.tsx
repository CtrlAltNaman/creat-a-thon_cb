"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowLeft, Shield, BellRing } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DeviceDetailsPageProps {
  device: {
    name: string
    type: string
    status: string
  }
  onBack: () => void
}

export default function DeviceDetailsPage({ device, onBack }: DeviceDetailsPageProps) {
  const [metrics, setMetrics] = useState({
    ch4: { value: 0, raw: 0, voltage: 0 },
    voc: { value: 0, raw: 0, voltage: 0 },
    h2: { value: 0, raw: 0, voltage: 0 },
    alcohol: { value: 0, raw: 0, voltage: 0 },
    alert: false,
    timestamp: ''
  })

  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const [alerts, setAlerts] = useState<string[]>([])

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket("ws://localhost:8081")
      
      socket.onopen = () => {
        console.log("WebSocket connection established")
        setWsStatus('connected')
      }

      socket.onclose = () => {
        console.log("WebSocket connection closed")
        setWsStatus('disconnected')
        // Try to reconnect after 5 seconds
        setTimeout(() => {
          console.log("Attempting to reconnect...")
          connectWebSocket()
        }, 5000)
      }

      socket.onerror = (error) => {
        // Just log the error, let onclose handle the reconnection
        console.log("WebSocket connection error, will attempt reconnect")
        setWsStatus('disconnected')
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === "sensor_data") {
            const { sensor, value, raw, voltage, alert, message } = data
            
            setMetrics(prev => ({
              ...prev,
              [sensor.toLowerCase()]: {
                value: parseFloat(value) || 0,
                raw: parseInt(raw) || 0,
                voltage: parseFloat(voltage) || 0
              }
            }))

            if (alert && message) {
              setAlerts(prev => {
                // Avoid duplicate alerts
                if (!prev.includes(message)) {
                  return [...prev, message]
                }
                return prev
              })
              setTimeout(() => {
                setAlerts(prev => prev.filter(a => a !== message))
              }, 10000)
            }
          }

          if (data.type === "system_alert") {
            setMetrics(prev => ({
              ...prev,
              alert: Boolean(data.alert),
              timestamp: data.timestamp || new Date().toISOString()
            }))
          }
        } catch (error) {
          console.warn("Error parsing WebSocket message:", error)
        }
      }

      return socket
    } catch (error) {
      console.warn("Error creating WebSocket connection:", error)
      setWsStatus('disconnected')
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        console.log("Attempting to reconnect...")
        connectWebSocket()
      }, 5000)
      return null
    }
  }, [])

  useEffect(() => {
    let socket: WebSocket | null = null
    
    const connect = () => {
      setWsStatus('connecting')
      socket = connectWebSocket()
    }

    connect()
    
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [connectWebSocket])

  const getStatusColor = (value: number, threshold: number) => {
    if (value > threshold) return "bg-red-500 animate-pulse"
    if (value > threshold * 0.8) return "bg-orange-500"
    return "bg-green-500"
  }

  const calculateProgress = (value: number, threshold: number) => {
    // For values above threshold, we'll show full bar in red
    if (value >= threshold) {
      return 100
    }
    // For values below threshold, show percentage of threshold
    return (value / threshold) * 100
  }

  // Add this new function to get text color based on status
  const getTextColor = (value: number, threshold: number) => {
    if (value > threshold) return "text-red-500"
    if (value > threshold * 0.8) return "text-orange-500"
    return "text-green-500"
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Unknown"
    
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return "Invalid date"
      
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffMins < 24 * 60) return `${Math.floor(diffMins / 60)} hours ago`
      return date.toLocaleString()
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <header className="flex items-center gap-4 mb-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className="bg-black/20 hover:bg-black/40 transition-colors h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
            <p className="text-muted-foreground">
              {device.type} - Status: {device.status}
              {wsStatus !== 'connected' && (
                <span className="ml-2 text-red-500">
                  (Connecting to sensor data...)
                </span>
              )}
            </p>
          </div>
        </header>

        <Card className="border-2 bg-black/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Gas Monitoring System</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Device ID: {device.name}
                    </p>
                    <Badge className={metrics.alert ? "bg-red-500 animate-pulse" : "bg-green-500"}>
                      {metrics.alert ? "ALERT" : "Normal"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Connection Status</p>
                <p className={`font-medium ${wsStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
                  {wsStatus.charAt(0).toUpperCase() + wsStatus.slice(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* CH4 Sensor */}
          <Card className="bg-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Methane (CH4)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTextColor(metrics.ch4.value, 10.0)}`}>
                {metrics.ch4.value.toFixed(2)}%
                <span className="text-xs ml-2 text-muted-foreground">Threshold: 10.0%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Raw: {metrics.ch4.raw} | Voltage: {metrics.ch4.voltage.toFixed(2)}V
              </div>
              <div className="relative mt-2">
                <Progress
                  value={calculateProgress(metrics.ch4.value, 10.0)}
                  className="mt-2"
                  indicatorClassName={getStatusColor(metrics.ch4.value, 10.0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* VOC Sensor */}
          <Card className="bg-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">VOC Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTextColor(metrics.voc.value, 25.0)}`}>
                {metrics.voc.value.toFixed(2)}%
                <span className="text-xs ml-2 text-muted-foreground">Threshold: 25.0%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Raw: {metrics.voc.raw} | Voltage: {metrics.voc.voltage.toFixed(2)}V
              </div>
              <div className="relative mt-2">
                <Progress
                  value={calculateProgress(metrics.voc.value, 25.0)}
                  className="mt-2"
                  indicatorClassName={getStatusColor(metrics.voc.value, 25.0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* H2 Sensor */}
          <Card className="bg-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hydrogen (H2)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTextColor(metrics.h2.value, 15.0)}`}>
                {metrics.h2.value.toFixed(2)}%
                <span className="text-xs ml-2 text-muted-foreground">Threshold: 15.0%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Raw: {metrics.h2.raw} | Voltage: {metrics.h2.voltage.toFixed(2)}V
              </div>
              <div className="relative mt-2">
                <Progress
                  value={calculateProgress(metrics.h2.value, 15.0)}
                  className="mt-2"
                  indicatorClassName={getStatusColor(metrics.h2.value, 15.0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Alcohol Sensor */}
          <Card className="bg-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alcohol Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTextColor(metrics.alcohol.value, 20.0)}`}>
                {metrics.alcohol.value.toFixed(2)}%
                <span className="text-xs ml-2 text-muted-foreground">Threshold: 20.0%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Raw: {metrics.alcohol.raw} | Voltage: {metrics.alcohol.voltage.toFixed(2)}V
              </div>
              <div className="relative mt-2">
                <Progress
                  value={calculateProgress(metrics.alcohol.value, 20.0)}
                  className="mt-2"
                  indicatorClassName={getStatusColor(metrics.alcohol.value, 20.0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <BellRing className="h-4 w-4" />
                <AlertTitle>Alert</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {metrics.timestamp && (
          <div className="text-sm text-muted-foreground text-right">
            Last updated: {formatTimestamp(metrics.timestamp)}
          </div>
        )}
      </div>
    </div>
  )
}
