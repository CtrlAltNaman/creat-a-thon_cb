import { updateSensor, updateWorker, updateDevice, createAlert } from "../firebase/firebase"

// This file contains utility functions to send data to Firebase
// You can use these functions to update sensor readings from your IoT devices

// Update a sensor reading
export async function updateSensorReading(sensorId, value, status) {
  try {
    await updateSensor(sensorId, {
      value,
      status,
    })

    // If the status is critical or warning, create an alert
    if (status === "critical" || status === "warning") {
      await createAlert({
        message: `${status === "critical" ? "CRITICAL" : "Warning"}: Sensor ${sensorId} reading at ${value}`,
        level: status,
        worker: null,
      })
    }

    return true
  } catch (error) {
    console.error("Error updating sensor reading:", error)
    return false
  }
}

// Update worker vitals
export async function updateWorkerVitals(workerId, heartRate, motionStatus) {
  try {
    // Determine status based on heart rate and motion
    let status = "active"
    let fallDetected = false

    if (motionStatus === "fallen") {
      status = "critical"
      fallDetected = true
    } else if (heartRate > 100) {
      status = "warning"
    } else if (motionStatus === "stationary" && heartRate > 90) {
      status = "warning"
    }

    await updateWorker(workerId, {
      heartRate,
      motionStatus,
      status,
      fallDetected,
    })

    // Create alert for critical situations
    if (status === "critical") {
      const worker = await getWorkerById(workerId)
      await createAlert({
        message: `EMERGENCY: ${fallDetected ? "Fall detected" : "Critical vitals"} for ${worker.name}`,
        level: "critical",
        worker: worker.name,
      })
    }

    return true
  } catch (error) {
    console.error("Error updating worker vitals:", error)
    return false
  }
}

// Update device status
export async function updateDeviceStatus(deviceId, batteryLevel, signalStrength) {
  try {
    // Determine status based on battery and signal
    let status = "normal"

    if (signalStrength === 0) {
      status = "offline"
    } else if (batteryLevel < 15) {
      status = "warning"
    } else if (signalStrength < 40) {
      status = "warning"
    }

    await updateDevice(deviceId, {
      batteryLevel,
      signalStrength,
      status,
    })

    // Create alert for low battery
    if (batteryLevel < 15 && status !== "offline") {
      const device = await getDeviceById(deviceId)
      await createAlert({
        message: `Warning: Low battery (${batteryLevel}%) on device ${deviceId}`,
        level: "warning",
        worker: device.assignedTo,
      })
    }

    return true
  } catch (error) {
    console.error("Error updating device status:", error)
    return false
  }
}

// Helper function to get worker by ID
async function getWorkerById(workerId) {
  // Implementation would depend on your Firebase structure
  // This is a placeholder
  return { name: "Unknown Worker" }
}

// Helper function to get device by ID
async function getDeviceById(deviceId) {
  // Implementation would depend on your Firebase structure
  // This is a placeholder
  return { assignedTo: "Unknown Worker" }
}
