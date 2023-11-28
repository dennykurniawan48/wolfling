import { prisma } from "@/app/util/prisma";
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
const jwt = require("jsonwebtoken")

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user) {
        const count = await prisma.notification.count({
            where: {
                userTo: user.id,
                opened: false
            }
        })

        return Response.json({ data: { count: count } })
    }
}

export async function PUT(req: NextRequest){
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user) {
        await prisma.notification.updateMany({
            where: {
                userTo: user.id,
                opened: false
            }, data:{
                opened: true
            }
        })

        pusherServer.trigger(toPusherKey(`user:${user.id}:notification`), "clear_notification", 0)

        return Response.json({ data: { cleared: true } })
    }
}