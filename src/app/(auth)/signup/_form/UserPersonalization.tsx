"use client";

import { UserPersonalizationData } from "@/models/login/data";
import { IconBlock } from "@/app/(auth)/_components/IconBlock";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import { FormInput } from "@/components/form/FormInput";
import { FormTextArea } from "@/components/form/FormTextArea";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

interface UserPersonalizationProps {
  data: UserPersonalizationData;
  onChange: (updates: Partial<UserPersonalizationData>) => void;
  onValidChange: (valid: boolean) => void;
}

const UserPersonalization = ({ data, onChange, onValidChange }: UserPersonalizationProps) => {
  const displayNameValid = data.displayName.length > 0;
  const handleValid = data.handle.length > 0;

  useEffect(() => {
    onValidChange(displayNameValid && handleValid);
  }, [displayNameValid, handleValid, onValidChange]);

  const fileInput = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(
    () => (data.profilePicture ? URL.createObjectURL(data.profilePicture) : null),
    [data.profilePicture],
  );
  
  const bannerInput = useRef<HTMLInputElement>(null);
  const bannerPreviewUrl = useMemo(
    () => (data.bannerPicture ? URL.createObjectURL(data.bannerPicture) : null),
    [data.bannerPicture],
  );

  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<HamburgerMenuIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Personalize your account</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex flex-col gap-y-5">
                <div className="flex flex-col gap-y-2">
          <h4>Banner</h4>
          <button
            type="button"
            onClick={() => bannerInput.current?.click()}
            className="border-foreground/20 relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed"
          >
            {bannerPreviewUrl ? (
              <Image src={bannerPreviewUrl} alt="banner preview" fill unoptimized className="object-cover" />
            ) : (
              <PlusIcon className="text-subtle scale-150" />
            )}
          </button>
          <input
            ref={bannerInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => onChange({ bannerPicture: e.target.files?.[0] ?? null })}
          />
        </div>
        <div className="flex items-center gap-x-5">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="border-foreground/20 cursor-pointer overflow-hidden rounded-3xl border border-dashed p-9"
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="profile preview" width={72} height={72} unoptimized className="-m-9 h-[108px] w-[108px] max-w-none object-cover" />
            ) : (
              <PlusIcon className="text-subtle scale-150" />
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => onChange({ profilePicture: e.target.files?.[0] ?? null })}
          />
          <div className="flex flex-col gap-y-2">
            <h4>Profile Picture</h4>
            <span>Choose a profile picture that represents you best, you can always change it later.</span>
          </div>
        </div>
        <FormInput
          label="Handle"
          placeholder="Enter your handle"
          id="handle"
          value={data.handle}
          onChange={(e) => onChange({ handle: e.target.value })}
          required
          errorMessage="You must enter a handle"
        />
        <FormInput
          label="Display Name"
          placeholder="Enter your display name"
          id="displayName"
          value={data.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
          required
          errorMessage="You must enter your display name"
        />
        <FormTextArea
          label="Bio"
          placeholder="Tell us about yourself..."
          id="bio"
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
        {/* TODO: implement external links */}
      </div>
    </section>
  );
};

export default UserPersonalization;
