function StatusBadge({ status }) {
  const getBadgeClass = () => {
    switch (status) {
      case "normal":
        return "bg-green-500"
      case "warning":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500 animate-pulse"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-white ${getBadgeClass()}`}
    >
      {status === "offline" ? "Offline" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge
