"use client"

import Image from "next/image";
import {Button} from "@/components/Button";
import {useAuth} from "@/lib/auth/AuthProvider";

/**
 * @component - This is the sidebar that shows the user's profile. It shows the user's profile picture, name, handle, bio
 * user statistics, and buttons to edit the profile and create a post.
 *
 * The profile picture and the banner are placeholders. They will be replaced with the actual user's profile picture.
 */

export const ProfileSidebar = () => {
  const { profile, user } = useAuth();
  const accountCreationDate = new Date(user?.created_at ?? "");

  return (
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

          {/* TODO: Implement user statistics */}
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

          {/* TODO: Implement edit profile and create post buttons */}
          <Button label="Edit Profile" primary/>
          <Button label="Create Post"/>

          <span className="uppercase">
              MEMBER SINCE: {accountCreationDate.toLocaleDateString("en-US",
            {year: "numeric", month: "long", day: "numeric",})}
            </span>
        </div>
      </div>
    </div>
  )
}