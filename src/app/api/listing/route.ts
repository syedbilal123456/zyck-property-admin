import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

// Explicitly opt-out of static rendering
export const dynamic = 'force-dynamic'; // This ensures the route is dynamic

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const startDate = url.searchParams.get("startDate"); // Example: "2025-01-01"
        const endDate = url.searchParams.get("endDate");   // Example: "2025-01-28"

        if (!startDate || !endDate) {
            return new NextResponse("Missing startDate or endDate query parameters", { status: 400 });
        }

        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);

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
        })

        // Filter users based on the date range (if required)
        const users = await prisma.user.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });

        if (!listings && !users) {
            return new NextResponse("No data found within the specified date range", { status: 404 });
        }

        return NextResponse.json({ users, listings });
    } catch (error) {
        console.error(error);
        return new NextResponse("An Error Occurred", { status: 500 });
    }
}