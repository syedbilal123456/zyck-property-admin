import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Handle POST request
export async function POST(request: Request) {
    // try {
        const body = await request.json();
        const { id ,invoiceNumber, propertyTitle, paymentMethod, paymentGender, payment, email, firstName, lastName } = body;

        const sales = await prisma.sales.create({
          data: {
              user: {
                  connectOrCreate: {
                      where: { id: id }, // Check if user exists by id
                      create: {
                          id: id, // Generate a unique ID
                          firstName: firstName,
                          lastName: lastName,
                          email: email,
                      },
                  },
              },
              PropertyTitle: propertyTitle,
              invoiceNo: invoiceNumber,
              PaymentAmount: payment,  // Fixed field name to match schema
              PaymentMethod: paymentMethod,
              PaymentGender: paymentGender,
          },
      });
      

        console.log({ body });

        return NextResponse.json(
            { message: "Sales done successfully", invoice: sales },
            { status: 200 }
        );
    // } catch (error) {
    //     console.error("Error creating sales record:", error);
    //     return NextResponse.json(
    //         { message: "Internal Server Error", error: (error as Error).message },
    //         { status: 500 }
    //     );
    // }
}

// ✅ Handle GET request (Optional: If needed)
// export async function GET() {
//     return NextResponse.json(
//         { message: "GET method not implemented for this route" },
//         { status: 405 }
//     );
// }

// ✅ Handle other HTTP methods
export async function OPTIONS() {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
