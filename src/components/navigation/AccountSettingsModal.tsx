"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import React from "react";
import { Property } from "csstype";
import { PersonIcon, GearIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface ModalButtonProps {
  label: string;
  destination: string;
  icon: React.ReactNode;
}

/**
 * @param label - The text to display on the button
 * @param destination - The destination of the button
 * @param icon - The icon to display on the button
 *
 * @component - ModalButton is used to display a button in the AccountSettingsModal.
 */

const ModalButton = ({ label, destination, icon }: ModalButtonProps) => {
  return (
    <button className="bg-light-background flex w-full cursor-pointer items-center gap-x-2 px-4 py-2 text-black/50 hover:bg-black/10">
      {icon}
      <Link href={destination} className="w-full text-left text-xs">
        {label}
      </Link>
    </button>
  );
};

interface AccountSettingsModalProps {
  id: string;
  posAnchor: Property.PositionAnchor | undefined;
  posArea: Property.PositionArea | undefined;
  onSignOut?: () => void;
}

/**
 * @param id - The unique identifier for the modal
 * @param posAnchor - The anchor point of the modal
 * @param posArea - The area in which the modal is positioned
 * @param onSignOut - The function to call when the user signs out
 *
 * @component - AccountSettingsModal is a modal that displays the user's profile and provides options to sign out.
 */

// TODO: Implement a tri-state button (System, Light Mode, and Dark Mode)

export const AccountSettingsModal = ({ id, posAnchor, posArea, onSignOut }: AccountSettingsModalProps) => {
  const { user, profile } = useAuth();

  return (
    <div
      id={id}
      popover="auto"
      className="m-0 min-w-64 gap-y-2 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
      style={
        {
          positionAnchor: posAnchor,
          positionArea: posArea,
          marginTop: "0.5rem",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col px-4 py-2">
        <p className="text-sm">{profile?.displayName}</p>
        <span className="text-black/45">{user?.email}</span>
      </div>

      <div className="w-full border-b border-black/10" />

      <ModalButton label="Profile" destination="/profile" icon={<PersonIcon />} />
      <ModalButton label="User Settings" destination="/settings" icon={<GearIcon />} />
      <ModalButton label="User Support" destination="/faq" icon={<QuestionMarkIcon />} />

      <div className="w-full border-b border-black/10" />

      <div className="w-full p-2">
        <button
          className="bg-button-primary w-full rounded-md py-1 text-xs font-semibold text-white hover:brightness-90"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
