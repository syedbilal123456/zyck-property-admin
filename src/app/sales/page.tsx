import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Charts from "./components/charts";
import { prisma } from "@/lib/prisma";
import ChartOne from "@/components/Charts/ChartOne";
import ChartTwo from "@/components/Charts/ChartTwo";

export const metadata: Metadata = {
  title: "Admin Invoice Generator | Zyck Property Dashboard",
  description:
    "This is Admin Invoice Generator for Zyck Admin",
};

const InvoicePage = async () => {

  const Sales = await prisma.sales.findMany();

  const userId = Sales.map((sale) => sale.userId);

  const User = await prisma.user.findMany({
    where: {
      id: {
        in: userId
      }
    },
    select: {
      id : true,
      email : true,
      firstName : true,
      lastName : true,
      phoneNumber: true,
    }
  })

  console.log(Sales)

  return (
    <DefaultLayout>

      <Charts sales={Sales} User={User} />
    </DefaultLayout>
  );
}

export default InvoicePage;
