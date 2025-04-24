function HistoryTab({ alerts }) {
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

  const getAlertTextClass = (level) => {
    switch (level) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-orange-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700">Alert History</h3>
        <p className="text-xs text-gray-500">Recent alerts and system events</p>
      </div>
      <div className="p-3 pt-0">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
              <div className={`mt-0.5 h-2 w-2 rounded-full ${getAlertDotClass(alert.level)}`} />
              <div className="grid gap-1">
                <p className={`text-sm font-medium ${getAlertTextClass(alert.level)}`}>{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistoryTab
