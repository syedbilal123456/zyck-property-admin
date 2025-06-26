"use client"

import type { ApexOptions } from "apexcharts"
import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

interface ChartOneProps {
  sales?: {
    id: string
    invoiceNo: string
    PropertyTitle: string
    PaymentAmount: number
    PaymentMethod: string
    PaymentGender: string
    userId: string
    createdAt: Date
  }[]
}

const ChartOne: React.FC<ChartOneProps> = ({ sales = [] }) => {
  // Process sales data for the chart
  const [chartData, setChartData] = useState({
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    totalRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalSales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  })

  // Process sales data when it changes
  useEffect(() => {
    if (!sales || sales.length === 0) return

    // Initialize arrays for each month
    const monthlyRevenue = Array(12).fill(0)
    const monthlySalesCount = Array(12).fill(0)

    // Process sales data
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt)
      const month = date.getMonth() // 0-11

      // Add payment amount to revenue for this month
      monthlyRevenue[month] += sale.PaymentAmount

      // Increment sales count for this month
      monthlySalesCount[month] += 1
    })

    // Update chart data
    setChartData({
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      totalRevenue: monthlyRevenue,
      totalSales: monthlySalesCount.map((count) => count * 10), // Scale count for better visualization
    })
  }, [sales])

  // Update options with dynamic categories
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#00FF00", "#7CFC00"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: Math.max(...chartData.totalRevenue) * 1.2 || 100, // Dynamic max based on data
      labels: {
        formatter: (val) => "PKR " + val.toLocaleString("en-PK"),
      },
    },
    tooltip: {
      y: {
        formatter: (val) => "PKR " + val.toLocaleString("en-PK"),
      },
    },
  }

  const series = [
    {
      name: "Total Revenue (PKR)",
      data: chartData.totalRevenue,
    },
    {
      name: "Total Sales",
      data: chartData.totalSales,
    },
  ]

  // Get current date range for display
  const getCurrentDateRange = () => {
    const today = new Date()
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    return `${lastMonth.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} - ${today.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}`
  }

  const dateRange = getCurrentDateRange()

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-green-500">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#7CFC00]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#7CFC00]">Total Revenue (PKR)</p>
              <p className="text-sm font-medium">{dateRange}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-green-900">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#00FF00]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#00FF00]">Total Sales</p>
              <p className="text-sm font-medium">{dateRange}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-1 max-w-45 justify-end">
          <div className="inline-flex items-center gap-2 rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-green-500 transition-colors duration-150 px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-green-500 transition-colors duration-150 hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-green-500 transition-colors duration-150 hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart options={options} series={series} type="area" height={350} width={"100%"} />
        </div>
      </div>
    </div>
  )
}

export default ChartOne

