"use client"

import { useState } from "react"
import { toast } from "react-toastify"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string | null
  createdAt: string
  isAdmin: boolean
  isActive: boolean
  phoneNumber: string | null
  longitude: string | null
  latitude: string | null
  city: string | null
  province: string | null
  streetAddress: string | null
  ProfileComplete: boolean
}

function ActiveInactiveToggle({ user }: { user: User }) {
  const [isActive, setIsActive] = useState(user.isActive)

  const handleStatusChange = async () => {
    const newStatus = !isActive

    try {
      const response = await fetch(
        `/api/users/activeStatus?id=${user.id}&status=${newStatus ? "active" : "inactive"}`,
        {
          method: "PUT",
        },
      )

      if (!response.ok) {
        toast.error("Failed to update status")
        return
      }

      // Update status only on successful API call
      setIsActive(newStatus)
      toast.success(`User status updated to ${newStatus ? "active" : "inactive"}`)
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred while updating status")
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleStatusChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-gray-900">{isActive ? "Active" : "Inactive"}</span>
    </div>
  )
}

export default ActiveInactiveToggle

