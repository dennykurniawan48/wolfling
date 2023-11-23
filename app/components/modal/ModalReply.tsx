"use client";
import { StatusLoading } from "@/app/util/enum/StatusLoading";
import React, { useEffect, useState } from "react";

function ModalReply({
  open,
  onClose,
  statusLoadingSendTweet,
  onSendReply,
}: {
  open: boolean;
  onClose: () => void;
  idTweet: string | null;
  statusLoadingSendTweet: StatusLoading;
  onSendReply: (message: string) => void;
}) {
  const [reply, setReply] = useState("");
  useEffect(() => {
    if (open) {
      setReply("");
    }
  }, [open]);
  return (
    <div
      className={`fixed inset-0 transition-colors flex justify-center items-center z-10 overflow-y-scroll ${
        open
          ? "visible scale-100 bg-opacity-60 bg-gray-400"
          : "invisible scale-0 opacity-0"
      }`}
    >
      <div className="w-1/3 p-4 bg-white rounded-lg flex flex-col space-y-4">
        <span>Enter your reply</span>
        <textarea
          maxLength={255}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className=" bg-transparent w-full outline-none text-gray-700 shadow-none ring-0 border-none text-md resize-none overflow-y-hidden pt-6 px-6"
          placeholder="Enter your response"
        />
        <div className="w-full flex justify-end space-x-12">
          <button
            onClick={() => onClose()}
            className=" text-blue-500 border border-blue-500 rounded-md px-4 py-1"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (reply.trim()) {
                onSendReply(reply);
              }
            }}
            className=" text-white border bg-blue-500 rounded-md px-4 py-1"
          >
            {statusLoadingSendTweet == StatusLoading.Loading
              ? "Sending"
              : "Tweet"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalReply;
