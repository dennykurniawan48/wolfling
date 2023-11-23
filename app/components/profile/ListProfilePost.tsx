"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Tweet from "../common/Tweet";
import { Tweet as TweetType } from "@/app/util/types/tweet/Tweet";
import { StatusLoading } from "@/app/util/enum/StatusLoading";
import ModalReply from "../modal/ModalReply";
import { useSession } from "next-auth/react";
import ModalSetUsername from "../modal/ModalSetUsername";

function ListProfilePost({ username }: { username: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [newestTweet, setNewestTweet] = useState<Array<Tweet>>([]);
  const [dateQuery, setDateQuery] = useState<string | null>(null);
  const [loadingNewTweet, setLoadingNewTweet] = useState(StatusLoading.Loading);
  const [hasNextPage, setHasnextPage] = useState(false);
  const [openModalNewTweet, setOpenModalNewTweet] = useState(false);
  const [openModalSetUsername, setOpenModalSetUsername] = useState(false);
  const [successAddUsername, setSuccessAddUsername] = useState(false);
  const [idTweet, setIdTweet] = useState<string | null>(null);
  const [loadingNewReply, setLoadingNewreply] = useState(StatusLoading.Idle);
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status == "authenticated") {
      if (session.user?.username == null && !successAddUsername) {
        setOpenModalSetUsername(true);
      } else {
        setOpenModalSetUsername(false);
      }
    }
  }, [status, session]);

  const observer = useRef<IntersectionObserver>();

  const lasTweetRef = useCallback<(node: Element) => void>(
    (node) => {
      if (loadingNewTweet == StatusLoading.Loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingNewTweet, hasNextPage]
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoadingNewTweet(StatusLoading.Loading)
    fetch(
      `/api/profile/tweet?username=${username}&page=${currentPage}${
        dateQuery ? `&date=${dateQuery}` : ""
      }`,
      {
        signal: controller.signal,
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        if(res?.data){
          setLoadingNewTweet(StatusLoading.Success)
        const data: Tweet[] = res.data.tweet ?? [];
        setDateQuery(res.data.date);
        setHasnextPage(res.data.currentPage < res.data.totalPage);
        setNewestTweet((prev) => [...prev, ...data]);
      }
      }).catch(err => {
        setLoadingNewTweet(StatusLoading.Error)
      });
    return () => {
      setLoadingNewTweet(StatusLoading.Loading)
      controller.abort()
    };
  }, [currentPage, session, status]);

  function onAddNewTweet(tweet: TweetType) {
    setNewestTweet((prev) => [tweet, ...prev]);
  }

  function onReplyClose() {
    setIdTweet(null);
    setOpenModalNewTweet(false);
  }

  function onReplyClick(idTweet: string) {
    setIdTweet(idTweet);
    setOpenModalNewTweet(true);
  }

  function onSetUsernameClose(username: string) {
    update({ username: username });
    setOpenModalSetUsername(false);
    setSuccessAddUsername(true);
  }

  function onSendReply(message: String) {
    if (loadingNewReply == StatusLoading.Loading) return;
    setLoadingNewreply(StatusLoading.Loading);
    fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ content: message, repliedTo: idTweet }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        console.log(res.data);
        setLoadingNewreply(StatusLoading.Success);
        setOpenModalNewTweet(false);
        onAddNewTweet(res.data);
      })
      .catch((err) => setLoadingNewreply(StatusLoading.Error));
  }

  return (
    <>
      <ModalReply
        open={openModalNewTweet}
        onClose={onReplyClose}
        idTweet={idTweet}
        onSendReply={onSendReply}
        statusLoadingSendTweet={loadingNewReply}
      />
      <ModalSetUsername
        open={openModalSetUsername}
        onClose={onSetUsernameClose}
      />
      <div className="w-full flex flex-col justify-between items-end p-4 rounded-lg space-y-3">
        {
          newestTweet.length == 0 && loadingNewTweet == StatusLoading.Success &&
          <div className="w-full justify-center items-center text-center pt-6">
              <span className="text-sm">This user didn&apos;t tweet anything yet.</span>
          </div>
        }
        {newestTweet.map((item, index) =>
          index + 1 == newestTweet.length ? (
            <Tweet
              ref={lasTweetRef}
              key={item.id}
              data={item}
              onReplyClicked={onReplyClick}
            />
          ) : (
            <Tweet key={item.id} data={item} onReplyClicked={onReplyClick} />
          )
        )}
        {loadingNewTweet == StatusLoading.Loading && (
          <div className="w-full text-center p-4">
            <span>Loading...</span>
          </div>
        )}
      </div>
    </>
  );
}

export default ListProfilePost;
