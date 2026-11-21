"use client"

import {useAuth} from "@/lib/auth/AuthProvider";
import Image from "next/image";
import React, {useState} from "react";
import {ImageKind, uploadProfileImage} from "@/lib/supabase/uploadProfileImage";
import {PlusIcon} from "@radix-ui/react-icons";
import {FormInput} from "@/components/form/FormInput";
import {FormTextArea} from "@/components/form/FormTextArea";
import {SingleSelect} from "@/components/form/FormSelection";
import {GENDER} from "@/app/(auth)/signup/_config/fields";
import {Button} from "@/components/Button";

export const EditProfile = () => {
  const {profile, user} = useAuth();

  const [message, setMessage] = useState<string>("");
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [newBanner, setNewBanner] = useState<string | null>(null);


  const avatarSrc = profile?.profilePictureURL ?? "/images/default_pfp.svg";
  const bannerSrc = profile?.bannerURL ?? "/images/placeholder_banner.jpeg";
  // const bannerSrc = false;

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
    <div className="flex flex-col h-screen pt-10 gap-y-8 px-8 rounded">
      <h3 className="text-accent">Edit Profile</h3>

      <h5 className="-mb-6">Profile</h5>
      <div className="flex gap-x-4 bg-surface p-3 rounded-3xl shadow-xl border border-line">
        <div className="relative w-1/2 max-w-[calc(16rem*16/9)] shrink-0">
          <label className="group block cursor-pointer opacity-100">
            {bannerSrc ? (
              <Image
                src={bannerSrc}
                width={1000}
                height={1000}
                priority
                unoptimized={bannerSrc.startsWith("http")}
                alt="banner"
                className="aspect-video w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-line">
                <p>No banner set</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-medium text-white">Change banner</span>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => handleFile(e, "banner")}
            />
          </label>

          <label className="group absolute bottom-3 left-3 block w-1/4 cursor-pointer opacity-100">
            <Image
              src={avatarSrc}
              width={1000}
              height={1000}
              priority
              unoptimized={avatarSrc.startsWith("http")}
              alt="avatar"
              className="bg-surface aspect-square w-full rounded-full border border-white/70 object-cover shadow-xl"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <PlusIcon className="scale-150 text-white" />
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => handleFile(e, "avatar")}
            />
          </label>
        </div>

        <div className="flex flex-col gap-y-2 w-full">
          <FormInput
            id="displayName"
            label="Display Name"
            placeholder="Enter your display name"
            value={profile?.displayName ?? ""}
            onChange={(e) => {}}
            patch
          />
          <FormTextArea
            label="Bio"
            placeholder="Tell us about yourself..."
            id="bio"
            value={profile?.bio ?? ""}
            onChange={(e) => {}}
            patch
          />
        </div>
      </div>

      <h5 className="-mb-6">Gender</h5>
      <SingleSelect
        id="gender"
        options={GENDER}
        onChange={(e) => {}}
        value={"Male"}
        placeholder="Select your gender"
        patch
      />

      <div className="flex flex-col gap-y-2">
        <Button
          label="Save Changes"
          primary
          onClick={() => {}}
        />
        <span>Certain profile info, like your name, bio and links, is visible to everyone.</span>
      </div>
    </div>
  )
}