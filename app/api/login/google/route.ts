import verifyGoogleToken from "@/app/util/helper/verifyGoogleToken";
import { prisma } from "@/app/util/prisma";
import { GoogleLogin } from "@/app/util/types/googlelogin/Googlelogin";
import { randomUUID } from "crypto";
const jwt = require('jsonwebtoken')

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token') ?? ""
    const expirationTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

    if (token) {
        const result: GoogleLogin = await verifyGoogleToken(token);
        if (result.success) {
            const exist = await prisma.user.findUnique({
                where: {
                    email: result.data?.email
                }
            });
            if (!exist) {
                const user = await prisma.user.create({
                    data: {
                        email: result.data?.email,
                        password: null,
                        name: result.data?.name,
                        accounts: {
                            create: {
                                type: "google",
                                provider: "google",
                                providerAccountId: result.data?.aud ?? randomUUID()
                            }
                        }
                    }
                });
                if (user) {
                    const { password, ...rest } = user
                    const token = jwt.sign(rest, process.env.NEXTAUTH_SECRET, { expiresIn: expirationTime })
                    const data = { ...rest, accessToken: token, expiresIn: expirationTime, google: true }

                    return Response.json({ data: data });
                } else {
                    return new Response(JSON.stringify({ "error": "Something went wrong." }), {
                        status: 500,
                    })
                }
            } else {
                const { password, ...rest } = exist
                const token = jwt.sign(rest, process.env.NEXTAUTH_SECRET, { expiresIn: expirationTime })
                const data = { ...rest, accessToken: token, expiresIn: expirationTime, google: true }

                return Response.json({ data: data });
            }
        } else {
            return new Response(JSON.stringify({ "error": "Something went wrong." }), {
                status: 500,
            })
        }
    } else {
        return new Response(JSON.stringify({ "error": "Wrong credentials." }), {
            status: 401,
        })
    }
}