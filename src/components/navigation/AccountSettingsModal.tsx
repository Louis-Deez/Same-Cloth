"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import React from "react";
import { Property } from "csstype";
import { PersonIcon, GearIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {ThemeSelector} from "@/components/misc/ThemeSelector";
import {ThemeModeType} from "@/components/misc/themeModeType";

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
    <Link href={destination} className="flex w-full items-center gap-x-2 px-4 py-2 text-xs text-foreground hover:bg-foreground/10 opacity-65">
      {icon}
      {label}
    </Link>
  );
};

interface AccountSettingsModalProps {
  id: string;
  posAnchor: Property.PositionAnchor | undefined;
  posArea: Property.PositionArea | undefined;
  onSignOut?: () => void;
  className?: string;
}

/**
 * @param id - The unique identifier for the modal
 * @param posAnchor - The anchor point of the modal
 * @param posArea - The area in which the modal is positioned
 * @param onSignOut - The function to call when the user signs out
 * @param className - Additional CSS classes to apply to the modal
 *
 * @component - AccountSettingsModal is a modal that displays the user's profile and provides options to sign out.
 */

// TODO: Implement a tri-state button (System, Light Mode, and Dark Mode)

export const AccountSettingsModal = ({ id, posAnchor, posArea, onSignOut, className }: AccountSettingsModalProps) => {
  const { user, profile } = useAuth();

  return (
    <div
      id={id}
      popover="auto"
      className={`m-0 min-w-64 gap-y-2 overflow-hidden rounded-xl border shadow-lg ${className ?? ""}`}
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
        <span>{user?.email}</span>
      </div>

      <div className="w-full border-b " />

      <ModalButton label="Profile" destination="/profile" icon={<PersonIcon />} />
      <ModalButton label="User Settings" destination="/settings" icon={<GearIcon />} />
      <ModalButton label="User Support" destination="/faq" icon={<QuestionMarkIcon />} />

      <div className="w-full border-b " />

      <div className="flex flex-col">
        <span className="px-4 pt-2 pb-1">Theme</span>
        <ThemeSelector selectedTheme={ThemeModeType.SYSTEM}/>
        <ThemeSelector selectedTheme={ThemeModeType.LIGHT}/>
        <ThemeSelector selectedTheme={ThemeModeType.DARK}/>
      </div>

      <div className="w-full border-b " />

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
