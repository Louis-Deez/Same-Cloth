"use client"

import Image from "next/image";
import {Button} from "@/components/Button";
import {useAuth} from "@/lib/auth/AuthProvider";

const ProfileView = () => {
  const { profile, user } = useAuth();
  const accountCreationDate = new Date(user?.created_at ?? "");

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-96 shrink-0 border-r border-black/10 bg-white">
        <Image
          src="/images/placeholder_banner.jpeg"
          width={1000}
          height={1000}
          priority
          alt="placeholder_banner"
          className="aspect-video w-full object-cover border-b border-black/10"
        />
        <div className="flex flex-col gap-y-4 lg:px-8">
          <Image
            src="/images/placeholder_profile_pic.jpeg"
            width={1000}
            height={1000}
            priority
            alt="placeholder_profile"
            className="aspect-square rounded-3xl object-cover max-w-24 -mt-12 shadow-xl border border-black/10"
          />
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <h3 className="text-accent">{profile?.displayName}</h3>
              <h5>{profile?.handle}</h5>
            </div>
            <span>{profile?.bio}</span>
            <div className="flex flex-col gap-y-1">
              <div className="flex justify-between w-full">
                <p>Posts</p>
                <p>124</p>
              </div>
              <div className="flex justify-between w-full">
                <p>Followers</p>
                <p>32,321</p>
              </div>
              <div className="flex justify-between w-full">
                <p>Following</p>
                <p>295</p>
              </div>
            </div>
            <Button label="Edit Profile" primary/>
            <Button label="Create Post"/>
            <span className="uppercase">
              MEMBER SINCE: {accountCreationDate.toLocaleDateString("en-US",
              {year: "numeric", month: "long", day: "numeric",})}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <h5>You have not posted anything.</h5>
      </div>
    </div>
  )
}

export default ProfileView;