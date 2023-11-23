"use client";
import { StatusLoading } from "@/app/util/enum/StatusLoading";
import React, { useEffect, useState } from "react";

function ModalMessage({
  open,
  onClose,
  title,
  content
}: {
  open: boolean;
  onClose: () => void;
  title: string
  content: string
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
        <span>{title}</span>
        <span className="text-lg">
            {content}
        </span>
        <div className="w-full flex justify-end space-x-12">
          <button
            onClick={() => onClose()}
            className=" text-blue-500 border border-blue-500 rounded-md px-4 py-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalMessage;
