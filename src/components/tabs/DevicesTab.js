function DevicesTab({ devices }) {
  const getDeviceStatusClass = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 border-red-300"
      case "warning":
        return "bg-orange-100 border-orange-300"
      case "normal":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getBatteryClass = (level) => {
    if (level < 20) return "text-red-600"
    if (level < 50) return "text-orange-600"
    return "text-green-600"
  }

  const getSignalClass = (strength) => {
    if (strength === 0) return "text-gray-400"
    if (strength < 40) return "text-red-600"
    if (strength < 70) return "text-orange-600"
    return "text-green-600"
  }

  const getSignalIcon = (strength) => {
    if (strength === 0) {
      return (
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072m-3.183 1.757a2 2 0 010 3.536"
          />
          <line x1="2" y1="2" x2="22" y2="22" strokeWidth={2} />
        </svg>
      )
    } else if (strength < 40) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0"
          />
        </svg>
      )
    } else if (strength < 70) {
      return (
        <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M12 4c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z"
          />
        </svg>
      )
    } else {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M12 4c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z"
          />
        </svg>
      )
    }
  }

  if (devices.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No device data available</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {devices.map((device) => (
        <div key={device.id} className={`rounded-lg border shadow-sm ${getDeviceStatusClass(device.status)}`}>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{device.id}</h3>
                <p className="text-sm text-gray-600">
                  {device.type} • {device.assignedTo}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  device.status === "critical"
                    ? "bg-red-500 text-white"
                    : device.status === "warning"
                      ? "bg-orange-500 text-white"
                      : device.status === "normal"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                }`}
              >
                {device.status === "normal" ? "Online" : device.status.charAt(0).toUpperCase() + device.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Battery Level</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className={`h-2.5 rounded-full ${
                        device.batteryLevel < 20
                          ? "bg-red-500"
                          : device.batteryLevel < 50
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${device.batteryLevel}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getBatteryClass(device.batteryLevel)}`}>
                    {device.batteryLevel.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Signal Strength</p>
                <div className="flex items-center">
                  <div className="mr-1">{getSignalIcon(device.signalStrength)}</div>
                  <span className={`text-sm font-medium ${getSignalClass(device.signalStrength)}`}>
                    {device.signalStrength > 0 ? `${device.signalStrength}%` : "No Signal"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Firmware Version</p>
                <p className="text-sm">{device.firmwareVersion}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Sync</p>
                <p className="text-sm">{device.lastSync}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={device.status === "offline"}
              >
                Check Status
              </button>
              <button className="py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DevicesTab
