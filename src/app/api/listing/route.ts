import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// All listings and users available in website
export async function GET() {
    try {

        const listings = await prisma.property.count()

        const users = await prisma.user.count()
        if (!users && !listings) {
            return new NextResponse("Data are not available", { status: 400 })
        }
        

        return NextResponse.json({ users, listings })
    } catch (error) {
        throw new NextResponse("An Error Occured", { status: 500 })
    }
}
