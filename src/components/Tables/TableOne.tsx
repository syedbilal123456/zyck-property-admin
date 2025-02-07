"use client"
import type { RootState } from "@/lib/redux/store"
import { Eye, Home, Pencil, Trash2, UserPen } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import PropertyTable from "./GridTable"
import ActiveInactiveBtn from "./tableCompount/ActiveInactiveBTN"

interface Property {
  contact: {
    id: number
    name: string
    phone: string
    email: string
    propertyId: number
    createdAt: string
  }
  createdAt: string
  description: string
  id: number
  images: {
    id: number
    url: string
    propertyId: number
    createdAt: string
  }[]
  location: {
    city: {
      id: number
      value: string
      stateId: number
      createdAt: string
    }
    state: {
      id: number
      value: string
      created: string
    }
    streetAddress: string
  }
  price: number
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive:boolean;
  avatarUrl: string | null
  createdAt: string
  isAdmin: boolean
  phoneNumber: string | null
  longitude: string | null
  latitude: string | null
  city: string | null
  province: string | null
  streetAddress: string | null
  ProfileComplete: boolean
  userProperties?: Property[]
}

interface Card {
  allUsers: User[]
}

const TableOne = () => {
  const [data, setData] = useState<Card>({ allUsers: [] })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const date = useSelector((state: RootState) => state.date)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users?startDate=${date.startDate}&endDate=${date.endDate}`);

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("An Error Occurred", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchData();
  }, [date.startDate, date.endDate]);

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");

      setData((prevData) => ({
        allUsers: prevData.allUsers.filter((user) => user.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const openModal = async (user: User) => {
    setSelectedUser(user)
    setIsLoading(true)
    setError(null)
    document.body.style.overflow = "hidden"

    try {
      const response = await fetch(`/api/properties?id=${user.id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result) {
        throw new Error('No properties data in response')
      }

      // Update the user properties with the fetched data
      setSelectedUser(prevUser => ({
        ...prevUser!,
        userProperties: result || []
      }))
    } catch (error) {
      console.error("Error fetching properties:", error)
      setError(error instanceof Error ? error.message : 'Failed to fetch properties')
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsModalOpen(true), 50)
    }
  }

   const activeInactiveProfile = ()=>{

   }

  const closeModal = () => {
    setIsModalOpen(false)
    setError(null)
    setTimeout(() => {
      setSelectedUser(null)
      document.body.style.overflow = "unset"
    }, 300)
  }

  console.log(selectedUser)

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">All Users</h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-8 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 text-center">
            <h5 className="text-base font-medium uppercase xsm:text-base">Name</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-base font-medium uppercase xsm:text-base">City</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-base font-medium uppercase xsm:text-base">Email</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Province</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Phone Number</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
          </div>
          <div className="p-2.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Full Address</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
          </div>
        </div>

        {data.allUsers.map((item, index) => (
          <div
            className={`grid grid-cols-1 sm:grid-cols-8 ${index === data.allUsers.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
            key={item.id}
          >
            <div className="flex items-center gap-3 justify-start p-2.5 xl:p-5">
              <div className="w-1/3">
                <Image alt={item.firstName} src={item.avatarUrl ?? "/default-avatar.png"} width={300} height={400}/>
              </div>
              <p className="text-green-500 text-sm dark:text-green-400">{item.firstName + " " + item.lastName}</p>
            </div>
            <div className="flex items-center justify-center p-1.5 xl:p-5">
              <p className="text-green-500 text-sm dark:text-green-400">{item.city}</p>
            </div>
            <div className="flex mx-7 items-center justify-center p-1.5 xl:p-5">
              <p className="text-green-500 text-sm dark:text-green-400">{item.email}</p>
            </div>
            <div className="flex items-center justify-center p-1.5 xl:p-5">
              <p className="text-green-500 text-sm dark:text-green-400">{item.province}</p>
            </div>
            <div className="flex items-center justify-center p-1.5 xl:p-5">
              <p className="text-green-500 text-sm dark:text-green-400">{item.phoneNumber}</p>
            </div>
            <div className="flex items-center justify-center p-1.5 xl:p-5">
            <ActiveInactiveBtn user={item} />
            </div>
            <div className="hidden items-center justify-center p-1.5 sm:flex xl:p-5">
              <p className="text-green-500 text-sm dark:text-green-400">{item.streetAddress}</p>
            </div>

            <div className="hidden items-center justify-center p-1.5 sm:flex xl:p-5">
              <div className="flex items-center gap-3">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  onClick={() => openModal(item)}
                  title="View All Properties"
                >
                  <Home className="h-5 w-5 text-blue-500" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  onClick={() => {/* Add edit handler */ }}
                  title="Edit User"
                >
                  <Pencil className="h-5 w-5 text-green-500" />
                </button>
               
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  onClick={() => deleteUser(item.id)}
                  title="Delete User"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg dark:bg-boxdark w-[80%] max-w-9xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-2">
              <PropertyTable userProperties={selectedUser.userProperties || []} />
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-meta-4 dark:hover:bg-gray-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableOne
