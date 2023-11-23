import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/app/util/prisma";
import { pusherServer, toPusherKey } from "@/app/util/pusher/pusher";
import { Notification } from "@/app/util/types/notification/Notification";
import { AuthOptions, getServerSession } from "next-auth";
import React from "react";

async function Page() {
  const user = await getServerSession(authOptions as AuthOptions);
  await pusherServer.trigger(
    toPusherKey(`user:${user?.user.id}:notification`),
    "clear_notification",
    0
  );
  const notification = await prisma.notification.findMany({
    where: {
      userTo: user?.user.id,
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

  await prisma.notification.updateMany({
    where: {
      userFrom: user?.id,
    },
    data: {
      opened: true,
    },
  });
  return (
    <div className="w-full flex flex-col space-y-3">
      <div>
        <span className="text-2xl">All Notifications</span>
      </div>
      {notification.map((item) => {
        return (
          <div
            className="w-full p-2 bg-blue-200 text-gray-700 rounded-lg"
            key={item.id}
          >
            {item.OriginUser.name} {item.type} your post
          </div>
        );
      })}
    </div>
  );
}

export default Page;
