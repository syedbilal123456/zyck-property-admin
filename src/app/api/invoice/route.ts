import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Handle POST request
export async function POST(request: Request) {
    try {
        // const body = await request.json(); // Fix: Use `await request.json()`
        // const { id, invoiceNumber, paymentMethod, paymentGender, payment } = body;

        const sales = await prisma.sales.create({
            data: {
              user: {
                create: {
                  id: "kp_ac3d5b4e7e7146a0915fc6fcb1b0f184",
                  firstName: "Nazia",
                  lastName: "Majid",
                  email: "nazia@example.com", // Add necessary user fields
                }
              },
              invoiceNo: "ZYCK-20250225-686722-XBF",
              PaymentAmount: 76543213,
              PaymentMethod: "JazzCash",
              PaymentGender: "Direct_Client",
            }
          });
          
        return NextResponse.json(
            { message: "Sales done successfully", invoice: sales },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}

// ✅ Handle GET request (Optional: If needed)
// export async function GET() {
//     return NextResponse.json(
//         { message: "GET method not implemented for this route" },
//         { status: 405 }
//     );
// }

// // ✅ Handle other HTTP methods
// export async function OPTIONS() {
//     return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
// }
