"use client"

import {useAuth} from "@/lib/auth/AuthProvider";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {ImageKind} from "@/lib/supabase/uploadProfileImage";
import {updateProfile} from "@/lib/supabase/updateProfile";
import {PlusIcon} from "@radix-ui/react-icons";
import {FormInput} from "@/components/form/FormInput";
import {FormTextArea} from "@/components/form/FormTextArea";
import {SingleSelect} from "@/components/form/FormSelection";
import {GENDER} from "@/app/(auth)/signup/_config/fields";
import {Button} from "@/components/Button";
import {ProfileDataPatch} from "@/models/settings/profileData";

export const EditProfile = () => {
  const {profile, user, refreshProfile} = useAuth();

  const [profilePatch, setProfilePatch] = useState<ProfileDataPatch>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const isDirty = Object.keys(profilePatch).length > 0;

  useEffect(() => {
    if(!avatarPreview) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => {
    if(!bannerPreview) return;
    return () => URL.revokeObjectURL(bannerPreview);
  }, [bannerPreview]);

  const avatarSrc = avatarPreview ?? profile?.profilePictureURL ?? "/images/default_pfp.svg";
  const bannerSrc = bannerPreview ?? profile?.bannerURL ?? "/images/placeholder_banner.jpeg";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, kind: ImageKind) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (kind === "avatar") {
      setProfilePatch(prev => ({...prev, profileImage: file}));
      setAvatarPreview(url);
    } else {
      setProfilePatch(prev => ({...prev, bannerImage: file}));
      setBannerPreview(url);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (profilePatch.displayName !== undefined && !profilePatch.displayName.trim()) {
      return setMessage("Display name can't be empty.");
    }

    setSaving(true);
    setMessage("Saving...");
    const {error} = await updateProfile(user.id, profilePatch);
    setSaving(false);
    if (error) return setMessage(error);
    setMessage("Profile updated successfully!");

    await refreshProfile();

    setProfilePatch({});
    setAvatarPreview(null);
    setBannerPreview(null);
  }

  return (
    <div className="flex flex-col h-screen pt-10 gap-y-8 px-8 rounded">
      <h3 className="text-accent">Edit Profile</h3>

      <h5 className="-mb-6">Profile</h5>
      <div className="flex gap-x-4 bg-surface p-3 rounded-3xl shadow-lg border border-line">
        <div className="relative w-1/2 max-w-[calc(16rem*16/9)] shrink-0">
          <label className="group block cursor-pointer opacity-100">
            {bannerSrc ? (
              <Image
                src={bannerSrc}
                width={1000}
                height={1000}
                priority
                alt="banner"
                className="aspect-video w-full rounded-xl object-cover border border-line"
                unoptimized={!bannerSrc.startsWith("/")}
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
              alt="avatar"
              className="bg-surface aspect-square w-full rounded-full border border-white/70 object-cover shadow-xl"
              unoptimized={!avatarSrc.startsWith("/")}
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
            value={profilePatch.displayName ?? profile?.displayName ?? ""}
            onChange={(e) => setProfilePatch(prev => ({...prev, displayName: e.target.value}))}
            patch
          />
          <FormTextArea
            label="Bio"
            placeholder="Tell us about yourself..."
            id="bio"
            value={profilePatch.bio ?? profile?.bio ?? ""}
            onChange={(e) => setProfilePatch(prev => ({...prev, bio: e.target.value}))}
            patch
          />
        </div>
      </div>

      {/* TODO: Implement Gender selection, currently unavailable */}

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
          label={saving ? "Saving..." : "Save Changes"}
          primary
          disabled={!isDirty || saving}
          onClick={handleSave}
        />
        <span>Certain profile info, like your name, bio and links, is visible to everyone.</span>
      </div>
    </div>
  )
}