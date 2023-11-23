"use client";
import { StatusLoading } from "@/app/util/enum/StatusLoading";
import React, { useEffect, useState } from "react";

function ModalSetUsername({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [errorUpdate, setErrorUpdate] = useState("");
  const [loadingSetUsername, setLoadingSetUsername] = useState(
    StatusLoading.Idle
  );
  useEffect(() => {
    if (open) {
      setUsername("");
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
        <span>Username</span>
        <input
          type="text"
          maxLength={15}
          value={username}
          onChange={(e) => {
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(e.target.value)) {
              setUsername(e.target.value.trim());
            }
          }}
          className=" bg-transparent w-full outline-none text-gray-700 shadow-none ring-0 border-none text-md resize-none overflow-y-hidden pt-6 px-6"
          placeholder="Enter your username"
        />
        <div>
          <span className="text-sm text-red px-4 py-2 text-red-500">
            {loadingSetUsername == StatusLoading.Error && errorUpdate}
          </span>
        </div>
        <div className="w-full flex justify-end space-x-12">
          <button
            onClick={() => {
              let responseCode = 200;
              if (username.trim()) {
                setLoadingSetUsername(StatusLoading.Loading);
                fetch(`/api/setusername?username=${username}`)
                  .then((res) => {
                    responseCode = res.status;
                    if (res.ok) {
                      return res.json();
                    }
                  })
                  .then((res) => {
                    if (responseCode == 200) {
                      setLoadingSetUsername(StatusLoading.Success);
                      setUsername("");
                      onClose(res.data.usename);
                    } else if (responseCode == 409) {
                      setLoadingSetUsername(StatusLoading.Error);
                      setErrorUpdate("Username already taken");
                    } else if (responseCode == 405) {
                      setLoadingSetUsername(StatusLoading.Error);
                      setErrorUpdate("Validation error");
                    } else {
                      setLoadingSetUsername(StatusLoading.Error);
                      setErrorUpdate("Something went wrong");
                    }
                  })
                  .catch((err) => {});
              }
            }}
            className=" text-white border bg-blue-500 rounded-md px-4 py-1"
          >
            {loadingSetUsername == StatusLoading.Loading
              ? "Updating"
              : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalSetUsername;
