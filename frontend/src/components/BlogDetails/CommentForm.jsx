import React, { memo, useState } from "react";
import SubmitButton from "../ui/submitButton";
import {
  useAllCommentsQuery,
  useCreateCommentMutation,
} from "@/redux/services/blogs/commentApi";
import { useBlogDetailsQuery } from "@/redux/services/blogs/blogApi";
import { useNotificationListQuery } from "@/redux/services/blogs/notification";

const CommentForm = ({ auth, blog, slug }) => {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const [createComment, { isLoading }] = useCreateCommentMutation();
  const { refetch } = useBlogDetailsQuery(slug, {
    skip: !slug,
  });

  const { refetch: notificationRefetch } = useNotificationListQuery();

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

  return (
    <div className="rounded-2xl p-6 md:p-8 transition-all">
      <div className="flex items-center gap-3 my-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 ">
          Leave a Comment
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
            <textarea
              id="comment"
              name="comment"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.comment
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300  focus:ring-amber-500"
              } bg-white  text-gray-900 focus:outline-none focus:ring-2 transition-colors resize-none`}
              placeholder="Share your thoughts..."
            />
          </div>
        </div>

        <div className="pt-1">
          <SubmitButton
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
