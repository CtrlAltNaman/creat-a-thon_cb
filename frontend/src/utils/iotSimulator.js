import { updateSensorReading, updateWorkerVitals, updateDeviceStatus } from "./dataUploader"

// This is a simulation script to demonstrate how IoT devices could send data
// In a real implementation, this would be replaced with actual IoT device code

// Simulate temperature sensor
export async function simulateTemperatureSensor(sensorId = "temp-sensor-1") {
  // Generate a random temperature between 20 and 35°C
  const temperature = 20 + Math.random() * 15

  // Determine status based on temperature
  let status = "normal"
  if (temperature > 30) {
    status = "critical"
  } else if (temperature > 27) {
    status = "warning"
  }

  // Send the data to Firebase
  await updateSensorReading(sensorId, Number.parseFloat(temperature.toFixed(1)), status)

  console.log(`Temperature sensor ${sensorId}: ${temperature.toFixed(1)}°C (${status})`)
}

// Simulate gas detector
export async function simulateGasDetector(sensorId = "gas-sensor-1") {
  // Generate a random gas level between 0 and 50 ppm
  const gasLevel = Math.random() * 50

  // Determine status based on gas level
  let status = "normal"
  if (gasLevel > 30) {
    status = "critical"
  } else if (gasLevel > 20) {
    status = "warning"
  }

  // Send the data to Firebase
  await updateSensorReading(sensorId, Number.parseInt(gasLevel), status)

  console.log(`Gas detector ${sensorId}: ${Number.parseInt(gasLevel)} ppm (${status})`)
}

// Simulate wearable device
export async function simulateWearableDevice(workerId = "1", deviceId = "WD-001") {
  // Generate random vitals
  const heartRate = 60 + Math.random() * 70 // 60-130 BPM

  // Randomly determine motion status
  const motionStatuses = ["moving", "stationary", "fallen"]
  const motionStatus = motionStatuses[Math.floor(Math.random() * (motionStatuses.length - 0.1))]

  // Generate random device metrics
  const batteryLevel = Math.max(0, 100 - Math.random() * 30) // 70-100%
  const signalStrength = Math.max(0, 100 - Math.random() * 40) // 60-100%

  // Send worker vitals to Firebase
  await updateWorkerVitals(workerId, Number.parseInt(heartRate), motionStatus)

  // Send device status to Firebase
  await updateDeviceStatus(deviceId, Number.parseFloat(batteryLevel.toFixed(1)), Number.parseInt(signalStrength))

  console.log(`Wearable device ${deviceId} for worker ${workerId}:`)
  console.log(`- Heart rate: ${Number.parseInt(heartRate)} BPM`)
  console.log(`- Motion: ${motionStatus}`)
  console.log(`- Battery: ${batteryLevel.toFixed(1)}%`)
  console.log(`- Signal: ${Number.parseInt(signalStrength)}%`)
}

// Run all simulations
export async function runAllSimulations() {
  await simulateTemperatureSensor()
  await simulateGasDetector()
  await simulateWearableDevice()

  console.log("All simulations completed")
}

// This function could be called periodically to simulate real-time data
// setInterval(runAllSimulations, 30000); // Run every 30 seconds
