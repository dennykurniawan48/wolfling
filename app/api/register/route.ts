import { prisma } from "@/app/util/prisma";
import { RegisterSchema } from "@/app/util/schema/yupSchema/register";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs")

export async function POST(request: Request) {
    try {
        const data = await RegisterSchema.validate(await request.json())
        const user = await prisma.user.findFirst({ where: { email: data.email } })
        if (user) {
            return NextResponse.json({ error: "Email registered" }, { status: 409 })
        }
        const response = await prisma.user.create({
            data: {
                email: data.email,
                password: bcrypt.hashSync(data.password, 8),
                name: data.name,
                accounts: {
                    create: {
                        type: "credentials",
                        provider: "credentials",
                        providerAccountId: randomUUID()
                    }
                }
            }
        })

        const {password, ...rest} = response

        return Response.json(rest)
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "Invalid request" }, { status: 405 })
    }
}