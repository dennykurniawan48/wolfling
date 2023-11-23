import { prisma } from "@/app/util/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const recomendation = await prisma.user.findMany({
        take: 5, select: {
            id: true,
            name: true,
            image: true,
            username: true
        }, where: {
            username: {
                not: null
            }
        }
    })
    return Response.json({ data: recomendation })
}