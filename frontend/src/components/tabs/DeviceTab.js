import StatusBadge from "../StatusBadge"

function DeviceTab({ devices }) {
  const getTextColorClass = (status) => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-orange-600"
      case "normal":
        return "text-green-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {devices.map((device) => (
        <div
          key={device.id}
          className={`bg-white rounded-lg border shadow-sm ${device.status === "critical" ? "border-red-500" : "border-gray-200"}`}
        >
          <div className="p-3">
            <div className="flex justify-between items-center">
              <h3 className={`text-sm font-medium ${getTextColorClass(device.status)}`}>{device.name}</h3>
              <StatusBadge status={device.status} />
            </div>
            <p className="text-xs text-gray-500">
              {device.type.charAt(0).toUpperCase() + device.type.slice(1)} Detector
            </p>
          </div>
          <div className="px-3 pb-3 pt-0">
            <div className="text-xs text-gray-500">Last checked: {device.lastChecked}</div>
          </div>
          <div className="px-3 pb-3">
            <button className="w-full py-1.5 px-3 text-xs rounded-md bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
              Test Device
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeviceTab
