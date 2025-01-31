import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// Explicitly opt-out of static rendering
export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const startDate = url.searchParams.get("startDate"); // Example: "2025-01-01"
        const endDate = url.searchParams.get("endDate");   // Example: "2025-01-28"

        // Check if both startDate and endDate are provided
        if (!startDate || !endDate) {
            return new NextResponse("Missing startDate or endDate query parameters", { status: 400 });
        }

        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate the date format
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return new NextResponse("Invalid date format", { status: 400 });
        }

        // Filter listings based on the date range
        const listings = await prisma.property.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });

        // Filter users based on the date range (if required)
        const users = await prisma.user.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });

        // Get user details
        const usersDetails = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
            },
        });



        // Return the counts as a JSON response
        return NextResponse.json({ users, listings, usersDetails });
    } catch (error) {
        console.error(error);
        return new NextResponse("An Error Occurred", { status: 500 });
    }
}