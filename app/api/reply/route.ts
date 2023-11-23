import { prisma } from "@/app/util/prisma"
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher"
import { ReplySchema } from "@/app/util/schema/yupSchema/reply"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
const jwt = require("jsonwebtoken")

export async function POST(req: NextRequest) {
    const data = await ReplySchema.validate(await req.json())
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    if (user) {
        const originPost = await prisma.post.findFirst({
            where: { id: data.repliedTo }
        })
        
        const result = await prisma.post.create({
            data: {
                content: data.content,
                postedBy: user.id,
                repliedTo: data.repliedTo
            }, include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        username: true
                    }
                }, post: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                username: true
                            }
                        }
                    }
                }, data: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                username: true
                            }
                        }
                    }
                },
                retweets: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true, username: true
                            }
                        }
                    }
                },
                likes: {
                    select: {
                        id: true,
                        userId: true
                    }
                }
            }
        })

        if (originPost && user.id != originPost.postedBy) {

            await prisma.notification.create({
                data: {
                    userFrom: user.id,
                    userTo: originPost.postedBy,
                    type: "replied"
                }
            })

            await pusherServer.trigger(toPusherKey(`user:${originPost.postedBy}:notification`), "new_notification", 1)
        }

        return Response.json({ data: result })
    }
}