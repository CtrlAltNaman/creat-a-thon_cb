const WebSocket = require('ws');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin
// Set SERVICE_ACCOUNT_KEY in your .env file as a JSON string
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://real-time-database-4f52e-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();
const currentValuesRef = db.ref('CurrentValues');

// Thresholds for gas sensors (in percentage)
const THRESHOLDS = {
  CH4: 10.0,     // Methane threshold
  VOC: 25.0,     // VOC threshold
  H2: 15.0,      // Hydrogen threshold
  Alcohol: 20.0  // Alcohol threshold
};

// Start WebSocket server
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Function to process and broadcast sensor data
  function processSensorData(data) {
    const sensors = data.val();
    console.log('Received sensor data:', sensors);

    // Process each gas sensor
    ['CH4', 'VOC', 'H2', 'Alcohol'].forEach(gasType => {
      if (sensors[gasType] && sensors[gasType].percentage !== undefined) {
        const percentage = sensors[gasType].percentage;
        const threshold = THRESHOLDS[gasType];
        const isAlert = percentage > threshold;

        const sensorPacket = {
          type: 'sensor_data',
          sensor: gasType,
          value: percentage,
          raw: sensors[gasType].raw,
          voltage: sensors[gasType].voltage,
          alert: isAlert,
          threshold: threshold,
          status: isAlert ? "critical" : "normal",
          ...(isAlert && {
            message: `ALERT: ${gasType} level exceeded threshold (${threshold}%) with value ${percentage.toFixed(2)}%`
          })
        };

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(sensorPacket));
        }
      }
    });

    // Handle overall alert status
    if (sensors.alert !== undefined) {
      const alertPacket = {
        type: 'system_alert',
        alert: sensors.alert === 1,
        timestamp: sensors.timestamp || new Date().toISOString()
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(alertPacket));
      }
    }
  }

  // Set up Firebase listener
  const listener = currentValuesRef.on('value', 
    snapshot => {
      if (snapshot.exists()) {
        processSensorData(snapshot);
      } else {
        console.log('No sensor data available.');
      }
    },
    errorObject => {
      console.log('Firebase read failed: ' + errorObject.name);
    }
  );

  ws.on('error', (error) => {
    console.error('WebSocket Client Error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Clean up Firebase listener
    currentValuesRef.off('value', listener);
  });
});

console.log('WebSocket server is running on ws://localhost:8081');

