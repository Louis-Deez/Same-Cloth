"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

import { useState } from "react";
import { ImageKind, uploadProfileImage } from "@/lib/supabase/uploadProfileImage";

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
    <div className="w-96 shrink-0 border-r border-black/10 bg-white">
      {/* BANNER WITH THE "CHANGE BANNER" BUTTON IN THE CORNER - C */}
      <div className="relative">
        <Image
          src={bannerSrc}
          width={1000}
          height={1000}
          priority
          unoptimized={bannerSrc.startsWith("http")}
          alt="banner"
          className="aspect-video w-full border-b border-black/10 object-cover"
        />
        <label className="absolute right-2 bottom-2 cursor-pointer rounded bg-white/90 px-2 py-1 text-sm shadow">
          Change banner
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleFile(e, "banner")} />
        </label>
      </div>
      <div className="flex flex-col gap-y-4 lg:px-8">
        {/* AVATAR, relative KEEPS IT ON TOP OF THE BANNER - C */}
        <Image
          src={avatarSrc}
          width={1000}
          height={1000}
          priority
          unoptimized={avatarSrc.startsWith("http")}
          alt="profile"
          className="relative -mt-12 aspect-square max-w-24 rounded-3xl border border-black/10 object-cover shadow-xl"
        />
        {/* "CHANGE PHOTO" BUTTON AND THE UPLOAD STATUS MESSAGE - C */}
        <label className="w-fit cursor-pointer text-sm underline">
          Change photo
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
