import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type StatusType = "normal" | "warning" | "critical"

interface SystemStatusProps {
  status: StatusType
  activeAlerts: number
}

export function SystemStatus({ status, activeAlerts }: SystemStatusProps) {
  return (
    <Card className={status === "critical" ? "border-red-500 shadow-red-500/20 shadow-lg" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {status === "normal" ? "Normal" : status === "warning" ? "Warning" : "ALERT"}
          </div>
          <Badge
            className={
              status === "normal"
                ? "bg-green-500"
                : status === "warning"
                  ? "bg-orange-500"
                  : "bg-red-500 animate-pulse"
            }
          >
            {activeAlerts > 0 ? `${activeAlerts} Active` : "All Clear"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
} 