import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const status = url.searchParams.get("status");


        if (!id) {
            return new NextResponse("Missing id query parameter", { status: 400 });
        }

        if(status == "active"){
            const updateStatus =  await prisma.user.update(
                {
                    where: {id : id},
                 data:{
                    isActive:true
                 }
                },
                
            )
            if(!updateStatus){
                return new NextResponse("Cannot update", { status: 400 });
            }
            return new NextResponse("User active Successfully", { status: 200 });

        }else if(status == "inactive"){
            const updateStatus =  await prisma.user.update(
                {
                    where: {id : id},
                 data:{
                    isActive:false,
                 }
                 })

                 if(!updateStatus){
                     return new NextResponse("Cannot update", { status: 400 });
                 }
                 return new NextResponse("User Inactive Successfully", { status: 200 });
            }

    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse("An error occurred", { status: 500 });
    }
}