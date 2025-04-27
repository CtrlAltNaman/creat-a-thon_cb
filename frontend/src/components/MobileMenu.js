"use client"

import { useState } from "react"
import { Menu, Home, Bell, Activity, Settings } from "./icons"

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center gap-2">
              <div className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
              </div>
              <h2 className="font-bold">SafetyGuard</h2>
            </div>
            <div className="p-2">
              <button
                className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </button>
              <button
                className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-5 w-5" />
                Alerts
              </button>
              <button
                className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-5 w-5" />
                Workers
              </button>
              <button
                className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
            </div>
            <div className="border-t mt-4 p-4">
              <div className="text-sm text-gray-500">System Status: Online</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileMenu
