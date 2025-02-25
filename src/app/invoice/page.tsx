import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Invoice from "@/app/invoice/_components";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Invoice Generator | Zyck Property Dashboard",
  description:
    "This is Admin Invoice Generator for Zyck Admin",
};

const InvoicePage =  () => {
 
  return (
    <DefaultLayout>
      <Invoice />
    </DefaultLayout>
  );
}

export default InvoicePage;
