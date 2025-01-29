import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // This ensures the route is dynamic

// All listings and users available in website
export async function GET(request: Request) {
    try {
        // Get query parameters from the request
        const url = new URL(request.url);
        const month = parseInt(url.searchParams.get("month") || "0"); // Default to January if no month is provided
        const year = parseInt(url.searchParams.get("year") || "2025"); // Default to 2025 if no year is provided

        // Check if month and year are valid
        if (isNaN(month) || isNaN(year) || month < 0 || month > 11 || year < 1000 || year > 9999) {
            return new NextResponse("Invalid month or year", { status: 400 });
        }

        // Start and end of the selected month and year
        const startDate = new Date(year, month, 1); // First day of the month
        const endDate = new Date(year, month + 1, 1); // First day of the next month

        // Query for properties added within the specified month and year based on createdAt field
        const province = await prisma.propertyLocation.findMany({
            where: {
                createdAt: {
                    gte: startDate, // Greater than or equal to the start of the month
                    lt: endDate,    // Less than the start of the next month
                },
            },
        });

        // If no properties found, return a 400 response
        if (!province || province.length === 0) {
            return new NextResponse("No properties found for the specified month and year", { status: 400 });
        }

        // Return the properties
        return NextResponse.json({ province });
    } catch (error) {
        // Return a 500 error if something goes wrong
        return new NextResponse("An error occurred while fetching properties", { status: 500 });
    }
}
