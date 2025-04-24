function StatusCard({ title, status, activeAlerts }) {
  const getStatusClass = () => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-orange-600"
      case "normal":
        return "text-green-600"
      default:
        return "text-gray-700"
    }
  }

  const getStatusBadgeClass = () => {
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

  const getStatusText = () => {
    switch (status) {
      case "critical":
        return "EMERGENCY"
      case "warning":
        return "Warning"
      case "normal":
        return "Normal"
      default:
        return "Unknown"
    }
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        status === "critical" ? "border-red-500 shadow-red-500/20 shadow-lg" : ""
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center mt-1">
            <div className={`h-2.5 w-2.5 rounded-full ${getStatusBadgeClass()} mr-2`}></div>
            <p className={`text-sm font-medium ${getStatusClass()}`}>System Status: {getStatusText()}</p>
            <span className="mx-2 text-gray-300">•</span>
            <p className="text-sm text-gray-600">
              {activeAlerts > 0 ? `${activeAlerts} active alert${activeAlerts > 1 ? "s" : ""}` : "All systems normal"}
            </p>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Last updated: </span>
          <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  )
}

export default StatusCard
