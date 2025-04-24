"use client"

import { useState } from "react"
import { useAlarm } from "../context/AlarmContext"
import WorkersTab from "./tabs/WorkersTab"
import SensorsTab from "./tabs/SensorsTab"
import DevicesTab from "./tabs/DevicesTab"

function TabView() {
  const [activeTab, setActiveTab] = useState("workers")
  const { workers, devices, sensors } = useAlarm()

  return (
    <div className="w-full">
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "workers" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("workers")}
        >
          Worker Status
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "sensors" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("sensors")}
        >
          Sensor Readings
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "devices" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("devices")}
        >
          Device Info
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "workers" && <WorkersTab workers={workers} />}
        {activeTab === "sensors" && <SensorsTab sensors={sensors} />}
        {activeTab === "devices" && <DevicesTab devices={devices} />}
      </div>
    </div>
  )
}

export default TabView
