import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // This ensures the route is dynamic

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

        // Query for properties with their locations
        const locations = await prisma.propertyLocation.findMany({
            where: {
                property: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    }
                }
            },
            include: {
                state: true,
                city: true,
                property: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true
                    }
                }
            }
        });

        // If no locations found, return a 404 response
        if (!locations || locations.length === 0) {
            return new NextResponse("No properties found for the specified month and year", { status: 404 });
        }

        // Return the locations with their related data
        return NextResponse.json({ locations });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new NextResponse("An error occurred while fetching properties", { status: 500 });
    }
}