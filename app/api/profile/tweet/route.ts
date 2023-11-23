import { prisma } from "@/app/util/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const currentDate = searchParams.get("date") ?? Date()
    const date = new Date(currentDate)
    const page: number = Number(searchParams.get("page") ?? 1)
    const limit: number = Number(searchParams.get("limit") ?? 5)
    const username = searchParams.get("username") ?? null

    if (username) {
        const user = await prisma.user.findUnique({ where: { username: username } })
        if (user) {
            const tweet = await prisma.post.findMany({
                where: { createdAt: { lte: date }, postedBy: user.id },
                include: {
                    user: { select: { id: true, username: true, name: true, image: true } },
                    post: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true
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
                },
                take: limit, skip: (page - 1) * limit,
                orderBy: { createdAt: "desc" },
            })
            const total = await prisma.post.count({where: {postedBy: user.id}})
            const response = { total, tweet, currentPage: page, totalPage: Math.ceil(total / limit), date }
            return Response.json({data:response})
        } else {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
    } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
}