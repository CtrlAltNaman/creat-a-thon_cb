// firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAn7YL3gnflaYnNlWQMAOrySAgEasGpeC0",
  authDomain: "real-time-database-4f52e.firebaseapp.com",
  databaseURL: "https://real-time-database-4f52e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "real-time-database-4f52e",
  storageBucket: "real-time-database-4f52e.appspot.com",
  messagingSenderId: "your_sender_id", // Optional
  appId: "your_app_id", // Optional
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)