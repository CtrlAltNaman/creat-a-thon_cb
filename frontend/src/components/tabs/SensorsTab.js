function SensorsTab({ sensors }) {
  const getSensorValueClass = (sensor) => {
    switch (sensor.status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-orange-600"
      case "normal":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getSensorBgClass = (sensor) => {
    switch (sensor.status) {
      case "critical":
        return "bg-red-50 border-red-300"
      case "warning":
        return "bg-orange-50 border-orange-300"
      case "normal":
        return "bg-green-50 border-green-300"
      default:
        return "bg-gray-50 border-gray-300"
    }
  }

  const getProgressColor = (sensor) => {
    switch (sensor.status) {
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

  // Calculate percentage for progress bars
  const calculatePercentage = (sensor) => {
    switch (sensor.name) {
      case "Temperature Sensor":
        return ((sensor.value - 15) / 25) * 100 // Range: 15-40°C
      case "Humidity Sensor":
        return sensor.value // Range: 0-100%
      case "Air Quality Sensor":
        return sensor.value // Range: 0-100 AQI
      case "Noise Level Sensor":
        return ((sensor.value - 30) / 70) * 100 // Range: 30-100 dB
      case "Gas Detector":
        return (sensor.value / 50) * 100 // Range: 0-50 ppm
      default:
        return 50
    }
  }

  if (sensors.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No sensor data available</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {sensors.map((sensor) => (
        <div key={sensor.id} className={`rounded-lg border shadow-sm ${getSensorBgClass(sensor)}`}>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{sensor.name}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  sensor.status === "critical"
                    ? "bg-red-500 text-white"
                    : sensor.status === "warning"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                }`}
              >
                {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-end">
                <span className={`text-2xl font-bold ${getSensorValueClass(sensor)}`}>
                  {typeof sensor.value === "number" ? sensor.value.toString() : sensor.value}
                  <span className="text-sm ml-1">{sensor.unit}</span>
                </span>
                <span className="text-xs text-gray-500">{sensor.location}</span>
              </div>
              {typeof sensor.value === "number" && (
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(sensor)}`}
                    style={{ width: `${Math.min(100, Math.max(0, calculatePercentage(sensor)))}%` }}
                  ></div>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">Last updated: {sensor.lastUpdated}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SensorsTab
