import { prisma } from "@/app/util/prisma"
import LoginSchema from "@/app/util/schema/yupSchema/login"

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

export async function POST(req: Request) {
    const expirationTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
    try {
        const data = await LoginSchema.validate(await req.json())
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.username }
                ]
            }
        })

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        const match = bcrypt.compareSync(data.password, user.password);

        const newObject = Object.fromEntries( // remove password from response 
                    Object.entries(user).filter(([key]) => key !== 'password')
        );

        if(match){
            const token = jwt.sign(newObject, process.env.NEXTAUTH_SECRET, { expiresIn: expirationTime })
            const data = {...newObject, accessToken: token, expiresIn: expirationTime, google: false}
            return Response.json({ data })
        }else{
            return Response.json({ error: "Wrong username / password" }, { status: 401 })    
        }
    } catch (e) {
        console.log(e)
        return Response.json({ error: "Invalid request" }, { status: 405 })
    }
}
