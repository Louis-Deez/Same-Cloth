import type {ProfilePost} from "@/lib/supabase/loadUserPosts";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@/lib/auth/AuthProvider";
import Image from "next/image";
import {ChatBubbleIcon, Cross2Icon, HeartFilledIcon, HeartIcon, PaperPlaneIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/Button";
import {formatDate} from "@/app/(main)/profile/_components/PostsGrid";

interface PostDialogProps {
  post: ProfilePost | null;
  onClose: () => void;
}

/**
 * @param post - The post to display
 * @param onClose - Function to call when the dialog is closed
 *
 * @Component - The PostDialog component is a modal dialog that displays a single post. It includes the post's image,
 * caption, author information, and comments.
 */

export const PostDialog = ({ post, onClose }: PostDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (post) ref.current?.showModal();
    else ref.current?.close();
  }, [post]);

  const handleClose = () => {
    setLiked(false);
    setComment("");
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="border-line m-auto w-full max-w-5xl overflow-hidden rounded-4xl border p-0 backdrop:bg-black/50"
    >
      {post && (
        <div className="flex w-full">
          <div className="relative aspect-square flex-1 bg-surface border-r border-line">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.caption ?? "Post image"}
                fill
                unoptimized
                className="object-contain"
              />
            )}
          </div>

          <div className="flex w-96 shrink-0 flex-col gap-y-4 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Image
                  src={profile?.profilePictureURL ?? "/images/default_pfp.svg"}
                  width={1000}
                  height={1000}
                  unoptimized
                  alt="avatar"
                  className="bg-surface aspect-square max-w-8 rounded-full border object-cover"
                />
                <h6>{profile?.handle}</h6>
              </div>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="text-muted hover:text-foreground cursor-pointer"
                aria-label="Close"
              >
                <Cross2Icon className="size-5" />
              </button>
            </div>

            {post.caption && <span>{post.caption}</span>}
            <span className="text-subtle">{formatDate(post.created_at)}</span>

            <hr />

            {/* TODO: load real comments */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-muted">No comments yet.</p>
            </div>

            <hr />

            {/* TODO: real like state + counts */}
            <div className="flex items-center gap-x-4">
              <button
                type="button"
                onClick={() => setLiked((l) => !l)}
                className="flex cursor-pointer items-center gap-x-1"
                aria-label={liked ? "Unlike" : "Like"}
              >
                {liked ? <HeartFilledIcon className="size-5 text-red-500" /> : <HeartIcon className="size-5" />}
                <span>12.2k</span>
              </button>
              <div className="flex items-center gap-x-1">
                <ChatBubbleIcon className="size-5" />
                <span>1.2k</span>
              </div>
            </div>

            {/* TODO: insert into post_comment */}
            <div className="flex gap-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border-line flex-1 rounded-xl border px-3 py-2"
              />
              <Button
                icon={<PaperPlaneIcon/>}
                primary
                disabled={!comment.trim()}
                className="px-4!"
              />
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}