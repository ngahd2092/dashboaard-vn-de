"use client"

import { useMemo } from "react"
import { Doughnut, Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface ProvinceData {
  stt: number
  province: string
  region: "north" | "central" | "south"
  id_vn: number
  biz_vn: number
  total: number
}

interface ChartsProps {
  data: ProvinceData[]
}

export default function Charts({ data }: ChartsProps) {
  const doughnutData = useMemo(() => {
    const totalIdVn = data.reduce((sum, item) => sum + item.id_vn, 0)
    const totalBizVn = data.reduce((sum, item) => sum + item.biz_vn, 0)

    return {
      labels: ["ID.VN", "BIZ.VN"],
      datasets: [
        {
          data: [totalIdVn, totalBizVn],
          backgroundColor: ["#3B82F6", "#10B981"],
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverBorderWidth: 4,
          hoverOffset: 10,
        },
      ],
    }
  }, [data])

  const barData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => b.total - a.total).slice(0, 10)

    return {
      labels: sortedData.map((item) => item.province),
      datasets: [
        {
          label: "ID.VN",
          data: sortedData.map((item) => item.id_vn),
          backgroundColor: "#3B82F6",
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: "BIZ.VN",
          data: sortedData.map((item) => item.biz_vn),
          backgroundColor: "#10B981",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    }
  }, [data])

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = doughnutData.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          footer: (tooltipItems: any[]) => {
            let total = 0
            tooltipItems.forEach((tooltipItem) => {
              total += tooltipItem.parsed.y
            })
            return `Tổng: ${total.toLocaleString()}`
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart" as const,
    },
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Phân bố tên miền theo loại</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <i className="fas fa-chart-pie"></i>
            <span>Tỷ lệ phần trăm</span>
          </div>
        </div>
        <div className="relative h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top 10 tỉnh có nhiều tên miền nhất</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <i className="fas fa-chart-bar"></i>
            <span>Số lượng</span>
          </div>
        </div>
        <div className="relative h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </>
  )
}
