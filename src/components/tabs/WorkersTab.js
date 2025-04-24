"use client"

import { useAlarm } from "../../context/AlarmContext"

function WorkersTab({ workers }) {
  const { emergencyCall } = useAlarm()

  const getStatusClass = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 border-red-500 text-red-800"
      case "warning":
        return "bg-orange-100 border-orange-500 text-orange-800"
      case "active":
        return "bg-green-100 border-green-500 text-green-800"
      default:
        return "bg-gray-100 border-gray-500 text-gray-800"
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-orange-500 text-white"
      case "active":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getHeartRateClass = (rate) => {
    if (rate === 0) return "text-gray-500"
    if (rate > 100) return "text-red-600"
    if (rate > 90) return "text-orange-600"
    return "text-green-600"
  }

  const getMotionStatusText = (status) => {
    switch (status) {
      case "moving":
        return "Active Movement"
      case "stationary":
        return "Stationary"
      case "fallen":
        return "FALL DETECTED"
      default:
        return "Unknown"
    }
  }

  const getMotionStatusClass = (status) => {
    switch (status) {
      case "moving":
        return "text-green-600"
      case "stationary":
        return "text-orange-600"
      case "fallen":
        return "text-red-600 font-bold animate-pulse"
      default:
        return "text-gray-500"
    }
  }

  const handleEmergencyCall = async (workerId) => {
    const success = await emergencyCall(workerId)
    if (success) {
      // You could show a success notification here
      console.log("Emergency call initiated")
    } else {
      // You could show an error notification here
      console.error("Failed to initiate emergency call")
    }
  }

  if (workers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No worker data available</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {workers.map((worker) => (
        <div key={worker.id} className={`rounded-lg border shadow-sm ${getStatusClass(worker.status)}`}>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{worker.name}</h3>
                <p className="text-sm">{worker.position}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(worker.status)}`}>
                {worker.status === "active"
                  ? "Active"
                  : worker.status === "warning"
                    ? "Warning"
                    : worker.status === "critical"
                      ? "Emergency"
                      : "Offline"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Heart Rate</p>
                <p className={`text-lg font-medium ${getHeartRateClass(worker.heartRate)}`}>
                  {worker.heartRate > 0 ? `${worker.heartRate} BPM` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Motion Status</p>
                <p className={`text-sm font-medium ${getMotionStatusClass(worker.motionStatus)}`}>
                  {getMotionStatusText(worker.motionStatus)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm">{worker.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm">{worker.lastUpdated}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEmergencyCall(worker.id)}
                className="flex-1 py-2 px-3 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={worker.status === "offline"}
              >
                Emergency Call
              </button>
              <button
                className="py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={worker.status === "offline"}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkersTab
