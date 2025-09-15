import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {

    try {
        const{ telegramId } = await req.json();
        
        if(!telegramId){
            return NextResponse.json({ error: "Error invalid user" } , { status: 400});
        }

        const updateUser = await prisma.user.update({
            where: { telegramId },
            data: { points: {increment: 1 } }
        });

        return NextResponse.json({ success: true, points: updateUser.points })
    } catch (error) {
        console.error('Error increased points:', error);
        return NextResponse.json({ error: 'Internal server error'}, { status: 500 });
    }
    
}