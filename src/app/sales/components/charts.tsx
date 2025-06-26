"use client"
import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react"
import ChartOne from "@/components/Charts/ChartOne"
import ChartTwo from "@/components/Charts/ChartTwo"

type User = {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  id: string
}

interface Props {
  sales: {
    id: string
    invoiceNo: string
    PropertyTitle: string
    PaymentAmount: number
    PaymentMethod: string
    PaymentGender: string
    userId: string
    createdAt: Date
  }[]
  User: User[]
}

type SortField = "invoiceNo" | "PropertyTitle" | "PaymentAmount" | "PaymentMethod" | "PaymentGender" | "createdAt"
type SortDirection = "asc" | "desc"

const SalesDataTable = ({ sales, User }: Props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Helper function to get user data
  const getUserData = (userId: string) => {
    return User.find((user) => user.id === userId) || null
  }

  // Sort and filter data
  const filteredAndSortedData = useMemo(() => {
    // Filter data based on search term
    const filtered = sales.filter((sale) => {
      const user = User.find((user) => user.id === sale.userId)
      return (
        sale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.PropertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.PaymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user?.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
    })

    // Sort data
    return [...filtered].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle date comparison
      if (sortField === "createdAt") {
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  }, [sales, User, sortField, sortDirection, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)

  // Handle sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-30" />
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  // Determine which columns to show based on screen width
  const getVisibleColumns = () => {
    if (windowWidth < 640) {
      return {
        invoiceNo: true,
        propertyTitle: true,
        paymentAmount: true,
        paymentMethod: false,
        gender: false,
        name: false,
        email: false,
        phone: false,
        date: false,
      }
    } else if (windowWidth < 768) {
      return {
        invoiceNo: true,
        propertyTitle: true,
        paymentAmount: true,
        paymentMethod: true,
        gender: false,
        name: true,
        email: false,
        phone: false,
        date: true,
      }
    } else if (windowWidth < 1024) {
      return {
        invoiceNo: true,
        propertyTitle: true,
        paymentAmount: true,
        paymentMethod: true,
        gender: true,
        name: true,
        email: true,
        phone: false,
        date: true,
      }
    } else {
      return {
        invoiceNo: true,
        propertyTitle: true,
        paymentAmount: true,
        paymentMethod: true,
        gender: true,
        name: true,
        email: true,
        phone: true,
        date: true,
      }
    }
  }

  const visibleColumns = getVisibleColumns()

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <ChartOne  sales={sales}/>
      <ChartTwo sales={sales} />
      <div className="col-span-12">
        <div className="w-[81vw] rounded-sm border -ml-7 border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {/* Table Header with Search */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h4 className="text-xl font-semibold text-black dark:text-white">Sales Data</h4>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-stroke rounded-md leading-5 bg-white dark:bg-boxdark dark:border-strokedark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search invoices, properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Responsive Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-stroke dark:divide-strokedark table-fixed">
              <thead className="bg-gray-2 dark:bg-meta-4">
                <tr>
                  {visibleColumns.invoiceNo && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider cursor-pointer w-1/6 sm:w-auto"
                      onClick={() => handleSort("invoiceNo")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Invoice No</span>
                        {renderSortIcon("invoiceNo")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.paymentAmount && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider cursor-pointer w-1/6 sm:w-auto"
                      onClick={() => handleSort("PaymentAmount")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {renderSortIcon("PaymentAmount")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.paymentMethod && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider cursor-pointer sm:w-auto"
                      onClick={() => handleSort("PaymentMethod")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Method</span>
                        {renderSortIcon("PaymentMethod")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.gender && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider cursor-pointer sm:w-auto"
                      onClick={() => handleSort("PaymentGender")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Gender</span>
                        {renderSortIcon("PaymentGender")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.name && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider sm:w-auto"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider sm:w-auto"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.phone && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider sm:w-auto"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Phone</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.date && (
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider cursor-pointer sm:w-auto"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {renderSortIcon("createdAt")}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-boxdark divide-y divide-stroke dark:divide-strokedark">
                {paginatedData.length > 0 ? (
                  paginatedData.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors duration-200">
                      {visibleColumns.invoiceNo && (
                        <td className="px-3 py-4 text-sm font-medium text-black dark:text-white truncate">
                          {sale.invoiceNo}
                        </td>
                      )}
                      {visibleColumns.paymentAmount && (
                        <td className="px-3 py-4 text-sm text-black dark:text-white font-medium whitespace-nowrap">
                          ${sale.PaymentAmount.toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.paymentMethod && (
                        <td className="px-3 py-4 text-sm text-body dark:text-bodydark">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.PaymentMethod === "Credit Card"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : sale.PaymentMethod === "Cash"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              }`}
                          >
                            {sale.PaymentMethod}
                          </span>
                        </td>
                      )}
                      {visibleColumns.gender && (
                        <td className="px-3 py-4 text-sm text-body dark:text-bodydark">{sale.PaymentGender}</td>
                      )}
                      {visibleColumns.name && (
                        <td className="px-3 py-4 text-sm text-body dark:text-bodydark truncate">
                          {getUserData(sale.userId)?.firstName} {getUserData(sale.userId)?.lastName}
                        </td>
                      )}
                      {visibleColumns.email && (
                        <td className="px-3 py-4 text-sm text-body dark:text-bodydark truncate">
                          {getUserData(sale.userId)?.email}
                        </td>
                      )}
                      {visibleColumns.phone && (
                        <td className="px-3 py-4 text-sm text-body dark:text-bodydark truncate">
                          {getUserData(sale.userId)?.phoneNumber || "N/A"}
                        </td>
                      )}
                      {visibleColumns.date && (
                        <td className="px-3 py-4 text-sm text-body dark:text-bodydark whitespace-nowrap">
                          {new Date(sale.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Object.values(visibleColumns).filter(Boolean).length}
                      className="px-6 py-10 text-center text-body dark:text-bodydark"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium text-black dark:text-white">No sales data available</p>
                        <p className="text-sm text-body dark:text-bodydark mt-1">
                          {searchTerm ? "Try adjusting your search criteria" : "Add some sales to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAndSortedData.length > 0 && (
            <div className="bg-white dark:bg-boxdark px-4 py-3 flex items-center justify-between border-t border-stroke dark:border-strokedark sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-stroke dark:border-strokedark text-sm font-medium rounded-md ${currentPage === 1
                      ? "bg-gray-100 dark:bg-meta-4 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-white dark:bg-boxdark text-black dark:text-white hover:bg-gray-2 dark:hover:bg-meta-4"
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-stroke dark:border-strokedark text-sm font-medium rounded-md ${currentPage === totalPages
                      ? "bg-gray-100 dark:bg-meta-4 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-white dark:bg-boxdark text-black dark:text-white hover:bg-gray-2 dark:hover:bg-meta-4"
                    }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-body dark:text-bodydark">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)}</span>{" "}
                    of <span className="font-medium">{filteredAndSortedData.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-stroke dark:border-strokedark bg-white dark:bg-boxdark text-sm font-medium ${currentPage === 1
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-2 dark:hover:bg-meta-4"
                        }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                              ? "z-10 bg-primary border-primary text-white"
                              : "bg-white dark:bg-boxdark border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4"
                            }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-stroke dark:border-strokedark bg-white dark:bg-boxdark text-sm font-medium ${currentPage === totalPages
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-2 dark:hover:bg-meta-4"
                        }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Items per page selector */}
          <div className="bg-gray-2 dark:bg-meta-4 px-4 py-3 border-t border-stroke dark:border-strokedark">
            <div className="flex items-center text-sm text-body dark:text-bodydark">
              <span>Show</span>
              <select
                className="mx-2 border-stroke dark:border-strokedark rounded-md bg-white dark:bg-boxdark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1) // Reset to first page when changing items per page
                }}
              >
                {[5, 10, 25, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span>entries per page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesDataTable

