import { prisma } from "@/app/util/prisma";
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
const jwt = require("jsonwebtoken")

export async function GET(req: NextRequest){

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user) {
        const notification = await prisma.notification.findMany({
            where: {
              userTo: user.id,
            },
            include: {
              DestinationUser: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
              OriginUser: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          });

          await pusherServer.trigger(toPusherKey(`user:${user.id}:notification`), "clear_notification", 0)

        return Response.json({ data: notification })
    }
}