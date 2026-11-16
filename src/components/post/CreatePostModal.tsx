"use client";

import React, {RefObject, useEffect, useRef} from "react";
import {PlusIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/Button";
import {useAuth} from "@/lib/auth/AuthProvider";
import Image from "next/image";
import {FormTextArea} from "@/components/form/FormTextArea";

export interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { profile, user } = useAuth();


  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="border-line bg-surface m-auto w-full max-w-4xl rounded-4xl border p-0"
      onClose={onClose}
    >
      <div className="flex w-full">

        <div className="border-line text-subtle flex aspect-square w-1/2 shrink-0 flex-col items-center justify-center gap-y-2 border-r border-dashed">
          <PlusIcon className="size-5" />
          <p>Select an Image</p>
        </div>

        <div className="flex flex-col gap-y-4 p-8 justify-between w-full">
          <h2>Create a Post</h2>

          <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-2 items-center">
              <Image
                src={profile?.profilePictureURL ?? "/images/default_pfp.svg"}
                width={1000}
                height={1000}
                alt="placeholder_profile"
                className="bg-surface aspect-square max-w-8 rounded-3xl border-1 object-cover"
              />
              <h6>{profile?.handle}</h6>
            </div>

            <FormTextArea
              id="post-content"
              label="Caption"
              placeholder="What's on your mind?"
              className="flex-1"
              required
            />
          </div>

          <div className="flex flex-row gap-x-4">
            <Button label="Post" primary disabled/>
            <Button label="Cancel" onClick={onClose} />
          </div>
        </div>

      </div>
    </dialog>
  )
}