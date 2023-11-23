import { prisma } from "@/app/util/prisma"
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher"

export async function GET(req: Request) {
    const data = await prisma.user.findFirst({
        where: { id: "clp7ktrb80000ejq6lvmvgwr9" }, include: {
            follower: {
                select: {
                    id: true
                }
            }
        }
    })
    return Response.json({ data })
}