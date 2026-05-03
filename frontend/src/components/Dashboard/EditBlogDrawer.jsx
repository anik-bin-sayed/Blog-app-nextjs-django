"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, memo } from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import TextArea from "../ui/TextArea";
import CategoryModal from "./CategoryModal";
import {
  useGetAllCategoriesQuery,
  useUpdateBlogMutation,
} from "@/redux/services/blogs/blogApi";

const initialFormData = {
  title: "",
  excerpt: "",
  content: "",
};

const EditBlogDrawer = ({ isOpen, onClose, editBlog = null }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [featured, setFeatured] = useState(false);

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categories, refetch: refetchCategories } =
    useGetAllCategoriesQuery();
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const drawerRef = useRef();

  const thumbnailRef = useRef(null);

  useEffect(() => {
    thumbnailRef.current = thumbnailPreview;
  }, [thumbnailPreview]);

  useEffect(() => {
    const resetForm = () => {
      setFormData(initialFormData);
      setThumbnailFile(null);

      if (thumbnailRef.current && thumbnailRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailRef.current);
      }

      setThumbnailPreview(null);
      setSelectedCategory("");
      setErrors({});
      setSuccessMessage("");
      setFeatured(false);
    };

    if (editBlog) {
      setFormData({
        title: editBlog.title || "",
        excerpt: editBlog.excerpt || "",
        content: editBlog.content || "",
      });

      setSelectedCategory(editBlog.category?.id || "");
      setThumbnailPreview(editBlog.thumbnail_url || null);

      setFeatured(Boolean(editBlog.is_featured));
    } else {
      resetForm();
    }
  }, [editBlog, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Only image files are allowed",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: "Max file size is 5MB" }));
      return;
    }

    setThumbnailFile(file);
    const preview = URL.createObjectURL(file);
    setThumbnailPreview(preview);
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturedChange = (e) => {
    setFeatured(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors((prev) => ({ ...prev, title: "Title is required" }));
      return;
    }

    if (!selectedCategory) {
      setErrors((prev) => ({ ...prev, category: "Please select a category" }));
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", selectedCategory);
      formDataToSend.append("is_featured", featured);

      if (thumbnailFile) {
        formDataToSend.append("image", thumbnailFile);
      }

      await updateBlog({
        id: editBlog.id,
        data: formDataToSend,
      }).unwrap();

      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      setSuccessMessage("Blog updated successfully!");
      setErrors({});

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      setErrors((prev) => ({
        ...prev,
        form:
          err?.data?.message ||
          err?.data?.detail ||
          "Update failed. Try again.",
      }));
    }
  };

  const handleCategoryModalClose = (refresh) => {
    if (refresh) {
      refetchCategories();
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          isOpen
            ? "bg-opacity-50 pointer-events-auto bg-black/50"
            : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white rounded shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 bg-linear-to-r from-yellow-400 to-yellow-500 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-black">
              Edit Blog
            </h2>
            <p className="text-black text-sm mt-1">Update your story</p>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 transition p-1 rounded-full bg-white/20 hover:rotate-90 hover:border border-gray-500 cursor-pointer"
            aria-label="Close drawer"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {errors.form && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition placeholder:text-gray-500 text-gray-700 ${
                errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Enter an engaging title"
              required
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <TextArea
            label="Excerpt"
            name="excerpt"
            errors={errors.excerpt || ""}
            value={formData.excerpt}
            handleChange={handleChange}
          />

          <TextArea
            label="Content"
            name="content"
            row={14}
            errors={errors.content || ""}
            value={formData.content}
            handleChange={handleChange}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Thumbnail Image
            </label>
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="flex-1 w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <RiUploadCloud2Line className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-1 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
                {errors.thumbnail && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              {thumbnailPreview && (
                <div className="relative group shrink-0">
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      if (thumbnailPreview.startsWith("blob:"))
                        URL.revokeObjectURL(thumbnailPreview);
                      setThumbnailPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                    aria-label="Remove thumbnail"
                  >
                    <RxCross2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-5 py-2.5 rounded-md transition cursor-pointer"
              >
                + New Category
              </button>
            </div>

            {selectedCategory && (
              <p className="mt-2 text-xs text-gray-500">
                Selected:{" "}
                {categories?.find((cat) => cat.id === selectedCategory)?.name}
              </p>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={featured}
              onChange={handleFeaturedChange}
              className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-yellow-600 transition">
              Featured (highlight this blog)
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              {isLoading ? "Updating..." : "Update Blog"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-md transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <CategoryModal setIsModalOpen={handleCategoryModalClose} />
      )}
    </>
  );
};

export default memo(EditBlogDrawer);
