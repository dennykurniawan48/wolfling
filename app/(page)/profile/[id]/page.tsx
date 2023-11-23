"use client";
import ModalMessage from "@/app/components/modal/ModalMessage";
import ListProfilePost from "@/app/components/profile/ListProfilePost";
import { StatusLoading } from "@/app/util/enum/StatusLoading";
import { Profile } from "@/app/util/types/profile/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page(props: { params: { id: string } }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const [openModalFollow, setOpenModalFollow] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(StatusLoading.Idle);

  useEffect(() => {
    if (session) {
      if (session.user?.username == props.params.id) {
        router.replace("/profile");
      }
    }
  }, [session]);

  useEffect(() => {
    setLoadingProfile(StatusLoading.Loading);
    fetch(`/api/profile?username=${props.params.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setLoadingProfile(StatusLoading.Success);
        setProfile(res.data);
        setIsFollowing(res.data.following);
      })
      .catch((err) => {
        setLoadingProfile(StatusLoading.Error);
      });
  }, [props.params.id]);

  return (
    <div className="max-w-6xl flex w-full flex-col">
      <ModalMessage
        open={openModalFollow}
        onClose={() => setOpenModalFollow(false)}
        title="Need login"
        content="Sorry you need to login to perform this action"
      />
      <div className="w-full bg-gray-300 h-60">
        <img src="/header.jpg" className="w-full h-60 object-cover" />
        </div>
      <div className="px-8 flex items-center space-x-6">
        <img src="/avatar.svg" className=" w-36 h-36 mt-[-72px]" />
        <div className="flex flex-row flex-1 justify-between">
          {loadingProfile == StatusLoading.Success && (
            <>
              <div className="flex flex-col flex-1">
                <span className="text-3xl font-bold">{profile?.name}</span>
                <span className="text-lg text-gray-500 pt-2">
                  @{profile?.username}
                </span>
              </div>
              <div className="flex justify-center items-center">
                {session && session.user?.username != props.params.id && (
                  <button
                    className="bg-blue-600 px-4 py-2 rounded-md text-white"
                    onClick={() => {
                      if (profile) {
                        fetch(`/api/follow?userId=${profile.id}`, {
                          method: "PUT",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                          },
                        })
                          .then((res) => {
                            if (res.ok) {
                              return res.json();
                            }
                          })
                          .then((res) => {
                            setIsFollowing(res.data.following);
                          });
                      }
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
                {!session && (
                  <button
                    className="bg-blue-600 px-4 py-2 rounded-md text-white"
                    onClick={() => {
                      setOpenModalFollow(true);
                    }}
                  >
                    Follow
                  </button>
                )}
              </div>
            </>
          )}
          {loadingProfile == StatusLoading.Loading && (
            <div>
              <span>Loading profile</span>
            </div>
          )}
           {loadingProfile == StatusLoading.Error && (
            <div>
              <span>Error loading profile</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <ListProfilePost username={props.params.id} />
      </div>
    </div>
  );
}

export default Page;
