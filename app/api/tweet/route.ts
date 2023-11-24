import { prisma } from "@/app/util/prisma";
import { TweetSchema } from "@/app/util/schema/yupSchema/tweet";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
const jwt = require("jsonwebtoken")

export async function GET(req: NextRequest) {
    let userId = "non-exist-user-id"
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
        const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
        userId = user.id
    } catch (e) {

    }
    const { searchParams } = new URL(req.url)
    const currentDate = searchParams.get("date") ?? Date()
    const date = new Date(currentDate)
    const page: number = Number(searchParams.get("page") ?? 1)
    const limit: number = Number(searchParams.get("limit") ?? 5)

    const tweet = await prisma.post.findMany({
        where: { createdAt: { lte: date } },
        include: {
            user: { select: { id: true, username: true, name: true, image: true } },
            post: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true
                            , name: true, image: true
                        }
                    }
                }
            }, data: {
                include: {
                    user: {
                        select: {
                            id: true, username: true, name: true, image: true
                        }
                    }
                }
            },
            retweets: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true, username: true, name: true, image: true
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
        },
        take: limit, skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
    })

    const data = tweet.map(item => {
        const retweteed = item.retweets.some(ret => ret.user.id == userId)
        const liked = item.likes.some(ret => ret.userId == userId)
        return { ...item, retweteed, liked }
    })

    const total = await prisma.post.count()
    const response = { total, tweet: data, currentPage: page, totalPage: Math.ceil(total / limit), date }
    return Response.json({ data: response })
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const data = await TweetSchema.validate(await req.json())
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user) {
        const tweet = await prisma.post.create({
            data: {
                content: data.content,
                postedBy: user.id
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

        return Response.json({ data: tweet })
    }
}

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url)
    const { searchParams } = url
    const id = searchParams.get("id")
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    if (id) {
        const result = await prisma.post.delete({
            where: {
                id,
                postedBy: user.id
            }
        })
        return Response.json({ data: result })

    }
}