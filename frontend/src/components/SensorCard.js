function SensorCard({ title, value, percentage, getColor, currentValue }) {
  const progressColor = getColor(currentValue)
  const textColorClass = progressColor.replace("bg-", "text-")

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div className="px-3 pb-3 pt-0">
        <div className={`text-xl font-bold ${textColorClass}`}>{value}</div>
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  )
}

export default SensorCard
