"use client";

import React, {useEffect, useRef, useState} from "react";
import {PlusIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/Button";
import {useAuth} from "@/lib/auth/AuthProvider";
import Image from "next/image";
import {FormTextArea} from "@/components/form/FormTextArea";
import {emptyPostData, PostData} from "@/models/post/data";

export interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
  const [post, setPost] = useState<PostData>(emptyPostData);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const { profile, user } = useAuth();

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!post.postImage) return setPreviewUrl(null);
    const url = URL.createObjectURL(post.postImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [post.postImage]);

  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  const handlePostCancellation = () => {
    onClose();
    setPost(emptyPostData);
  }

  return (
    <dialog
      ref={ref}
      className="border-line bg-surface m-auto w-full max-w-6xl rounded-4xl border p-0"
      onClose={handlePostCancellation}
    >
      <div className="flex w-full">

        <div className="aspect-square flex-1">
          <button
            type="button"
            className="border-line text-subtle flex size-full cursor-pointer flex-col items-center justify-center gap-y-2 overflow-hidden border-r border-dashed"
            onClick={() => fileInput.current?.click()}
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="post preview" width={1000} height={1000} unoptimized className="size-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-y-1">
                <PlusIcon className="size-5" />
                <p>Select an Image</p>
              </div>
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => setPost({...post, postImage: e.target.files?.[0] ?? null })}
          />
        </div>

        <div className="flex min-w-28 shrink-0 flex-col gap-y-4 p-8">
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
              placeholder={`What's on your mind, ${profile?.firstName ?? "friend"}?`}
              className="flex-1"
              value={post.postCaption}
              onChange={(e) => setPost({...post, postCaption: e.target.value})}
            />
          </div>

          <div className="flex flex-row gap-x-4 mt-auto">
            <Button label="Post" primary/>
            <Button label="Cancel" onClick={handlePostCancellation} />
          </div>
        </div>

      </div>
    </dialog>
  )
}