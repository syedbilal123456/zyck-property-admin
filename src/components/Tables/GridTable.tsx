"use client"

import { PencilIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"

interface Contact {
  id: number
  name: string
  phone: string
  email: string
  propertyId: number
  createdAt: string
}

interface PropertyImage {
  id: number
  url: string
  propertyId: number
  createdAt: string
}

interface City {
  id: number
  value: string
  stateId: number
  createdAt: string
}

interface State {
  id: number
  value: string
  created: string
}

interface Location {
  city: City
  state: State
  streetAddress: string
}

interface UserProperty {
  contact: Contact
  createdAt: string
  description: string
  id: number
  images: PropertyImage[]
  location: Location
  price: number
}

interface PropertyTableProps {
  userProperties?: UserProperty[]
}

const PropertyTable: React.FC<PropertyTableProps> = ({ userProperties = [] }) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({})
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const toggleDescription = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const deletePropertybyId = async (id: number) => {
    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Response Error")
      }
      toast.success("Property Deleted Successfully")
    } catch (error) {
      toast.error("Failed to Delete Property")
    }
  }
  console.log("================================>", userProperties)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const DescriptionCell: React.FC<{
    description: string
    isExpanded: boolean
    onClick: () => void
  }> = ({ description, isExpanded, onClick }) => (
    <div className="relative">
      <div className={`text-sm text-green-200 ${!isExpanded ? "line-clamp-3" : ""}`}>{description}</div>
      {description.length > 150 && (
        <button onClick={onClick} className="text-blue-400 hover:text-blue-300 text-sm mt-1 font-medium">
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  )

  const ImageCell: React.FC<{ images: PropertyImage[] }> = ({ images }) => {
    if (!images || images.length === 0) return null // Ensure images array is not empty

    const firstImage = images[0] // Get the first image

    return (
      <div className="relative group cursor-pointer" onClick={() => setSelectedImage(firstImage.url)}>
        <Image
          src={firstImage.url || "/placeholder.svg"}
          alt="Property"
          width={80}
          height={80}
          className="rounded-lg object-cover transition-transform group-hover:scale-105"
        />
      </div>
    )
  }

  const userProepertyArray = Object.values(userProperties)

  if (!Array.isArray(userProepertyArray)) {
  return <div className="text-center text-green-500 py-8">No properties found.</div>
 }

if ( userProepertyArray.length === 0) {
    return <div className="text-center text-green-500 py-8">No found.</div>
  }

  return (
    <div className="w-full rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-800 text-green-200">
              <th className="p-4 text-left">Images</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Listed Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userProperties?.map((property) => (
              <tr key={property.id} className="border-b border-green-700 hover:bg-green-800/50 transition-colors">
                <td className="p-4">
                  <ImageCell images={property.images} />
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="font-medium text-green-200">
                      {property.location.city.value}, {property.location.state.value}
                    </div>
                    <div className="text-sm text-green-400">{property.location.streetAddress}</div>
                  </div>
                </td>
                <td className="p-4 text-green-200">{formatPrice(property.price)}</td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="font-medium text-green-200">{property.contact.name}</div>
                    <div className="text-sm text-green-400">{property.contact.email}</div>
                    <div className="text-sm text-green-400">{property.contact.phone}</div>
                  </div>
                </td>
                <td className="p-4">
                  <DescriptionCell
                    description={property.description}
                    isExpanded={expandedRows[property.id]}
                    onClick={() => toggleDescription(property.id)}
                  />
                </td>
                <td className="p-4 text-green-200">{formatDate(property.createdAt)}</td>
                <td className="gap-3 p-4 text-green-200">
                  <button onClick={() => deletePropertybyId(property.id)}>
                    <Trash2 />
                  </button>
                  <button>
                    <PencilIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Property"
              width={800}
              height={600}
              className="rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-green-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyTable

