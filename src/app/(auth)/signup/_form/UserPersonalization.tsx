"use client";

import { UserPersonalizationData } from "@/models/login/data";
import { IconBlock } from "@/app/(auth)/_components/IconBlock";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import { FormInput } from "@/components/form/FormInput";
import { FormTextArea } from "@/components/form/FormTextArea";
import { useEffect } from "react";

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

  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<HamburgerMenuIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Personalize your account</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="flex items-center gap-x-5">
          <button className="cursor-pointer rounded-3xl border border-dashed border-black/20 p-9">
            <PlusIcon className="scale-150 text-black/50" />
          </button>
          <div className="flex flex-col gap-y-2">
            <h5>Profile Picture</h5>
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
