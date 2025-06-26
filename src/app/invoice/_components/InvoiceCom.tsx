"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { jsPDF } from "jspdf"

// Define PaymentGender manually if not exported by @prisma/client
enum PaymentGender {
  DIRECT_CLIENTS = "DIRECT_CLIENTS",
  AGENCIES = "AGENCIES",
  AGENT = "AGENT",
  PROJECT = "PROJECT",
}

// Define PaymentMethod manually if not exported by @prisma/client
enum PaymentMethod {
  JAZZ_CASH = "JAZZ_CASH",
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
}

interface InvoiceFormProps {
  users: {
    id: string
    firstName: string
    lastName: string
    email: string
  }[]
  paymentGenders?: PaymentGender[]
  paymentMethods?: PaymentMethod[]
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  firstName: string
  lastName: string
  propertyTitle: string
  paymentMethod: PaymentMethod | ""
  paymentGender: PaymentGender | ""
  payment: number
  date: string
  email: string
  customerName: string
}

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  isVisible: boolean
}

const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const time = date.getTime().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()

  return `ZYCK-${year}${month}${day}-${time}-${random}`
}

export default function ZyckInvoice({ users }: InvoiceFormProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: "",
    invoiceNumber: generateInvoiceNumber(),
    firstName: "",
    lastName: "",
    propertyTitle: "",
    paymentMethod: "",
    paymentGender: "",
    payment: Number.NaN,
    date: new Date().toISOString().split("T")[0],
    email: "",
    customerName: "",
  })

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "info",
    isVisible: false,
  })

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if the user prefers dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDarkMode)

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener("change", handleChange)

    // Apply dark mode class to document
    if (prefersDarkMode) {
      document.documentElement.classList.add("dark")
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const showToast = (message: string, type: "success" | "error" | "info") => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }

    setToast({
      message,
      type,
      isVisible: true,
    })

    // Hide toast after 5 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const submitInvoice = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !invoiceData.customerName ||
      !invoiceData.propertyTitle ||
      isNaN(invoiceData.payment) ||
      !invoiceData.paymentMethod ||
      !invoiceData.paymentGender
    ) {
      showToast("Please fill in all required fields", "error")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`)
      }

      // Only parse JSON if the response has content
      const result = response.headers.get("content-length") !== "0" ? await response.json() : {}
      console.log("Invoice Submission Result:", result)

      generatePDF()
      // Reset form
      setInvoiceData({
        id: "",
        invoiceNumber: generateInvoiceNumber(),
        firstName: "",
        lastName: "",
        propertyTitle: "",
        paymentMethod: "",
        paymentGender: "",
        payment: Number.NaN,
        date: new Date().toISOString().split("T")[0],
        email: "",
        customerName: "",
      })

      showToast("Invoice submitted successfully!", "success")
    } catch (error) {
      console.error("Invoice Submission Error:", error)
      showToast(error instanceof Error ? error.message : "Failed to submit invoice", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: field === "payment" ? Number(value) : value,
    }))

    if (field === "customerName") {
      const selectedUser = users.find((user) => `${user.firstName} ${user.lastName}` === value)
      if (selectedUser) {
        setInvoiceData((prev) => ({
          ...prev,
          id: selectedUser.id,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
        }))
      }
    }
  }

  const generatePDF = () => {
    setIsGeneratingPDF(true)

    setTimeout(() => {
      try {
        // Create new PDF document
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        // Set dark background
        doc.setFillColor(28, 36, 52)
        doc.rect(0, 0, 210, 297, "F")

        // Add company name
        doc.setTextColor(34, 197, 94) // Green color
        doc.setFontSize(24)
        doc.text("Zyckproperty.com", 20, 30)

        // Add subtitle
        doc.setTextColor(156, 163, 175) // Gray color
        doc.setFontSize(12)
        doc.text("Pakistan's Premium Property Marketplace", 20, 40)

        // Add invoice number and date
        doc.setTextColor(255, 255, 255)
        doc.text(`Invoice No.: ${invoiceData.invoiceNumber}`, 20, 60)
        doc.text(`Date: ${invoiceData.date}`, 20, 70)

        // Add greeting
        doc.text(`Dear ${invoiceData.customerName || "[Customer Name]"},`, 20, 90)

        // Add thank you message
        doc.setFontSize(11)
        doc.text("Thank you for listing your property on Zyckproperty.com — Pakistan's Premium", 20, 110)
        doc.text("Property Marketplace!", 20, 116)

        // Add payment confirmation
        doc.text("We have successfully received your payment. Below are the details of your", 20, 130)
        doc.text("transaction:", 20, 136)

        // Add invoice details
        doc.setFontSize(12)
        doc.text("Invoice Details:", 20, 156)
        doc.setFontSize(11)
        const details = [
          ` Invoice No.: ${invoiceData.invoiceNumber}`,
          ` Date: ${invoiceData.date}`,
          ` Customer Name: ${invoiceData.customerName || "[Customer's Name]"}`,
          ` Property Listed: ${invoiceData.propertyTitle || "[Property Title/Details]"}`,
          ` Payment Gender: ${invoiceData.paymentGender || "Property Owner"}`,
          ` Payment Amount: PKR ${invoiceData.payment || "[Payment]"}`,
          ` Payment Method: ${invoiceData.paymentMethod || "[Payment Method]"}`,
        ]

        let yPos = 166
        details.forEach((detail) => {
          doc.text(detail, 20, yPos)
          yPos += 8
        })

        // Add confirmation message
        doc.text("Your property will be live on Zyckproperty.com within the next 30 minutes.", 20, yPos + 10)

        // Add footer
        yPos += 30
        doc.text("Best Regards,", 20, yPos)
        doc.text("Zyckproperty.com Support Team", 20, yPos + 8)
        doc.text("+92 337 330 1864 | +92 213 642 4545", 20, yPos + 16)
        doc.text("Infozyck@gmail.com | Info@zyckproperty.com", 20, yPos + 24)
        doc.text("Visit Zyckproperty.com", 20, yPos + 32)

        // Save the PDF
        doc.save(`zyckproperty-invoice-${invoiceData.invoiceNumber}.pdf`)

        showToast("PDF generated successfully!", "success")
      } catch (error) {
        console.error("PDF Generation Error:", error)
        showToast("Failed to generate PDF", "error")
      } finally {
        setIsGeneratingPDF(false)
      }
    }, 1000)
  }

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return ""
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="container mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Toast Notification */}
        {toast.isVisible && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100
              ${toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"} text-white`}
          >
            <div className="flex items-center">
              {toast.type === "success" && (
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.type === "info" && (
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span>{toast.message}</span>
              <button
                onClick={() => setToast((prev) => ({ ...prev, isVisible: false }))}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Zyck Invoice Generator</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
          >
            {isDarkMode ? (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Light Mode
              </div>
            ) : (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                Dark Mode
              </div>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">Invoice Details</h2>
            </div>
            <form onSubmit={submitInvoice} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date</label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Customer ID</label>
                <input
                  type="text"
                  value={invoiceData.id}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={invoiceData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <option value="">Select customer</option>
                  {users.map((user) => (
                    <option key={user.id} value={`${user.firstName} ${user.lastName}`}>
                      {user.firstName} {user.lastName} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={invoiceData.propertyTitle}
                  onChange={(e) => handleChange("propertyTitle", e.target.value)}
                  placeholder="Enter property title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={invoiceData.paymentMethod}
                    onChange={(e) => handleChange("paymentMethod", e.target.value as PaymentMethod)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <option value="">Select payment method</option>
                    {Object.values(PaymentMethod).map((method) => (
                      <option key={method} value={method}>
                        {method.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Payment Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={invoiceData.paymentGender}
                    onChange={(e) => handleChange("paymentGender", e.target.value as PaymentGender)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <option value="">Select payment gender</option>
                    {Object.values(PaymentGender).map((gender) => (
                      <option key={gender} value={gender}>
                        {gender.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Payment Amount (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={isNaN(invoiceData.payment) ? "" : invoiceData.payment}
                  onChange={(e) => handleChange("payment", e.target.value)}
                  placeholder="Enter payment amount"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Generate PDF
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Invoice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">Invoice Preview</h2>
            </div>
            <div className="p-6">
              <div className="p-6 bg-gray-900 text-white rounded-lg shadow-inner">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-green-400">Zyckproperty.com</h2>
                    <p className="text-sm text-gray-400">Pakistan's Premium Property Marketplace</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">Invoice No.: {invoiceData.invoiceNumber}</p>
                    <p className="text-sm text-gray-400">Date: {invoiceData.date}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-lg">Dear {invoiceData.customerName || "[Customer Name]"},</p>

                  <p className="text-gray-300">
                    Thank you for listing your property on Zyckproperty.com – Pakistan's Premium Property Marketplace!
                  </p>

                  <p className="text-gray-300">
                    We have successfully received your payment. Below are the details of your transaction:
                  </p>

                  <div className="space-y-2 bg-gray-800 p-4 rounded-md">
                    <h3 className="font-semibold text-white">📄 Invoice Details:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p className="text-gray-300">🔹 Customer ID: {invoiceData.id || "[Customer ID]"}</p>
                      <p className="text-gray-300">🔹 Invoice No.: {invoiceData.invoiceNumber}</p>
                      <p className="text-gray-300">
                        🔹 Customer Name: {invoiceData.customerName || "[Customer's Name]"}
                      </p>
                      <p className="text-gray-300">
                        🔹 Property Listed: {invoiceData.propertyTitle || "[Property Title]"}
                      </p>
                      <p className="text-gray-300">
                        🔹 Payment Gender: {invoiceData.paymentGender || "[Payment Gender]"}
                      </p>
                      <p className="text-gray-300">
                        🔹 Payment Amount:{" "}
                        {isNaN(invoiceData.payment) ? "[Payment]" : formatCurrency(invoiceData.payment)}
                      </p>
                      <p className="text-gray-300">
                        🔹 Payment Method: {invoiceData.paymentMethod || "[Payment Method]"}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 bg-green-900/30 p-3 rounded-md">
                    ✅ Your property will be live on Zyckproperty.com within the next 30 minutes.
                  </p>

                  <div className="space-y-2 pt-4 border-t border-gray-700 mt-4">
                    <p className="font-medium text-white">Best Regards,</p>
                    <p className="text-gray-300">Zyckproperty.com Support Team</p>
                    <p className="text-gray-300">📞 +92 337 330 1864 | +92 213 642 4545</p>
                    <p className="text-gray-300">📧 Infozyck@gmail.com | Info@zyckproperty.com</p>
                    <p className="text-gray-300">🔗 Visit Zyckproperty.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

