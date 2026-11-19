import React, { memo, useEffect, useState } from "react";
import SubmitButton from "../ui/submitButton";
import { useCreateCommentMutation } from "@/redux/services/blogs/commentApi";
import { useBlogDetailsQuery } from "@/redux/services/blogs/blogApi";
import { useNotificationListQuery } from "@/redux/services/blogs/notification";
import Link from "next/link";

const CommentForm = ({ auth, blog, slug }) => {
  const [mounted, setMounted] = useState(false);
  const [comment, setComment] = useState("");

  const [createComment, { isLoading }] = useCreateCommentMutation();
  const { refetch } = useBlogDetailsQuery(slug, {
    skip: !slug,
  });

  const { refetch: notificationRefetch } = useNotificationListQuery(auth, {
    skip: !auth,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth) {
      alert("Please login first!");
      return;
    }

    if (!comment.trim()) return;

    try {
      await createComment({
        blog: blog.id,
        content: comment.trim(),
      }).unwrap();
      notificationRefetch();
      refetch();
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_35px_-28px_rgba(41,32,22,0.4)] sm:p-7">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Join the conversation</p>
        <h3 className="mt-2 font-serif text-2xl text-stone-900">Leave a comment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
          <label htmlFor="comment" className="sr-only">Your comment</label>
          <textarea
  id="comment"
  name="comment"
  rows="5"
  disabled={!auth}
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  className={`w-full resize-none rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400`}
  placeholder={
    auth
      ? "Share your thoughts..."
      : "Please login to post a comment."
  }
/>
          </div>
        </div>

        {!auth && <p className="text-sm text-stone-500">Please <Link href="/login" className="font-semibold text-amber-900 underline decoration-amber-300 underline-offset-2">log in</Link> to join the conversation.</p>}

        <div className="pt-1 sm:max-w-56">
          <SubmitButton
            disabled={!auth}
            isLoading={isLoading}
            isLoadingText="Processing..."
            type="submit"
            text="Post Comment"
          />
        </div>
      </form>
    </div>
  );
};

export default memo(CommentForm);
