"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loadUserPosts, type ProfilePost } from "@/lib/supabase/loadUserPosts";
import { useCreatePost } from "@/app/(main)/profile/_components/CreatePostProvider";
import { HeartFilledIcon, HeartIcon, ChatBubbleIcon, Cross2Icon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/Button";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function PostsGrid() {
  const { postsVersion } = useCreatePost();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<ProfilePost | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      return;
    }

    let cancelled = false;

    loadUserPosts(user.id)
      .then((result) => {
        if (!cancelled) {
          setPosts(result);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not load posts.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, postsVersion]);

  if (authLoading) return <p>Loading posts...</p>;
  if (!user) return <p>Sign in to see your posts.</p>;
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (posts.length === 0) return <p>You have not posted anything.</p>;

  return (
    <>
      <div className="grid w-full grid-cols-2 md:grid-cols-4">
        {posts.map((post) => (
          <article key={post.post_id}>
            {post.imageUrl && (
              <button
                type="button"
                onClick={() => setSelectedPost(post)}
                className="relative block aspect-square w-full cursor-pointer"
              >
                <Image src={post.imageUrl} alt={post.caption ?? "Post image"} fill unoptimized className="object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-2 text-left opacity-0 transition-opacity hover:opacity-100">
                  {post.caption && <h5 className="truncate text-white">{post.caption}</h5>}
                  <div className="flex justify-between">
                    <span className="shrink-0 text-white">{formatDate(post.created_at)}</span>

                    {/* TODO: add real likes and comments count */}
                    <div className="flex items-center gap-x-2">
                      <div className="flex items-center gap-x-1 text-white">
                        <HeartFilledIcon className="scale-80" />
                        <span className="text-white">12.2k</span>
                      </div>
                      <div className="flex items-center gap-x-1 text-white">
                        <ChatBubbleIcon className="scale-80" />
                        <span className="text-white">1.2k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )}
          </article>
        ))}
      </div>

      <PostDialog post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}

interface PostDialogProps {
  post: ProfilePost | null;
  onClose: () => void;
}

function PostDialog({ post, onClose }: PostDialogProps) {
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