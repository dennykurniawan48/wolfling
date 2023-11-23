import { prisma } from "@/app/util/prisma"
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher"
import { ReplySchema } from "@/app/util/schema/yupSchema/reply"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
const jwt = require("jsonwebtoken")

export async function PUT(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id") ?? null
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user && user.id && id) {
        const post = await prisma.post.findFirst({where:{id}})
        const check = await prisma.post.findFirst({ where: { retweetFrom: id as string, postedBy: user.id as string } })
        if (!check) {
            const result = await prisma.post.create({
                data: {
                    postedBy: user.id,
                    retweetFrom: id
                }, include: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            })

            if (post && user.id != post.postedBy) {

                await prisma.notification.create({
                    data: {
                        userFrom: user.id,
                        userTo: post.postedBy,
                        type: "retweet"
                    }
                })
    
                await pusherServer.trigger(toPusherKey(`user:${post.postedBy}:notification`), "new_notification", 1)
            }

            return Response.json({ data: result })
        } else {
            const result = await prisma.post.delete({
                where: {
                    id: check.id
                }, include: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            return Response.json({ data: result })
        }
    }
}