"use client";

import React, {useEffect, useRef, useState} from "react";
import {PlusIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/Button";
import {useAuth} from "@/lib/auth/AuthProvider";
import Image from "next/image";
import {FormTextArea} from "@/components/form/FormTextArea";
import {emptyPostData, PostData} from "@/models/post/data";
import {createPost} from "@/lib/supabase/createPost";


export interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal = ({ open, onClose, onPostCreated, }: CreatePostModalProps) => {
  const [post, setPost] = useState<PostData>(emptyPostData);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const { profile, user } = useAuth();

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  const resetPostForm = () => {
    onClose();
    setPost(emptyPostData);
    setPreviewUrl(null);
    setSubmitError(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  const handlePostCancellation = () => {
    if (isSubmitting) return;
    resetPostForm();
  }

  const handlePostSubmission = async () => {
    if (isSubmitting) return;
    if (!user) {
      setSubmitError("Sign in to create a post.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createPost(post, user.id);
      if (result.error) {
        setSubmitError(result.error);
        return;
      }

      onPostCreated();
      resetPostForm();

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create your post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={ref}
      className="border-line bg-surface m-auto w-full max-w-6xl rounded-4xl border p-0"
      onClose={handlePostCancellation}
      onCancel={(event) => {
        if (isSubmitting) event.preventDefault();
      }}
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
            disabled={isSubmitting}
            onChange={(e) => {
              const image = e.target.files?.[0] ?? null;
              setPreviewUrl(image ? URL.createObjectURL(image) : null);
              setPost({...post, postImage: image});
            }}
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
              maxLength={2000}
              disabled={isSubmitting}
              onChange={(e) => setPost({...post, postCaption: e.target.value})}
            />
          </div>

          {submitError && <p className="text-danger" role="alert">{submitError}</p>}

          <div className="flex flex-row gap-x-4 mt-auto">
            <Button
              label={isSubmitting ? "Posting..." : "Post"}
              primary
              disabled={isSubmitting}
              onClick={handlePostSubmission}
            />
            <Button label="Cancel" disabled={isSubmitting} onClick={handlePostCancellation} />
          </div>
        </div>

      </div>
    </dialog>
  )
}