import { Chart } from "@/components/ui/chart"
class DomainDashboard {
  constructor() {
    this.data = []
    this.charts = {}
    this.config = this.loadConfig()
    this.init()
  }

  init() {
    this.setupEventListeners()
    if (this.config.sheetsId && this.config.apiKey) {
      this.loadData()
    } else {
      this.showConfigModal()
    }
  }

  setupEventListeners() {
    document.getElementById("refreshBtn").addEventListener("click", () => this.loadData())
    document.getElementById("retryBtn").addEventListener("click", () => this.loadData())
    document.getElementById("searchInput").addEventListener("input", (e) => this.filterTable(e.target.value))
    document.getElementById("sortSelect").addEventListener("change", (e) => this.sortTable(e.target.value))

    // Config modal events
    document.getElementById("saveConfig").addEventListener("click", () => this.saveConfig())
    document.getElementById("cancelConfig").addEventListener("click", () => this.hideConfigModal())
  }

  loadConfig() {
    const saved = localStorage.getItem("dashboardConfig")
    return saved
      ? JSON.parse(saved)
      : {
          sheetsId: "",
          apiKey: "",
          sheetName: "Sheet1",
        }
  }

  saveConfig() {
    const config = {
      sheetsId: document.getElementById("sheetsId").value,
      apiKey: document.getElementById("apiKey").value,
      sheetName: document.getElementById("sheetName").value || "Sheet1",
    }

    if (!config.sheetsId || !config.apiKey) {
      alert("Vui lòng nhập đầy đủ thông tin cấu hình")
      return
    }

    this.config = config
    localStorage.setItem("dashboardConfig", JSON.stringify(config))
    this.hideConfigModal()
    this.loadData()
  }

  showConfigModal() {
    document.getElementById("sheetsId").value = this.config.sheetsId
    document.getElementById("apiKey").value = this.config.apiKey
    document.getElementById("sheetName").value = this.config.sheetName
    document.getElementById("configModal").classList.remove("hidden")
    document.getElementById("configModal").classList.add("flex")
  }

  hideConfigModal() {
    document.getElementById("configModal").classList.add("hidden")
    document.getElementById("configModal").classList.remove("flex")
  }

  async loadData() {
    this.showLoading()

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.sheetsId}/values/${this.config.sheetName}?key=${this.config.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      this.processData(result.values)
      this.renderDashboard()
      this.updateLastUpdateTime()
    } catch (error) {
      console.error("Error loading data:", error)
      this.showError()
    }
  }

  processData(rawData) {
    if (!rawData || rawData.length < 2) {
      throw new Error("Dữ liệu không hợp lệ")
    }

    // Assuming data structure: [Province, ID.VN, BIZ.VN]
    const headers = rawData[0]
    this.data = rawData
      .slice(1)
      .map((row, index) => ({
        stt: index + 1,
        province: row[0] || "",
        id_vn: Number.parseInt(row[1]) || 0,
        biz_vn: Number.parseInt(row[2]) || 0,
        total: (Number.parseInt(row[1]) || 0) + (Number.parseInt(row[2]) || 0),
      }))
      .filter((item) => item.province) // Filter out empty rows
  }

  renderDashboard() {
    this.updateSummaryCards()
    this.renderCharts()
    this.renderTable()
    this.showDashboard()
  }

  updateSummaryCards() {
    const totalIdVn = this.data.reduce((sum, item) => sum + item.id_vn, 0)
    const totalBizVn = this.data.reduce((sum, item) => sum + item.biz_vn, 0)
    const totalProvinces = this.data.length
    const totalDomains = totalIdVn + totalBizVn

    document.getElementById("totalIdVn").textContent = totalIdVn.toLocaleString()
    document.getElementById("totalBizVn").textContent = totalBizVn.toLocaleString()
    document.getElementById("totalProvinces").textContent = totalProvinces.toLocaleString()
    document.getElementById("totalDomains").textContent = totalDomains.toLocaleString()
  }

  renderCharts() {
    this.renderDomainTypeChart()
    this.renderTopProvincesChart()
  }

  renderDomainTypeChart() {
    const ctx = document.getElementById("domainTypeChart").getContext("2d")

    if (this.charts.domainType) {
      this.charts.domainType.destroy()
    }

    const totalIdVn = this.data.reduce((sum, item) => sum + item.id_vn, 0)
    const totalBizVn = this.data.reduce((sum, item) => sum + item.biz_vn, 0)

    this.charts.domainType = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["ID.VN", "BIZ.VN"],
        datasets: [
          {
            data: [totalIdVn, totalBizVn],
            backgroundColor: ["#3B82F6", "#10B981"],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    })
  }

  renderTopProvincesChart() {
    const ctx = document.getElementById("topProvincesChart").getContext("2d")

    if (this.charts.topProvinces) {
      this.charts.topProvinces.destroy()
    }

    const sortedData = [...this.data].sort((a, b) => b.total - a.total).slice(0, 10)

    this.charts.topProvinces = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedData.map((item) => item.province),
        datasets: [
          {
            label: "ID.VN",
            data: sortedData.map((item) => item.id_vn),
            backgroundColor: "#3B82F6",
          },
          {
            label: "BIZ.VN",
            data: sortedData.map((item) => item.biz_vn),
            backgroundColor: "#10B981",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    })
  }

  renderTable(filteredData = null) {
    const data = filteredData || this.data
    const tbody = document.getElementById("dataTableBody")

    tbody.innerHTML = data
      .map((item) => {
        const percentage = ((item.total / this.data.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(1)

        return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.stt}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.province}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.id_vn.toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.biz_vn.toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${item.total.toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${percentage}%</td>
                </tr>
            `
      })
      .join("")
  }

  filterTable(searchTerm) {
    const filtered = this.data.filter((item) => item.province.toLowerCase().includes(searchTerm.toLowerCase()))
    this.renderTable(filtered)
  }

  sortTable(sortBy) {
    const sorted = [...this.data]

    switch (sortBy) {
      case "province":
        sorted.sort((a, b) => a.province.localeCompare(b.province))
        break
      case "total":
        sorted.sort((a, b) => b.total - a.total)
        break
      case "id_vn":
        sorted.sort((a, b) => b.id_vn - a.id_vn)
        break
      case "biz_vn":
        sorted.sort((a, b) => b.biz_vn - a.biz_vn)
        break
    }

    this.renderTable(sorted)
  }

  updateLastUpdateTime() {
    const now = new Date()
    const timeString = now.toLocaleString("vi-VN")
    document.getElementById("lastUpdate").textContent = timeString
  }

  showLoading() {
    document.getElementById("loadingState").classList.remove("hidden")
    document.getElementById("dashboardContent").classList.add("hidden")
    document.getElementById("errorState").classList.add("hidden")
  }

  showDashboard() {
    document.getElementById("loadingState").classList.add("hidden")
    document.getElementById("dashboardContent").classList.remove("hidden")
    document.getElementById("errorState").classList.add("hidden")
  }

  showError() {
    document.getElementById("loadingState").classList.add("hidden")
    document.getElementById("dashboardContent").classList.add("hidden")
    document.getElementById("errorState").classList.remove("hidden")
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DomainDashboard()
})
