import React from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { prisma } from '@/lib/prisma'
import { PaymentGender, PaymentMethod } from '@prisma/client'
import ZyckInvoice from './InvoiceCom'

export default async function Invoice() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  // Extract unique PaymentGender and PaymentMethod values

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName='Invoice Generation' />
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <ZyckInvoice 
          users={users} 
        />
      </div>
    </div>
  )
}
