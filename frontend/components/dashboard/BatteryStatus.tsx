import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BatteryStatusProps {
  batteryLevel: number
}

export function BatteryStatus({ batteryLevel }: BatteryStatusProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Battery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{Math.round(batteryLevel)}%</div>
        <Progress
          value={batteryLevel}
          className="mt-2"
          indicatorClassName={
            batteryLevel < 20 ? "bg-red-500" : batteryLevel < 50 ? "bg-orange-500" : "bg-green-500"
          }
        />
        <div className="text-xs text-muted-foreground mt-1">
          System battery level
        </div>
      </CardContent>
    </Card>
  )
} 