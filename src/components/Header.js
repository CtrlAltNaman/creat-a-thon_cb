"use client"
import { Bell, RefreshCw } from "./icons"
import MobileMenu from "./MobileMenu"

function Header({ isRefreshing, onRefresh }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MobileMenu />
        <div className="flex items-center gap-2">
          <div className="text-blue-500 hidden sm:block">
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
          <h1 className="font-bold text-lg">SafetyGuard</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </button>
        <button className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  )
}

export default Header
