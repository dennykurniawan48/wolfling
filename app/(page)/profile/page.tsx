"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ListProfilePost from "../../components/profile/ListProfilePost";

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated") {
      router.replace("/");
    }
  }, [status]);

  return (
    <div className="max-w-6xl flex w-full flex-col">
         <div className="w-full bg-gray-300 h-60">
        <img src="/header.jpg" className="w-full h-60 object-cover" />
        </div>
        <div className="px-8 flex items-center space-x-6">
          <img src="/avatar.svg" className=" w-36 h-36 mt-[-72px]" />
          {session && <div className="flex flex-col flex-1">
                <span className="text-3xl font-bold">{session?.user?.name}</span>
                <span className="text-lg text-gray-500 pt-2">
                  @{session?.user?.username}
                </span>
              </div>}
        </div>
        <div className="flex flex-col w-full">
          <ListProfilePost username={session?.user?.username} />
        </div>
      </div>
  );
}

export default Page;
