"use client"

import type { ApexOptions } from "apexcharts"
import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

interface ChartTwoProps {
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

const ChartTwo: React.FC<ChartTwoProps> = ({ sales = [] }) => {
  // State for chart data
  const [chartData, setChartData] = useState({
    dailySales: [0, 0, 0, 0, 0, 0, 0], // Monday to Sunday
    dailyRevenue: [0, 0, 0, 0, 0, 0, 0], // Monday to Sunday
  })

  // Process sales data when it changes
  useEffect(() => {
    if (!sales || sales.length === 0) return

    // Initialize arrays for each day of the week
    const dailySalesCount = [0, 0, 0, 0, 0, 0, 0] // Monday to Sunday
    const dailyRevenueAmount = [0, 0, 0, 0, 0, 0, 0] // Monday to Sunday

    // Process sales data
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt)
      const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Convert to our array index (0 = Monday, ..., 6 = Sunday)
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

      // Increment sales count for this day
      dailySalesCount[dayIndex] += 1

      // Add payment amount to revenue for this day
      dailyRevenueAmount[dayIndex] += sale.PaymentAmount // Use full amount for PKR
    })

    // Update chart data
    setChartData({
      dailySales: dailySalesCount,
      dailyRevenue: dailyRevenueAmount,
    })
  }, [sales])

  const options: ApexOptions = {
    colors: ["#228B22", "#32CD32"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: "#1e293b", // Dark background
      foreColor: "#94a3b8", // Light text color for axes and labels
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      labels: {
        style: {
          colors: "#94a3b8", // Light text color
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val.toLocaleString("en-PK", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }),
        style: {
          colors: "#94a3b8", // Light text color
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      labels: {
        colors: "#f8fafc", // Light text color for legend
      },
      markers: {
        size: 5,
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: "#334155", // Darker grid lines
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => "PKR " + val.toLocaleString("en-PK"),
      },
      theme: "dark",
    },
  }

  const series = [
    {
      name: "Sales",
      data: chartData.dailySales,
    },
    {
      name: "Revenue (PKR)",
      data: chartData.dailyRevenue,
    },
  ]

  // Function to handle time period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // In a real application, you would fetch different data based on the selected period
    console.log("Period changed to:", e.target.value)
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-[#1e293b] p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-white">Profit this week</h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="period"
              id="period"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium text-slate-300 outline-none"
              onChange={handlePeriodChange}
            >
              <option value="this-week" className="bg-[#1e293b]">
                This Week
              </option>
              <option value="last-week" className="bg-[#1e293b]">
                Last Week
              </option>
              <option value="last-month" className="bg-[#1e293b]">
                Last Month
              </option>
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#94a3b8"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#94a3b8"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart options={options} series={series} type="bar" height={350} width={"100%"} />
        </div>
      </div>
    </div>
  )
}

export default ChartTwo

