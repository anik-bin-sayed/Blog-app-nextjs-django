import React, { useState } from "react";
import { FaCommentDots, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import SubmitButton from "../ui/submitButton";

const CommentForm = () => {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.lod(formData);
  };

  return (
    <div className="rounded-2xl p-6 md:p-8 transition-all border">
      <div className="flex items-center gap-3 my-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 ">
          Leave a Comment
        </h3>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50  rounded-xl flex items-center gap-3 text-green-700  border border-green-200 ">
          <FaCheckCircle className="w-5 h-5 shrink-0" />
          <span>
            Your comment has been submitted successfully! It will appear after
            moderation.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
            <textarea
              id="comment"
              name="comment"
              rows="5"
              value={comment}
              onChange={(e) => e.target.value}
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
            isLoading={isSubmitting}
            isLoadingText="Processing..."
            type="submit"
            text="Post Comment"
          />
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
