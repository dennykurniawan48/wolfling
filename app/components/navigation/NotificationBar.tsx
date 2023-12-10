"use client";
import React, { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { IoPersonSharp, IoNotifications } from "react-icons/io5";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import { pusherClient, toPusherKey } from "@/app/util/pusher/pusher";
import { LuLogIn } from "react-icons/lu";
import { IoPersonCircleOutline } from "react-icons/io5";
import Link from "next/link";

function NotificationBar() {
  const [notificatinBadge, setNotificatinBadge] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status == "authenticated") {
      fetch("/api/notification")
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((res) => {
          if (res?.data) {
            setNotificatinBadge(res.data.count);
          }
        });

      pusherClient.subscribe(
        toPusherKey(`user:${session?.user?.id}:notification`)
      );

      console.log(toPusherKey(`user:${session?.user?.id}:notification`));

      const addNewNotification = () => {
        console.log("add notif");
        setNotificatinBadge((prev) => prev + 1);
      };

      const clearNotification = () => {
        setNotificatinBadge(0);
      };

      pusherClient.bind("new_notification", addNewNotification);
      pusherClient.bind("clear_notification", clearNotification);

      return () => {
        pusherClient.unsubscribe(`user:${session?.user?.id}:notification`);
        pusherClient.unbind("new_notification");
        pusherClient.unbind("clear_notification");
      };
    }
  }, [status, session]);

  return (
    <div className="w-2/12 h-screen flex flex-col items-center justify-between bg-gray-100 pt-8">
      <ul className="flex flex-col space-y-6">
        <li className="flex flex-row space-x-4 items-end justify-start">
          <Link
            className="flex flex-row space-x-4 items-end justify-start"
            href="/"
          >
            <AiFillHome className="w-6 h-6 fill-blue-500" /> <span>Home</span>
          </Link>
        </li>
        {session && (
          <>
            <li className="flex flex-row space-x-4 items-end justify-start">
              <Link
                className="flex flex-row space-x-4 items-end justify-start"
                href="/notification"
              >
                <IoNotifications className="w-6 h-6 fill-blue-500" />
                <span>Notification</span>
                {status === "authenticated" && notificatinBadge > 0 && (
                  <div className="bg-blue-600 rounded-full text-white">
                    <span className="p-2 text-sm">{notificatinBadge}</span>
                  </div>
                )}
              </Link>
            </li>
            <li className="flex flex-row space-x-4 items-end justify-start">
              <Link
                className="flex flex-row space-x-4 items-end justify-start"
                href="/profile"
              >
                <IoPersonCircleOutline className="w-6 h-6 fill-blue-500" />
                <span>Profile</span>
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="w-full flex">
        {status === "authenticated" &&
          <div className="flex w-full justify-between items-center p-4">
            <span className="flex-1 justify-center text-center items-center pr-4 overflow-ellipsis text-sm">
              {session.user?.name}
            </span>
            <button
              onClick={() => {
                signOut();
              }}
            >
              <LuLogIn className="w-6 h-6" />
            </button>
          </div>
        }

        {
          status=="unauthenticated" && 
            <div className="flex w-full justify-between items-center p-4">
              <Link
                href={`/login`}
                className="w-full text-center p-2 text-md border border-gray-700 rounded-lg"
              >
                <span>Get Started</span>
              </Link>
            </div>
        }
      </div>
    </div>
  );
}

export default NotificationBar;
