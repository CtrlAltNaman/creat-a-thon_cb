"use client"
import { useAlarm } from "../context/AlarmContext"
import { BellRing, BellOff, Shield, Phone } from "./icons"

function QuickActions({ className = "" }) {
  const { testAlarm, silenceAlarm, systemCheck } = useAlarm()

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
      </div>
      <div className="p-3 pt-0 grid grid-cols-2 gap-2">
        <button
          className="w-full py-2 px-4 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
          onClick={testAlarm}
        >
          <BellRing className="h-4 w-4" />
          Test Alarm
        </button>
        <button
          className="w-full py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
          onClick={silenceAlarm}
        >
          <BellOff className="h-4 w-4" />
          Silence Alarm
        </button>
        <button
          className="w-full py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
          onClick={systemCheck}
        >
          <Shield className="h-4 w-4" />
          System Check
        </button>
        <button className="w-full py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
          <Phone className="h-4 w-4" />
          Emergency Call
        </button>
      </div>
    </div>
  )
}

export default QuickActions
