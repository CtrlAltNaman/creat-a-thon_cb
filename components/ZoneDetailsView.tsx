import { useState, useEffect } from "react"
import { ArrowLeft, Droplets, Gauge, Leaf, Beaker } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type ZoneDetailsProps = {
  zone: {
    id: number
    name: string
    status: "normal" | "warning" | "critical" | "offline"
    devices: number
  }
  onBack: () => void
}

type Reading = {
  value: number
  status: "normal" | "warning" | "critical"
  unit: string
}

export default function ZoneDetailsView({ zone, onBack }: ZoneDetailsProps) {
  // Simulated readings state
  const [readings, setReadings] = useState({
    co2: { value: 400, status: "normal", unit: "ppm" } as Reading,
    cn: { value: 0.5, status: "normal", unit: "ppm" } as Reading,
    no2: { value: 0.2, status: "normal", unit: "ppm" } as Reading,
    h2o: { value: 45, status: "normal", unit: "%" } as Reading,
  })

  // Simulate changing readings
  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(prev => ({
        co2: {
          value: Math.max(350, Math.min(1000, prev.co2.value + (Math.random() > 0.5 ? 10 : -10))),
          status: getStatus(prev.co2.value, 600, 800),
          unit: "ppm"
        },
        cn: {
          value: Math.max(0, Math.min(2, prev.cn.value + (Math.random() > 0.5 ? 0.1 : -0.1))),
          status: getStatus(prev.cn.value, 1, 1.5),
          unit: "ppm"
        },
        no2: {
          value: Math.max(0, Math.min(1, prev.no2.value + (Math.random() > 0.5 ? 0.05 : -0.05))),
          status: getStatus(prev.no2.value, 0.5, 0.7),
          unit: "ppm"
        },
        h2o: {
          value: Math.max(30, Math.min(70, prev.h2o.value + (Math.random() > 0.5 ? 2 : -2))),
          status: getStatus(prev.h2o.value, 55, 65),
          unit: "%"
        },
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Helper function to determine status based on thresholds
  const getStatus = (value: number, warningThreshold: number, criticalThreshold: number) => {
    if (value >= criticalThreshold) return "critical"
    if (value >= warningThreshold) return "warning"
    return "normal"
  }

  // Helper function to get appropriate color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-orange-500"
      case "normal":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{zone.name}</h2>
          <p className="text-muted-foreground">Environmental Readings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* CO2 Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CO2 Level</CardTitle>
              <Leaf className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Carbon Dioxide Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.co2.value.toFixed(0)} {readings.co2.unit}</div>
              <Badge className={getStatusColor(readings.co2.status)}>
                {readings.co2.status.charAt(0).toUpperCase() + readings.co2.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={(readings.co2.value - 350) / 6.5}
              className={`h-2 ${getStatusColor(readings.co2.status)}`}
            />
          </CardContent>
        </Card>

        {/* CN Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CN Level</CardTitle>
              <Beaker className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Cyanide Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.cn.value.toFixed(2)} {readings.cn.unit}</div>
              <Badge className={getStatusColor(readings.cn.status)}>
                {readings.cn.status.charAt(0).toUpperCase() + readings.cn.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={readings.cn.value * 50}
              className={`h-2 ${getStatusColor(readings.cn.status)}`}
            />
          </CardContent>
        </Card>

        {/* NO2 Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">NO2 Level</CardTitle>
              <Gauge className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Nitrogen Dioxide Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.no2.value.toFixed(2)} {readings.no2.unit}</div>
              <Badge className={getStatusColor(readings.no2.status)}>
                {readings.no2.status.charAt(0).toUpperCase() + readings.no2.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={readings.no2.value * 100}
              className={`h-2 ${getStatusColor(readings.no2.status)}`}
            />
          </CardContent>
        </Card>

        {/* H2O Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">H2O Level</CardTitle>
              <Droplets className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Humidity Level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.h2o.value.toFixed(1)} {readings.h2o.unit}</div>
              <Badge className={getStatusColor(readings.h2o.status)}>
                {readings.h2o.status.charAt(0).toUpperCase() + readings.h2o.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={readings.h2o.value}
              className={`h-2 ${getStatusColor(readings.h2o.status)}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 