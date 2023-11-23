import { prisma } from "@/app/util/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const jwt = require('jsonwebtoken')

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    const { searchParams } = new URL(req.url)
    if (user) {
        if (searchParams.get("username")) {
            const existingUser = await prisma.user.findUnique({ where: { username: searchParams.get("username")! } })
            if (!existingUser) {
                const updated = await prisma.user.update({
                    where: { id: user.id }, data: {
                        username: searchParams.get("username")
                    }
                })
                return Response.json({ data: updated })
            }
            return NextResponse.json({ error: "Username already taken" }, { status: 409 })
        }
        return NextResponse.json({ error: "Invalid request" }, { status: 405 })
    }
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
}