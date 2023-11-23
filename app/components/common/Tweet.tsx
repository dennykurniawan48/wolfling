"use client";
import { Tweet, TweetLikes, TweetRetweets } from "@/app/util/types/tweet/Tweet";
import React, { forwardRef, useEffect, useState } from "react";
import Interaction from "./Interaction";
import { useSession } from "next-auth/react";
import Link from "next/link";
import moment from "moment";

const Tweet = forwardRef(function Tweet(
  {
    data,
    onReplyClicked,
  }: { data: Tweet; onReplyClicked: (idTweet: string) => void },
  ref: any
) {
  const { data: session, status } = useSession();
  const [tweet, setTweet] = useState<Tweet>(data);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);

  useEffect(() => {
    setIsLiked(
      tweet.likes.some((item) => item.userId.includes(session?.user?.id))
    );
    setIsRetweeted(
      tweet.retweets.some((item) => item.user.id.includes(session?.user?.id))
    );
  }, [tweet]);

  function handleLike(result: TweetLikes) {
    if (isLiked) {
      setTweet((prev) => ({
        ...prev,
        likes: [...prev.likes.filter((item) => item.id != result.id)],
      }));
    } else {
      setTweet((prev) => ({
        ...prev,
        likes: [...prev.likes, result],
      }));
    }
  }

  function handleRetweet(result: TweetRetweets) {
    console.log(result);
    if (isRetweeted) {
      setTweet((prev) => ({
        ...prev,
        retweets: [...prev.retweets.filter((item) => item.id != result.id)],
      }));
    } else {
      setTweet((prev) => ({
        ...prev,
        retweets: [...prev.retweets, result],
      }));
    }
  }

  return (
    <div
      key={tweet.id}
      ref={ref}
      className="w-full flex flex-col items-start p-4 rounded-lg border border-gray-300"
    >
      {tweet.retweetFrom && tweet.data && (
        <div className="flex flex-col w-full space-y-3">
          <span className="text-xs text-gray-500">
            {session && (
              <Link
                href={`${
                  session.user?.username == tweet.user.username
                    ? "/profile"
                    : `/profile/${tweet.user.username}`
                }`}
              >
                @{tweet.user.username}
              </Link>
            )}
            {!session && (
              <Link href={`/profile/${tweet.user.username}`}>
                @{tweet.user.username}
              </Link>
            )}{" "}
            retweeted{" "}
            {session && (
              <Link
                href={`${
                  session.user?.username == tweet.data.user.username
                    ? "/profile"
                    : `/profile/${tweet.data.user.username}`
                }`}
              >
                @{tweet.data.user.username}
              </Link>
            )}
            {!session && (
              <Link href={`/profile/${tweet.data.user.username}`}>
                @{tweet.data.user.username}
              </Link>
            )}
          </span>
          <div className="flex w-full space-x-6">
            <img src={"/avatar.svg"} className="w-12 h-12" />
            <div className="flex flex-1 flex-col space-y-1">
              <div className="flex flex-row justify-between w-full space-y-3">
                <span className="text-sm">
                  {session && (
                    <Link
                      href={`${
                        session.user?.username == tweet.data.user.username
                          ? "/profile"
                          : `/profile/${tweet.data.user.username}`
                      }`}
                    >
                      @{tweet.data.user.username}
                    </Link>
                  )}
                  {!session && (
                    <Link href={`/profile/${tweet.data.user.username}`}>
                      @{tweet.user.username}
                    </Link>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(tweet.createdAt).fromNow()}
                </span>
              </div>
              <span>{tweet.data.content}</span>
            </div>
          </div>
        </div>
      )}
      {tweet.post && tweet.repliedTo && (
        <div className="flex flex-col w-full space-y-3">
          <span className="text-xs text-gray-500">
            {session && (
              <Link
                href={`${
                  session.user?.username == tweet.user.username
                    ? "/profile"
                    : `/profile/${tweet.user.username}`
                }`}
              >
                @{tweet.user.username}
              </Link>
            )}
            {!session && (
              <Link href={`/profile/${tweet.user.username}`}>
                @{tweet.user.username}
              </Link>
            )}{" "}
            replied to{" "}
            {session && (
              <Link
                href={`${
                  tweet.post.user.username == tweet.post.user.username
                    ? "/profile"
                    : `/profile/${tweet.post.user.username}`
                }`}
              >
                @{tweet.post.user.username}
              </Link>
            )}
            {!session && (
              <Link href={`/profile/${tweet.post.user.username}`}>
                @{tweet.post.user.username}
              </Link>
            )}
          </span>
          <div className="flex w-full space-x-6">
            <img src={"/avatar.svg"} className="w-12 h-12" />
            <div className="flex flex-1 flex-col space-y-1">
              <div className="flex flex-row justify-between w-full space-y-3">
                <span className="text-sm">
                  {session && (
                    <Link
                      href={`${
                        session.user?.username == tweet.user.username
                          ? "/profile"
                          : `/profile/${tweet.user.username}`
                      }`}
                    >
                      @{tweet.user.username}
                    </Link>
                  )}
                  {!session && (
                    <Link href={`/profile/${tweet.user.username}`}>
                      @{tweet.user.username}
                    </Link>
                  )}{" "}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(tweet.createdAt).fromNow()}
                </span>
              </div>
              <span>{tweet.content}</span>
              <Interaction
                handleRetweet={handleRetweet}
                isRetweeted={isRetweeted}
                data={tweet}
                status={status}
                handleLike={handleLike}
                isLiked={isLiked}
                handleReply={onReplyClicked}
              />
            </div>
          </div>
        </div>
      )}
      {tweet.repliedTo == null && tweet.data == null && tweet.data == null && (
        <div className="flex w-full space-x-6">
          <img src={"/avatar.svg"} className="w-12 h-12" />
          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex flex-row justify-between w-full space-y-3">
              <span className="text-sm">
                {session && (
                  <Link
                    href={`${
                      session.user?.username == tweet.user.username
                        ? "/profile"
                        : `/profile/${tweet.user.username}`
                    }`}
                  >
                    @{tweet.user.username}
                  </Link>
                )}
                {!session && (
                  <Link href={`/profile/${tweet.user.username}`}>
                    @{tweet.user.username}
                  </Link>
                )}{" "}
              </span>
              <span className="text-xs text-gray-500">
                {moment(tweet.createdAt).fromNow()}
              </span>
            </div>
            <span>{tweet.content}</span>
            <Interaction
              handleRetweet={handleRetweet}
              isRetweeted={isRetweeted}
              data={tweet}
              status={status}
              handleLike={handleLike}
              isLiked={isLiked}
              handleReply={onReplyClicked}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default Tweet;
