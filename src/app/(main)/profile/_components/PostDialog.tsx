import type { ProfilePost } from "@/lib/supabase/loadUserPosts";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import Image from "next/image";
import { ChatBubbleIcon, Cross2Icon, HeartFilledIcon, HeartIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/Button";
import { formatDate } from "@/components/misc/date/formatDate";
import { updatePostCaption } from "@/lib/supabase/updatePostCaption";
import { deletePost } from "@/lib/supabase/deletePost";
import Link from "next/link";
import { loadPostInteractions, type PostInteractions } from "@/lib/supabase/loadPostInteractions";
import { addPostComment, setPostLiked } from "@/lib/supabase/postInteractions";

interface PostDialogProps {
  post: ProfilePost | null;
  onClose: () => void;
  onChanged: () => void;
  enableInteractions: boolean;
  onInteractionsChanged: (postId: string, counts: { likeCount:number; commentCount: number }) => void;
}

/**
 * @param post - The post to display
 * @param onClose - Function to call when the dialog is closed
 *
 * @Component - The PostDialog component is a modal dialog that displays a single post. It includes the post's image,
 * caption, author information, and comments.
 */

export const PostDialog = ({ post, enableInteractions, onClose, onChanged, onInteractionsChanged }: PostDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { profile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(post?.caption ?? "");
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");
  const [interactions, setInteractions] = useState<PostInteractions | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [interactionPending, setInteractionPending] = useState(false);

  const handleSaveCaption = async () => {
    if (!post || saving) return;

    setSaving(true);
    setActionError(null);

    try {
      await updatePostCaption(post.post_id, caption);
      ref.current?.close();
      onChanged();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not update the post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || saving) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    setSaving(true);
    setActionError(null);

    try {
      const result = await deletePost(post.post_id);
      ref.current?.close();
      onChanged();
      if (result.warning) window.alert(result.warning);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not delete the post.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (post) ref.current?.showModal();
    else ref.current?.close();
  }, [post]);

  useEffect(() => {
  if (!post || !enableInteractions || !user) return;

  let cancelled = false;

  loadPostInteractions(post.post_id, user.id)
    .then((result) => {
      if (!cancelled) setInteractions(result);
    })
    .catch((cause: unknown) => {
      if (!cancelled) {
        setInteractionError(cause instanceof Error ? cause.message : "Could not load post interactions.");
      }
    });

  return () => {
    cancelled = true;
  };
}, [enableInteractions, post, user]);

  const handleClose = () => {
    setComment("");
    onClose();
  };

  const handleToggleLike = async () => {
  if (!post || !user || !interactions || interactionPending) return;

  setInteractionPending(true);
  setInteractionError(null);

  try {
    await setPostLiked(post.post_id, user.id, !interactions.likedByCurrentUser);
    const updated = await loadPostInteractions(post.post_id, user.id);
    setInteractions(updated);
    onInteractionsChanged(post.post_id, updated);
  } catch (cause) {
    setInteractionError(cause instanceof Error ? cause.message : "Could not update your like.");
  } finally {
    setInteractionPending(false);
  }
};

const handleAddComment = async () => {
  if (!post || !user || interactionPending) return;
  const body = comment.trim();
  if (!body) return;

  setInteractionPending(true);
  setInteractionError(null);

  try {
    await addPostComment(post.post_id, user.id, body);
    setComment("");
    const updated = await loadPostInteractions(post.post_id, user.id);
    setInteractions(updated);
    onInteractionsChanged(post.post_id, updated);
  } catch (cause) {
    setInteractionError(cause instanceof Error ? cause.message : "Could not add your comment.");
  } finally {
    setInteractionPending(false);
  }
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
          <div className="bg-surface border-line relative aspect-square flex-1 border-r">
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
                  src={post.author?.profile_picture_url ?? "/images/default_pfp.svg"}
                  width={1000}
                  height={1000}
                  unoptimized
                  alt="avatar"
                  className="bg-surface aspect-square max-w-8 rounded-full border object-cover"
                />
              {post.author?.handle ? (
                <Link href={`/profile/${encodeURIComponent(post.author.handle)}`} className="hover:underline">
                  {post.author.display_name ?? `@${post.author.handle}`}
                </Link>
              ) : (
                <h6>User</h6>
              )}
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

            {editing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={caption}
                  maxLength={2000}
                  disabled={saving}
                  onChange={(event) => setCaption(event.target.value)}
                  className="border-line min-h-24 rounded-xl border p-3"
                  aria-label="Post caption"
                />
                <div className="flex gap-2">
                  <button type="button" disabled={saving} onClick={handleSaveCaption}>
                    {saving ? "Saving..." : "Save caption"}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setCaption(post.caption ?? "");
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <span>{post.caption}</span>
            )}

            {actionError && <p role="alert">{actionError}</p>}

            {post.user_id === user?.id && !editing && (
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(true)}>
                  Edit caption
                </button>
                <button type="button" disabled={saving} onClick={handleDeletePost}>
                  Delete post
                </button>
              </div>
            )}
            <span className="text-subtle">{formatDate(post.created_at)}</span>

            <hr />

            {enableInteractions && (
  <>
    <hr />
    <div className="flex-1 overflow-y-auto">
      {interactionError && <p role="alert">{interactionError}</p>}
      {!user ? (
        <p className="text-muted">Sign in to like or comment.</p>
      ) : !interactions ? (
        <p className="text-muted">Loading likes and comments...</p>
      ) : interactions.comments.length === 0 ? (
        <p className="text-muted">No comments yet.</p>
      ) : (
        <ul className="flex flex-col gap-y-3">
          {interactions.comments.map((item) => (
            <li key={item.comment_id} className="flex flex-col">
              {item.handle ? (
                <Link
                  href={`/profile/${encodeURIComponent(item.handle)}`}
                  className="font-medium hover:underline"
                >
                  {item.display_name ?? `@${item.handle}`}
                </Link>
              ) : (
                <span className="font-medium">{item.display_name ?? "User"}</span>
              )}
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <hr />
    <div className="flex items-center gap-x-4">
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={!user || !interactions || interactionPending}
        aria-label={interactions?.likedByCurrentUser ? "Unlike" : "Like"}
        className="flex items-center gap-x-1 disabled:cursor-not-allowed"
      >
        {interactions?.likedByCurrentUser ? (
          <HeartFilledIcon className="size-5 text-red-500" />
        ) : (
          <HeartIcon className="size-5" />
        )}
        <span>{interactions?.likeCount ?? 0}</span>
      </button>
      <div className="flex items-center gap-x-1">
        <ChatBubbleIcon className="size-5" />
        <span>{interactions?.commentCount ?? 0}</span>
      </div>
    </div>

    <div className="flex gap-x-2">
      <input
        type="text"
        maxLength={2000}
        placeholder="Add a comment..."
        value={comment}
        disabled={!user || interactionPending}
        onChange={(event) => setComment(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void handleAddComment();
          }
        }}
        className="border-line flex-1 rounded-xl border px-3 py-2"
      />
      <Button
        icon={<PaperPlaneIcon />}
        primary
        disabled={!user || !comment.trim() || interactionPending}
        className="px-4!"
        onClick={handleAddComment}
      />
    </div>
  </>
)}
          </div>
        </div>
      )}
    </dialog>
  );
};
