"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

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
    particleLevel: 15,
    coLevel: 0.5,
    temperature: 24,
    humidity: 45
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        particleLevel: Math.max(0, Math.min(100, prev.particleLevel + (Math.random() > 0.5 ? 1 : -1))),
        coLevel: Math.max(0, Math.min(10, prev.coLevel + (Math.random() > 0.5 ? 0.1 : -0.1))),
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() > 0.5 ? 0.5 : -0.5))),
        humidity: Math.max(20, Math.min(80, prev.humidity + (Math.random() > 0.5 ? 1 : -1)))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-500'
      case 'warning':
        return 'bg-orange-500'
      case 'critical':
        return 'bg-red-500 animate-pulse'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
            <p className="text-muted-foreground">
              {device.type} - Status: {device.status}
            </p>
          </div>
        </header>

        {/* Device Status Block */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{device.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">Device ID: {device.type}-{Math.random().toString(36).substr(2, 9)}</p>
                    <Badge className={getStatusColor(device.status)}>
                      {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Particle Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.particleLevel}%</div>
              <Progress
                value={metrics.particleLevel}
                className="mt-2"
                indicatorClassName={
                  metrics.particleLevel > 50 ? "bg-red-500" : 
                  metrics.particleLevel > 25 ? "bg-orange-500" : "bg-green-500"
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">CO Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.coLevel.toFixed(1)} ppm</div>
              <Progress
                value={(metrics.coLevel / 10) * 100}
                className="mt-2"
                indicatorClassName={
                  metrics.coLevel > 5 ? "bg-red-500" : 
                  metrics.coLevel > 2 ? "bg-orange-500" : "bg-green-500"
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.temperature.toFixed(1)}°C</div>
              <Progress
                value={((metrics.temperature - 15) / 20) * 100}
                className="mt-2"
                indicatorClassName={
                  metrics.temperature > 30 ? "bg-red-500" : 
                  metrics.temperature > 25 ? "bg-orange-500" : "bg-green-500"
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.humidity}%</div>
              <Progress
                value={metrics.humidity}
                className="mt-2"
                indicatorClassName={
                  metrics.humidity > 70 ? "bg-red-500" : 
                  metrics.humidity > 60 ? "bg-orange-500" : "bg-green-500"
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 