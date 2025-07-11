"use client"

interface RegionalStatsProps {
  stats: {
    north: number
    central: number
    south: number
  }
  selectedRegion: "north" | "central" | "south" | null
  onRegionSelect: (region: "north" | "central" | "south" | null) => void
}

export default function RegionalStats({ stats, selectedRegion, onRegionSelect }: RegionalStatsProps) {
  const regions = [
    {
      key: "north" as const,
      name: "Miền Bắc",
      value: stats.north,
      icon: "fas fa-mountain",
      color: "blue",
      description: "Từ Thanh Hóa trở ra Bắc",
    },
    {
      key: "central" as const,
      name: "Miền Trung",
      value: stats.central,
      icon: "fas fa-water",
      color: "green",
      description: "Từ Nghệ An đến Khánh Hòa",
    },
    {
      key: "south" as const,
      name: "Miền Nam",
      value: stats.south,
      icon: "fas fa-sun",
      color: "orange",
      description: "Từ Ninh Thuận trở vào Nam",
    },
  ]

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected
        ? "bg-blue-500 text-white shadow-lg transform scale-105"
        : "bg-blue-50 text-blue-600 hover:bg-blue-100",
      green: isSelected
        ? "bg-green-500 text-white shadow-lg transform scale-105"
        : "bg-green-50 text-green-600 hover:bg-green-100",
      orange: isSelected
        ? "bg-orange-500 text-white shadow-lg transform scale-105"
        : "bg-orange-50 text-orange-600 hover:bg-orange-100",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getValueColorClass = (color: string, isSelected: boolean) => {
    if (isSelected) return "text-white"
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Phân bố theo vùng miền</h3>
        <div className="flex items-center space-x-4">
          {selectedRegion && (
            <button
              onClick={() => onRegionSelect(null)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <i className="fas fa-times"></i>
              <span>Xem tất cả</span>
            </button>
          )}
          <div className="text-sm text-gray-500">
            <i className="fas fa-mouse-pointer"></i>
            <span className="ml-1">Click để xem chi tiết</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {regions.map((region) => {
          const isSelected = selectedRegion === region.key
          return (
            <button
              key={region.key}
              onClick={() => onRegionSelect(region.key)}
              className={`text-center p-6 rounded-lg transition-all duration-200 ${getColorClasses(region.color, isSelected)} cursor-pointer`}
            >
              <i className={`${region.icon} text-3xl mb-3 block`}></i>
              <h4 className={`font-semibold mb-2 ${isSelected ? "text-white" : "text-gray-900"}`}>{region.name}</h4>
              <p className={`text-2xl font-bold mb-1 ${getValueColorClass(region.color, isSelected)}`}>
                {region.value.toLocaleString()}
              </p>
              <p className={`text-sm mb-2 ${isSelected ? "text-white opacity-90" : "text-gray-600"}`}>tên miền</p>
              <p className={`text-xs ${isSelected ? "text-white opacity-75" : "text-gray-500"}`}>
                {region.description}
              </p>
              {isSelected && (
                <div className="mt-3 flex items-center justify-center">
                  <i className="fas fa-check-circle text-white"></i>
                  <span className="ml-2 text-sm font-medium text-white">Đang xem</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {!selectedRegion && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center text-gray-600">
            <i className="fas fa-info-circle mr-2"></i>
            <span className="text-sm">Click vào một vùng miền để xem chi tiết các tỉnh trong vùng đó</span>
          </div>
        </div>
      )}
    </div>
  )
}
