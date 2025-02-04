import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(request : Request){
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get('id')

        if (!id) {
            return new Response("Missing id query parameter", { status: 400 })
        }

        const userProeperties = await prisma.property.findMany({
            where: {
                userId: id
            },
            select:{
                contact :true,
                createdAt: true,
                description: true,
                id: true,
                images: true,
                location: {
                    select: {
                        city: true,
                        state: true,
                        streetAddress: true
                    }
                },
                price: true
            }
        });

        return NextResponse.json({ userProeperties })
    } catch (error) {
        return new NextResponse("An Error Occurred", { status: 500 })
    }
}


// Delete a property
export async function DELETE(request : Request){
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get('id')

        if(!id){
            return new Response("Missing id query parameter", { status: 400 })
        }

        await prisma.property.delete({
            where: {
                id: parseInt(id)
            }
        })
    } catch (error) {
        
    }
}