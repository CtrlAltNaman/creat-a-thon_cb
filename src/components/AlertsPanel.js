"use client"

import { useAlarm } from "../context/AlarmContext"

function AlertsPanel() {
  const { alerts } = useAlarm()

  const getAlertBgClass = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-50 border-red-500"
      case "warning":
        return "bg-orange-50 border-orange-500"
      default:
        return "bg-blue-50 border-blue-500"
    }
  }

  const getAlertTextClass = (level) => {
    switch (level) {
      case "critical":
        return "text-red-700"
      case "warning":
        return "text-orange-700"
      default:
        return "text-blue-700"
    }
  }

  const getAlertDotClass = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-orange-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-3 border-b">
        <h2 className="text-lg font-medium">Real-time Alerts</h2>
      </div>
      <div className="p-3 max-h-[300px] overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No alerts at this time</p>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-md border ${getAlertBgClass(alert.level)}`}
              >
                <div className={`mt-0.5 h-3 w-3 rounded-full ${getAlertDotClass(alert.level)}`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${getAlertTextClass(alert.level)}`}>{alert.message}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{alert.time}</span>
                  </div>
                  {alert.worker && <p className="text-xs text-gray-600 mt-1">Worker: {alert.worker}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {alerts.length > 5 && (
        <div className="p-2 border-t text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800">View all {alerts.length} alerts</button>
        </div>
      )}
    </div>
  )
}

export default AlertsPanel
