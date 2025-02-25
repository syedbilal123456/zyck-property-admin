"use client"

import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import { PaymentGender, PaymentMethod } from "@prisma/client"

interface InvoiceFormProps {
  users: {
    id: string
    firstName: string
    lastName: string
    email: string
    Sales: {
      PaymentGender: PaymentGender
      PaymentMethod: PaymentMethod
    }[]
  }[]
  paymentGenders: PaymentGender[]
  paymentMethods: PaymentMethod[]
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  customerName: string
  propertyTitle: string
  paymentMethod: PaymentMethod | ""
  paymentGender: PaymentGender | ""
  payment: string
  date: string
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
    customerName: "",
    propertyTitle: "",
    paymentMethod: "",
    paymentGender: "",
    payment: "",
    date: new Date().toISOString().split("T")[0],
  })



  console.log(users)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if the user prefers dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDarkMode)

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const submitInvoice = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission
    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      })
      if (!response.ok) {
        throw new Error("Error Response")
      }
      const result = await response.json()
      console.log(result)
      // Handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error(error)
      // Handle error (e.g., show an error message)
    }
  }

  const handleChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (field === "customerName") {
      const selectedUser = users.find((user) => `${user.firstName} ${user.lastName}` === value)
      if (selectedUser) {
        setInvoiceData((prev) => ({
          ...prev,
          id: selectedUser.id,
          paymentMethod:
            selectedUser.Sales.length > 0 ? selectedUser.Sales[selectedUser.Sales.length - 1].PaymentMethod : "",
          paymentGender:
            selectedUser.Sales.length > 0 ? selectedUser.Sales[selectedUser.Sales.length - 1].PaymentGender : "",
        }))
      }
    }
  }

  console.log(invoiceData)

  const generatePDF = () => {
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
    const invoiceNumber = generateInvoiceNumber()
    doc.text(`Invoice No.: ${invoiceNumber}`, 20, 60)
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
      ` Invoice No.: ${invoiceNumber}`,
      ` Date: ${invoiceData.date}`,
      ` Customer Name: ${invoiceData.customerName || "[Customer's Name]"}`,
      ` Property Listed: ${invoiceData.propertyTitle || "[Property Title/Details]"}`,
      ` Payment Gender: Property Owner`,
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
    doc.save("zyckproperty-invoice.pdf")
  }

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? "dark" : ""}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <form onSubmit={submitInvoice} className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Invoice Number</label>
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Customer ID</label>
              <input
                type="text"
                value={invoiceData.id}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Date</label>
              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Customer Name</label>
              <select
                value={invoiceData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium mb-1 dark:text-white">Property Title</label>
              <input
                type="text"
                value={invoiceData.propertyTitle}
                onChange={(e) => handleChange("propertyTitle", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Payment Method</label>
              <select
                value={invoiceData.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select payment method</option>
                {Object.values(PaymentMethod).map((method) => (
                  <option key={method} value={method}>
                    {method.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Payment Gender</label>
              <select
                value={invoiceData.paymentGender}
                onChange={(e) => handleChange("paymentGender", e.target.value as PaymentGender)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select payment gender</option>
                {Object.values(PaymentGender).map((gender) => (
                  <option key={gender} value={gender}>
                    {gender.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Payment</label>
              <input
                type="text"
                value={invoiceData.payment}
                onChange={(e) => handleChange("payment", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex gap-5">
              <button
                onClick={generatePDF}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Generate PDF
              </button>
              <button type="submit" className="bg-green-500 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
                Submit Invoice
              </button>
            </div>
          </div>
        </form>

        {/* Preview Section */}
        <div className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-green-600 dark:text-green-400">Zyckproperty.com</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pakistan's Premium Property Marketplace</p>
              </div>
              <div className="text-right">
                <p className="font-medium dark:text-white">Invoice No.: {invoiceData.invoiceNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date: {invoiceData.date}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg dark:text-white">Dear {invoiceData.customerName || "[Customer Name]"},</p>

              <p className="dark:text-gray-300">
                Thank you for listing your property on Zyckproperty.com – Pakistan's Premium Property Marketplace!
              </p>

              <p className="dark:text-gray-300">
                We have successfully received your payment. Below are the details of your transaction:
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold dark:text-white">📄 Invoice Details:</h3>
                <p className="dark:text-gray-300">🔹 Customer ID: {invoiceData.id || "[Customer ID]"}</p>
                <p className="dark:text-gray-300">🔹 Invoice No.: {invoiceData.invoiceNumber}</p>
                <p className="dark:text-gray-300">
                  🔹 Customer Name: {invoiceData.customerName || "[Customer's Name]"}
                </p>
                <p className="dark:text-gray-300">
                  🔹 Property Listed: {invoiceData.propertyTitle || "[Property Title/Details]"}
                </p>
                <p className="dark:text-gray-300">
                  🔹 Payment Gender: {invoiceData.paymentGender || "[PaymentGender]"}
                </p>
                <p className="dark:text-gray-300">🔹 Payment Amount: PKR {invoiceData.payment || "[Payment]"}</p>
                <p className="dark:text-gray-300">
                  🔹 Payment Method: {invoiceData.paymentMethod || "[Payment Method]"}
                </p>
              </div>

              <p className="dark:text-gray-300">
                ✅ Your property will be live on Zyckproperty.com within the next 30 minutes.
              </p>

              <div className="space-y-2 pt-4 border-t dark:border-gray-600">
                <p className="font-medium dark:text-white">Best Regards,</p>
                <p className="dark:text-gray-300">Zyckproperty.com Support Team</p>
                <p className="dark:text-gray-300">📞 +92 337 330 1864 | +92 213 642 4545</p>
                <p className="dark:text-gray-300">📧 Infozyck@gmail.com | Info@zyckproperty.com</p>
                <p className="dark:text-gray-300">🔗 Visit Zyckproperty.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

