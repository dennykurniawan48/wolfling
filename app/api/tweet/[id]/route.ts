import { prisma } from "@/app/util/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
const jwt = require("jsonwebtoken")

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const pathname = url.pathname.split('/')
    const id = pathname[pathname.length - 1]

    let userId = "non-exist-user-id"
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
        const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
        userId = user.id
    } catch (e) {

    }

    const data = await prisma.post.findFirst({
        where: {
            id
        }, select: {
            id: true,
            content: true, user: {
                select: {
                    id: true,
                    username: true,
                    image: true,
                    name: true
                }
            }, createdAt: true,
            likes: {
                select: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            retweets: {
                select: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    })

    const dataReply = await prisma.post.findMany({
        where: {
            repliedTo: id
        }, select: {
            id:true,
            content: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    image: true,
                    name: true
                }
            },
            likes: {
                select: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            retweets: {
                select: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }, orderBy:{
            createdAt: "desc"
        }
    })

    const replies = dataReply.map(item => {
        const liked = item.likes.some(it => it.user.id == userId)
        const retweeted = item.retweets.some(it => it.user.id == userId)
        return { ...item, retweeted, liked }
    })

    const liked = data?.likes.some(item => item.user.id == userId)
    const retweeted = data?.retweets.some(item => item.user.id == userId)

    const tweet = {...data, liked, retweeted}


    return Response.json({ data: { tweet, replies } })
}