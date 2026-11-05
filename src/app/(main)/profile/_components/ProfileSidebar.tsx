"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

import React, { useState } from "react";
import { ImageKind, uploadProfileImage } from "@/lib/supabase/uploadProfileImage";
import {PlusIcon} from "@radix-ui/react-icons";

/**
 * @component - This is the sidebar that shows the user's profile. It shows the user's profile picture, name, handle, bio
 * user statistics, and buttons to edit the profile and create a post.
 *
 * The profile picture and the banner are placeholders. They will be replaced with the actual user's profile picture.
 */

export const ProfileSidebar = () => {
  const { profile, user } = useAuth();
  const accountCreationDate = new Date(user?.created_at ?? "");

  //NEWLY UPLOADED LINKS, SO THE PAGE UPDATES RIGHT AWAY - C
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [newBanner, setNewBanner] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  //1. SHOWS THE NEW UPLOAD, ELSE THE SAVED PICTURE, ELSE THE PLACEHOLDER - C
  const avatarSrc = newAvatar ?? profile?.profilePictureURL ?? "/images/placeholder_profile_pic.jpeg";
  const bannerSrc = newBanner ?? profile?.bannerURL ?? "/images/placeholder_banner.jpeg";

  //2. RUNS WHEN SOMEONE PICKS A FILE: UPLOADS IT AND SHOWS IT - C
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, kind: ImageKind) => {
    //GRABS THE PICKED FILE, THEN CLEARS THE PICKER SO THE SAME FILE CAN BE PICKED AGAIN - C
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;

    //SENDS IT TO uploadProfileImage AND WAITS FOR THE LINK - C
    setMessage("Uploading...");
    const { url, error } = await uploadProfileImage(user.id, kind, file);
    if (error || !url) return setMessage(error ?? "Upload failed.");

    //PUTS THE NEW LINK IN THE RIGHT BOX SO THE PAGE UPDATES - C
    if (kind === "avatar") setNewAvatar(url);
    else setNewBanner(url);
    setMessage("");
  };

  return (
    <div className="w-96 shrink-0 border-r bg-surface">

      <div className="relative">
        <label className="group relative block cursor-pointer opacity-100">
          <Image
            src={bannerSrc}
            width={1000}
            height={1000}
            priority
            unoptimized={bannerSrc.startsWith("http")}
            alt="banner"
            className="aspect-video w-full border-b object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-sm font-medium text-white">Change banner</span>
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleFile(e, "banner")} />
        </label>
      </div>

      <div className="flex flex-col gap-y-4 lg:px-8">

        <label className="group relative -mt-12 block aspect-square w-24 cursor-pointer opacity-100">
          <Image
            src={avatarSrc}
            width={1000}
            height={1000}
            priority
            unoptimized={avatarSrc.startsWith("http")}
            alt="profile"
            className="bg-surface size-full rounded-3xl border object-cover shadow-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <PlusIcon className="scale-150 text-white" />
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleFile(e, "avatar")} />
        </label>

        {message && <p className="text-sm">{message}</p>}

        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col">
            <h3 className="text-accent">{profile?.displayName}</h3>
            <h5>{profile?.handle}</h5>
          </div>
          <span>{profile?.bio}</span>

          {/* TODO: Implement user statistics */}
          <div className="flex flex-col gap-y-1">
            <div className="flex w-full justify-between">
              <p>Posts</p>
              <p>124</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Followers</p>
              <p>32,321</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Following</p>
              <p>295</p>
            </div>
          </div>

          {/* TODO: Implement edit profile and create post buttons */}
          <Button label="Edit Profile" primary />
          <Button label="Create Post" />

          <span className="uppercase">
            MEMBER SINCE:{" "}
            {accountCreationDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
};
