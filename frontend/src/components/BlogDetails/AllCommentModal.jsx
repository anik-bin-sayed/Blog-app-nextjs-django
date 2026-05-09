"use client";

import { useBlogDetailsQuery } from "@/redux/services/blogs/blogApi";
import { useDeleteCommentMutation } from "@/redux/services/blogs/commentApi";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const AllCommentModal = ({
  setOpenModal,
  openModal,
  isLoading = false,
  comments = [],
  setPage,
  page,
  pagination,
  userId,
  slug,
  role,
}) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loaderRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [deleteComment, { isLoading: deleting }] = useDeleteCommentMutation();

  const { refetch } = useBlogDetailsQuery(
    {
      slug,
      page,
    },
    {
      skip: !slug,
    },
  );

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    return `${diffDays} day ago`;
  };

  useEffect(() => {
    if (!loaderRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          pagination?.next &&
          !isLoading &&
          !isFetchingMore
        ) {
          setIsFetchingMore(true);

          setPage((prev) => prev + 1);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
        rootMargin: "0px 0px 200px 0px",
      },
    );

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [pagination?.next, isLoading, isFetchingMore, setPage]);

  // Reset loading state
  useEffect(() => {
    if (!isLoading) {
      setIsFetchingMore(false);
    }
  }, [isLoading]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && openModal) {
        setOpenModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [openModal, setOpenModal]);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  if (!openModal) return null;

  const skeletonItems = [1, 2, 3, 4];

  const handleDelete = async (id) => {
    try {
      await deleteComment(id).unwrap();

      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200 border"
      onClick={() => setOpenModal(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-5 duration-300 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 select-none">
            All Comments
          </h2>

          <button
            onClick={() => setOpenModal(false)}
            className="group relative p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition duration-300 hover:rotate-180 cursor-pointer select-none"
            aria-label="Close modal"
          >
            <RxCross2 className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4"
        >
          {isLoading && comments.length === 0 ? (
            <div className="space-y-5">
              {skeletonItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />

                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />

                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm select-none">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-2 rounded shadow-sm border border-gray-100"
                  >
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-medium text-base uppercase select-none">
                        {comment.name?.[0] || "U"}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-900 capitalize leading-tight">
                            {comment.name}
                          </span>

                          <span className="text-xs text-gray-500 mt-0.5">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>

                        {(role == "admin" || userId == comment.user) && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={deleting}
                            className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 active:scale-95 cursor-pointer"
                            title="Delete comment"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed wrap-break-word">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                ref={loaderRef}
                className="flex justify-center items-center py-6"
              >
                {isLoading && comments.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Loading more comments...
                  </div>
                )}

                {!pagination?.next && comments.length > 0 && (
                  <p className="text-sm text-gray-400">No more comments</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AllCommentModal;
