import { prisma } from "@/app/util/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const jwt = require("jsonwebtoken")

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username") ?? null
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    if (username) {
        let following = false
        if (token) {
            const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
            const data = await prisma.user.findFirst({
                where: { id: user.id }, include: {
                    following: { select: { username: true } }
                }
            })

            following = data?.following.some(item => item.username == username) ?? false
        }
        const user = await prisma.user.findFirst({
            where: { username: username }, select: {
                id: true, name: true, image: true, username: true
            }
        })
        if (user) {
            return Response.json({ data: {...user, following} })
        } else {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
    } else {
        return NextResponse.json({ error: "Username not found" }, { status: 409 })
    }
}