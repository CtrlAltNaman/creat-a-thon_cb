import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TemperatureDisplayProps {
  temperature: number
}

export function TemperatureDisplay({ temperature }: TemperatureDisplayProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{temperature}°C</div>
        <div className="text-xs text-muted-foreground mt-1">
          Real-time local temperature
        </div>
      </CardContent>
    </Card>
  )
} 