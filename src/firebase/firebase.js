import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import firebaseConfig from "./config"

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Collection references
const workersRef = collection(db, "workers")
const sensorsRef = collection(db, "sensors")
const devicesRef = collection(db, "devices")
const alertsRef = collection(db, "alerts")

// Get all workers
export const getWorkers = async () => {
  try {
    const snapshot = await getDocs(workersRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: formatTimestamp(doc.data().lastUpdated),
    }))
  } catch (error) {
    console.error("Error getting workers:", error)
    return []
  }
}

// Get all sensors
export const getSensors = async () => {
  try {
    const snapshot = await getDocs(sensorsRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: formatTimestamp(doc.data().lastUpdated),
    }))
  } catch (error) {
    console.error("Error getting sensors:", error)
    return []
  }
}

// Get all devices
export const getDevices = async () => {
  try {
    const snapshot = await getDocs(devicesRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastSync: formatTimestamp(doc.data().lastSync),
    }))
  } catch (error) {
    console.error("Error getting devices:", error)
    return []
  }
}

// Get recent alerts
export const getAlerts = async (limitCount = 10) => {
  try {
    const alertsQuery = query(alertsRef, orderBy("timestamp", "desc"), limit(limitCount))

    const snapshot = await getDocs(alertsQuery)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      time: formatTimestamp(doc.data().timestamp),
    }))
  } catch (error) {
    console.error("Error getting alerts:", error)
    return []
  }
}

// Update worker data
export const updateWorker = async (workerId, data) => {
  try {
    const workerRef = doc(db, "workers", workerId)
    await updateDoc(workerRef, {
      ...data,
      lastUpdated: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating worker:", error)
    return false
  }
}

// Update sensor data
export const updateSensor = async (sensorId, data) => {
  try {
    const sensorRef = doc(db, "sensors", sensorId)
    await updateDoc(sensorRef, {
      ...data,
      lastUpdated: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating sensor:", error)
    return false
  }
}

// Update device data
export const updateDevice = async (deviceId, data) => {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    await updateDoc(deviceRef, {
      ...data,
      lastSync: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating device:", error)
    return false
  }
}

// Create a new alert
export const createAlert = async (alertData) => {
  try {
    const newAlertRef = doc(collection(db, "alerts"))
    await setDoc(newAlertRef, {
      ...alertData,
      timestamp: serverTimestamp(),
    })
    return newAlertRef.id
  } catch (error) {
    console.error("Error creating alert:", error)
    return null
  }
}

// Set up real-time listeners
export const subscribeToWorkers = (callback) => {
  return onSnapshot(workersRef, (snapshot) => {
    const workers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: formatTimestamp(doc.data().lastUpdated),
    }))
    callback(workers)
  })
}

export const subscribeToSensors = (callback) => {
  return onSnapshot(sensorsRef, (snapshot) => {
    const sensors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: formatTimestamp(doc.data().lastUpdated),
    }))
    callback(sensors)
  })
}

export const subscribeToDevices = (callback) => {
  return onSnapshot(devicesRef, (snapshot) => {
    const devices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastSync: formatTimestamp(doc.data().lastSync),
    }))
    callback(devices)
  })
}

export const subscribeToAlerts = (callback, limitCount = 10) => {
  const alertsQuery = query(alertsRef, orderBy("timestamp", "desc"), limit(limitCount))

  return onSnapshot(alertsQuery, (snapshot) => {
    const alerts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      time: formatTimestamp(doc.data().timestamp),
    }))
    callback(alerts)
  })
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return "Unknown"

  if (timestamp instanceof Timestamp) {
    const now = new Date()
    const date = timestamp.toDate()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 24 * 60) return `${Math.floor(diffMins / 60)} hours ago`
    return date.toLocaleString()
  }

  return timestamp
}

export default db
