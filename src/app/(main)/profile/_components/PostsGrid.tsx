"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loadUserPosts, type ProfilePost } from "@/lib/supabase/loadUserPosts";
import { useCreatePost } from "@/app/(main)/profile/_components/CreatePostProvider";
import { HeartFilledIcon, ChatBubbleIcon } from "@radix-ui/react-icons";

export function PostsGrid() {
  const { postsVersion } = useCreatePost();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="grid w-full grid-cols-2 md:grid-cols-4">
      {posts.map((post) => (
        <article key={post.post_id}>
          {post.imageUrl && (
            <div className="relative aspect-square">
              <Image src={post.imageUrl} alt={post.caption ?? "Post image"} fill unoptimized className="object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity hover:opacity-100">
                {post.caption && <h5 className="truncate text-white">{post.caption}</h5>}
                <div className="flex justify-between">
                  <span className="shrink-0 text-white">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>

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
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
