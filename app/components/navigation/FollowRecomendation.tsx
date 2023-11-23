"use client";
import { Poster } from "@/app/util/types/tweet/Tweet";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function FollowRecomendation() {
  const [recomendationUser, setRecomendationUser] = useState<Poster[]>([]);

  useEffect(() => {
    fetch("/api/recomendation")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setRecomendationUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className=" w-3/12 h-screen flex flex-col items-center bg-gray-100 pt-8">
      <span>Follow</span>
      {recomendationUser.map((item) => {
        return (
          <Link
            href={`/profile/${item.username}`}
            className="w-full p-4 flex justify-start items-center"
            key={item.id}
          >
            <img src="/avatar.svg" className="w-12 h-12" />
            <div className="flex flex-col space-y-1 px-4">
              <span className="text-sm">{item.name}</span>
              <span className="text-xs">@{item.username}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default FollowRecomendation;
