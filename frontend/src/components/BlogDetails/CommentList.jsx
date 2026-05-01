"use client";

import { useBlogDetailsQuery } from "@/redux/services/blogs/blogApi";
import { useDeleteCommentMutation } from "@/redux/services/blogs/commentApi";
import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";

const CommentList = ({ comments = [], slug }) => {
  const { userId, role } = useSelector((state) => state.auth);

  const [deleteComment] = useDeleteCommentMutation();

  const { refetch } = useBlogDetailsQuery(slug, {
    skip: !slug,
  });

  const formatRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 my-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <FaRegCommentDots className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-500 font-medium">No comments yet</h3>
          <p className="text-gray-400 text-sm mt-1">
            Be the first to share your thoughts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mb-10 ">
      <div className="space-y-4">
        {comments.map((comment, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-5 group"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white bg-amber-600 font-semibold text-sm shadow-sm`}
                  >
                    {comment.name[0].toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800 text-[15px] hover:text-blue-600 transition-colors capitalize">
                        {comment.name}
                      </h4>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400 font-medium">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-[14px] leading-relaxed mt-1.5 wrap-break-word">
                    {comment.content}
                  </p>

                  {(role == "admin" || userId == comment.user) && (
                    <div className="flex items-center gap-5 mt-3">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors group/btn"
                      >
                        <span className="text-xs font-medium">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentList;
