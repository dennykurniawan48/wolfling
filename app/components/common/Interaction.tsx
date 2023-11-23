"use client";
import React, { useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { Tweet, TweetLikes, TweetRetweets } from "@/app/util/types/tweet/Tweet";
import { StatusLoading } from "@/app/util/enum/StatusLoading";

function Interaction({
  data,
  status,
  isLiked,
  isRetweeted,
  handleLike,
  handleReply,
  handleRetweet
}: {
  data: Tweet;
  status: string;
  isLiked: Boolean;
  isRetweeted: boolean,
  handleLike: (result: TweetLikes) => void;
  handleReply: (idTweet: string) => void;
  handleRetweet: (result: TweetRetweets) => void
}) {
  const [loadingLike, setLoadingLike] = useState(StatusLoading.Idle);
  const [loadingRetweet, setLoadingRetweet] = useState(StatusLoading.Idle)

  return (
    <div className="w-full space-x-16 flex pt-3">
      <button onClick={() => {
        if (status == "authenticated") {
        handleReply(data.id)}
      }}>
        <BiCommentDetail className="h-4 w-4" />
      </button>
      <div className="flex space-x-2 justify-center items-center">
        <button onClick={() => {
          if (loadingRetweet == StatusLoading.Loading) return;
          setLoadingRetweet(StatusLoading.Loading);
          if (status == "authenticated") {
            fetch(`/api/retweet?id=${data.id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
                Accept: "application/json",
              },
            })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
              })
              .then((res) => {
                setLoadingRetweet(StatusLoading.Success);
                handleRetweet(res.data)
              })
              .catch((err) => setLoadingLike(StatusLoading.Error));
          }
        }}>
      <AiOutlineRetweet className={`${isRetweeted ? "fill-green-500" : ""} h-4 w-4`} />
      </button>
      <span className="text-xs">
        {data.retweets.length}
      </span>
      </div>
      <button
        onClick={() => {
          if (loadingLike == StatusLoading.Loading) return;
          setLoadingLike(StatusLoading.Loading);
          if (status == "authenticated") {
            fetch(`/api/like?id=${data.id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
                Accept: "application/json",
              },
            })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
              })
              .then((res) => {
                setLoadingLike(StatusLoading.Success);
                handleLike(res.data);
              })
              .catch((err) => setLoadingLike(StatusLoading.Error));
          }
        }}
      >
        {isLiked ? (
          <div className="flex space-x-2 justify-center items-center">
          <MdOutlineFavorite className="h-4 w-4 fill-red-500" />
          <span className="text-xs">{data.likes.length}</span>
          </div>
        ) : (
          <div className="flex space-x-2 justify-center items-center">
          <MdOutlineFavoriteBorder className="h-4 w-4" />
          <span className="text-xs">{data.likes.length}</span>
          </div>
        )}
      </button>
    </div>
  );
}

export default Interaction;
