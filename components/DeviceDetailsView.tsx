import { useState, useEffect } from "react"
import { ArrowLeft, Flame, Wind, CloudFog, Gauge } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type DeviceDetailsProps = {
  device: {
    id: number
    name: string
    type: "smoke" | "heat" | "sprinkler" | "co" | "panel"
    status: "normal" | "warning" | "critical" | "offline"
    lastChecked: string
    zoneId: number
  }
  onBack: () => void
}

type GasReading = {
  value: number
  status: "normal" | "warning" | "critical"
  unit: string
}

export default function DeviceDetailsView({ device, onBack }: DeviceDetailsProps) {
  // Simulated gas readings state
  const [readings, setReadings] = useState({
    methane: { value: 2, status: "normal", unit: "%" } as GasReading,
    carbonMonoxide: { value: 5, status: "normal", unit: "ppm" } as GasReading,
    propane: { value: 1, status: "normal", unit: "%" } as GasReading,
    hydrogen: { value: 0.5, status: "normal", unit: "%" } as GasReading,
  })

  // Simulate changing readings
  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(prev => ({
        methane: {
          value: Math.max(0, Math.min(10, prev.methane.value + (Math.random() > 0.5 ? 0.3 : -0.3))),
          status: getStatus(prev.methane.value, 4, 6),
          unit: "%"
        },
        carbonMonoxide: {
          value: Math.max(0, Math.min(50, prev.carbonMonoxide.value + (Math.random() > 0.5 ? 2 : -2))),
          status: getStatus(prev.carbonMonoxide.value, 25, 35),
          unit: "ppm"
        },
        propane: {
          value: Math.max(0, Math.min(5, prev.propane.value + (Math.random() > 0.5 ? 0.2 : -0.2))),
          status: getStatus(prev.propane.value, 2, 3),
          unit: "%"
        },
        hydrogen: {
          value: Math.max(0, Math.min(4, prev.hydrogen.value + (Math.random() > 0.5 ? 0.1 : -0.1))),
          status: getStatus(prev.hydrogen.value, 1.5, 2.5),
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
          <h2 className="text-2xl font-bold">{device.name}</h2>
          <p className="text-muted-foreground">Gas Detection Readings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Methane Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Methane (CH4)</CardTitle>
              <Gauge className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Methane Gas Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.methane.value.toFixed(1)} {readings.methane.unit}</div>
              <Badge className={getStatusColor(readings.methane.status)}>
                {readings.methane.status.charAt(0).toUpperCase() + readings.methane.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={(readings.methane.value / 10) * 100}
              className={`h-2 ${getStatusColor(readings.methane.status)}`}
            />
          </CardContent>
        </Card>

        {/* Carbon Monoxide Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Carbon Monoxide (CO)</CardTitle>
              <CloudFog className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Carbon Monoxide Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.carbonMonoxide.value.toFixed(1)} {readings.carbonMonoxide.unit}</div>
              <Badge className={getStatusColor(readings.carbonMonoxide.status)}>
                {readings.carbonMonoxide.status.charAt(0).toUpperCase() + readings.carbonMonoxide.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={(readings.carbonMonoxide.value / 50) * 100}
              className={`h-2 ${getStatusColor(readings.carbonMonoxide.status)}`}
            />
          </CardContent>
        </Card>

        {/* Propane Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Propane (C3H8)</CardTitle>
              <Flame className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Propane Gas Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.propane.value.toFixed(1)} {readings.propane.unit}</div>
              <Badge className={getStatusColor(readings.propane.status)}>
                {readings.propane.status.charAt(0).toUpperCase() + readings.propane.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={(readings.propane.value / 5) * 100}
              className={`h-2 ${getStatusColor(readings.propane.status)}`}
            />
          </CardContent>
        </Card>

        {/* Hydrogen Level */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Hydrogen (H2)</CardTitle>
              <Wind className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>Hydrogen Gas Concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{readings.hydrogen.value.toFixed(1)} {readings.hydrogen.unit}</div>
              <Badge className={getStatusColor(readings.hydrogen.status)}>
                {readings.hydrogen.status.charAt(0).toUpperCase() + readings.hydrogen.status.slice(1)}
              </Badge>
            </div>
            <Progress 
              value={(readings.hydrogen.value / 4) * 100}
              className={`h-2 ${getStatusColor(readings.hydrogen.status)}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 