import { prisma } from "@/app/util/prisma";
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
const jwt = require("jsonwebtoken")

export async function PUT(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id") ?? null
    if (id) {
        const post = await prisma.post.findFirst({where:{id}})
        const like = await prisma.like.findFirst({ where: { userId: user.id, postId: id } })
        if (!like) {
            const result = await prisma.like.create({
                data: {
                    userId: user.id,
                    postId: id
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

            return Response.json({data:result})
        } else {
            const result = await prisma.like.delete({
                where: {
                    id: like.id
                }
            })
            return Response.json({data:result})
        }
    }
}