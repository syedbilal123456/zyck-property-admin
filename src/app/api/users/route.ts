import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const startDate = url.searchParams.get("startDate")
        const endDate = url.searchParams.get('endDate')

        if (!startDate || !endDate) {
            return new NextResponse("Missing startDate or endDate query parameters", { status: 400 })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return new NextResponse("Invalid date format", { status: 400 })
        }

        const allUsers = await prisma.user.findMany({
            where: {
                isAdmin : false,
                createdAt: {
                    gte: start,
                    lte: end
                }
            }
        })
        return NextResponse.json({ allUsers })

    } catch (error) {
        return new NextResponse("An Error Occurred", { status: 500 })
    }
}

// Delete a user

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing id query parameter", { status: 400 });
        }


        const deleteUser = await prisma.user.delete({where: {id : id}});

        console.log(deleteUser)

        return new NextResponse("User deleted successfully", { status: 200 });

    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse("An error occurred", { status: 500 });
    }
}