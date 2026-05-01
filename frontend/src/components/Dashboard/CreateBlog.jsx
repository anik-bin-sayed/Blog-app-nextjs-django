"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import TextArea from "../ui/TextArea";
import CategoryModal from "./CategoryModal";
import {
  useCreateBlogMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/services/blogs/blogApi";
import { RxCross2 } from "react-icons/rx";
import { FaCheckCircle } from "react-icons/fa";

const initialFormData = {
  title: "",
  excerpt: "",
  content: "",
};

const CreateBlog = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loadingAction, setLoadingAction] = useState(null);

  const { data: categories } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createBlog, { isLoading }] = useCreateBlogMutation();

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;
    const isPublished = action === "publish";
    setLoadingAction(action);

    if (!selectedCategory) {
      setErrors((prev) => ({ ...prev, category: "Please select a category" }));
      setTimeout(() => setErrors((prev) => ({ ...prev, category: "" })), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("excerpt", formData.excerpt);
      form.append("content", formData.content);
      form.append("is_public", isPublished);
      form.append("image", thumbnailFile);
      form.append("category", selectedCategory);

      const res = await createBlog(form).unwrap();
      console.log(res);

      setSuccessMessage(
        isPublished
          ? " Blog published successfully!"
          : " Draft saved successfully!",
      );
      resetForm();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Something went wrong. Please try again.",
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, form: "" })), 4000);
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setThumbnailFile(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    setSelectedCategory("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded shadow-xl overflow-hidden transition-all duration-300">
          <div className="bg-linear-to-r from-yellow-400 to-yellow-500 px-6 py-5 sm:px-8">
            <h1 className="text-xl sm:text-3xl font-semibold text-black tracking-tight">
              Create New Blog
            </h1>
            <p className="text-black text-sm mt-1">
              Share your stories with the world
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none ${
                  errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter an engaging title"
                required
              />
            </div>

            <TextArea
              label="Excerpt"
              name="excerpt"
              errors={errors}
              value={formData.excerpt}
              handleChange={handleChange}
            />

            <TextArea
              label="Content"
              name="content"
              errors={errors}
              value={formData.content}
              handleChange={handleChange}
            />

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex-1 w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <RiUploadCloud2Line className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
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
                        if (thumbnailPreview)
                          URL.revokeObjectURL(thumbnailPreview);
                        setThumbnailPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                    >
                      <RxCross2 />
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
                    {categories &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-5 py-2.5 rounded-md transition"
                >
                  + New Category
                </button>
              </div>

              {categories && categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.slice(0, 5).map((cat) => (
                    <div
                      key={cat.id}
                      className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <span>{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {categories && categories.length > 5 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="items-center px-3 py-1 my-1 text-sm hover:underline cursor-pointer"
                >
                  See more
                </button>
              )}
            </div>

            {successMessage && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg flex justify-between items-center animate-fadeIn">
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  {successMessage}
                </span>
                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <RxCross2 />
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                name="action"
                value="publish"
                disabled={loadingAction === "publish"}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition duration-200 transform focus:outline-none focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {loadingAction === "publish" ? "Loading..." : "Publish"}
              </button>

              <button
                type="submit"
                name="action"
                value="draft"
                disabled={loadingAction === "draft"}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200 transform focus:outline-none focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {loadingAction === "draft"
                  ? "Saving Draft..."
                  : "Save as Draft"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <CategoryModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default CreateBlog;
