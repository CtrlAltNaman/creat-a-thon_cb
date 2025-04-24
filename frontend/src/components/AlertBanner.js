import { Flame, Info } from "./icons"

function AlertBanner({ type, title, message }) {
  const getAlertClass = () => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-500 text-red-700 animate-pulse"
      case "warning":
        return "bg-orange-50 border-orange-500 text-orange-700"
      default:
        return "bg-blue-50 border-blue-500 text-blue-700"
    }
  }

  const Icon = type === "critical" ? Flame : Info

  return (
    <div className={`rounded-lg border p-4 ${getAlertClass()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold">{title}</h3>
          <div className="mt-1 text-sm">{message}</div>
        </div>
      </div>
    </div>
  )
}

export default AlertBanner
