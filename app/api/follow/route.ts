import { prisma } from "@/app/util/prisma"
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
const jwt = require("jsonwebtoken")

export async function PUT(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    const { searchParams } = new URL(req.url)
    const userToFollowId = searchParams.get("userId")

    if (user && userToFollowId && userToFollowId !== user.id) {
        const dataFollowerUserToFollow = await prisma.user.findUnique({
            where: { id: userToFollowId }, include: {
                follower: {
                    select: {
                        id: true
                    }
                }
            }
        })

        const isFollowed = dataFollowerUserToFollow?.follower.some(data => data.id === user.id);

        if (isFollowed) {
            const data = await prisma.user.update({
                where: { id: user.id }, data: {
                    following: {
                        disconnect: {
                            id: userToFollowId
                        }
                    }
                }
            })

            return Response.json({ data:{
                following: false
            } })
        } else {
            const data = await prisma.user.update({
                where: { id: user.id }, data: {
                    following: {
                        connect: {
                            id: userToFollowId
                        }
                    }
                }
            })

            await prisma.notification.create({
                data: {
                    userFrom: user.id,
                    userTo: userToFollowId,
                    type: "followed"
                }
            })

            await pusherServer.trigger(toPusherKey(`user:${userToFollowId}:notification`), "new_notification", 1)

            return Response.json({ data:{
                following: true
            } })
        }
    }

    return Response.json({ error: "Something went wrong" }, { status: 409 })
}