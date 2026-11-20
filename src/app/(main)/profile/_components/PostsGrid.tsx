"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loadUserPosts, type ProfilePost } from "@/lib/supabase/loadUserPosts";
import { useCreatePost } from "@/app/(main)/profile/_components/CreatePostProvider";

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
    <div className="grid w-full grid-cols-2 gap-2 p-4 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.post_id}>
          {post.imageUrl && (
            <div className="relative aspect-square">
              <Image src={post.imageUrl} alt={post.caption ?? "Post image"} fill unoptimized className="object-cover" />
            </div>
          )}
          {post.caption && <p className="p-2">{post.caption}</p>}
        </article>
      ))}
    </div>
  );
}
