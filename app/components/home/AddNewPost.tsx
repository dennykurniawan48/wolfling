"use client";
import { StatusLoading } from "@/app/util/enum/StatusLoading";
import { Tweet } from "@/app/util/types/tweet/Tweet";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ModalMessage from "../modal/ModalMessage";

function AddNewPost({
  onAddNewTweet,
}: {
  onAddNewTweet: (tweet: Tweet) => void;
}) {
  const [tweet, setTweet] = useState("");
  const [statusPostNewTweet, setStatusPostNewTweet] = useState(
    StatusLoading.Idle
  );
  const [needLoginModal, setNeedLoginModal] = useState(false);
  const { data: session, status } = useSession();

  function postNewTweet() {
    setStatusPostNewTweet(StatusLoading.Loading);
    fetch("/api/tweet", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ content: tweet }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setTweet("");
        onAddNewTweet(res.data);
        setStatusPostNewTweet(StatusLoading.Success);
      })
      .catch((err) => setStatusPostNewTweet(StatusLoading.Error));
  }

  return (
    <div className="w-full flex flex-col h-40 bg-slate-100 justify-between items-end p-4 rounded-lg">
      <ModalMessage
        title="Require login"
        content="Please login to make a tweet."
        open={needLoginModal}
        onClose={() => setNeedLoginModal(false)}
      />
      <textarea
        maxLength={255}
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        className=" bg-transparent w-full outline-none text-gray-700 shadow-none ring-0 border-none text-md resize-none overflow-y-hidden pt-6 px-6"
        placeholder="What are you thinking right now?"
      />
      <div className="w-full mt-4 flex justify-end px-6">
        <button
          type="button"
          onClick={() => {
            if (status == "unauthenticated") {
              setNeedLoginModal(true);
            } else {
              postNewTweet();
            }
          }}
          className=" bg-blue-400 rounded-full text-white px-6 py-2"
        >
          {statusPostNewTweet == StatusLoading.Loading ? "Wait" : "Tweet"}
        </button>
      </div>
    </div>
  );
}

export default AddNewPost;
