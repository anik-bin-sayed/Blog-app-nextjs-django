"use client";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/services/blogs/blogApi";
import React, { useState, memo } from "react";
import AlertMessage from "../ui/AlertMessage";
import { RxCross2 } from "react-icons/rx";

const CategoryModal = ({ setIsModalOpen }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { data, refetch } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCategory({ name }).unwrap();
      setName("");
      setError("");
      refetch();
    } catch (err) {
      setError(err?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-[#fffdf9] p-6 shadow-2xl">
        <h3 className="mb-4 font-serif text-2xl text-stone-900">Create new category</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="mb-4 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
            autoFocus
          />

          <AlertMessage
            message={error}
            type="error"
            onClose={() => setError("")}
            autoDismiss={4000}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setName("");
              }}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h3 className="mb-3 font-serif text-xl text-stone-900">All categories</h3>

          <div className="category max-h-80 overflow-y-auto rounded-xl border border-stone-200 p-3">
            <div className="flex flex-wrap gap-3">
              {data &&
                data.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-3 py-1.5 shadow-sm transition hover:shadow-md"
                  >
                    <p className="text-sm font-medium text-stone-800">
                      {cat.name}
                    </p>

                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                    >
                      <RxCross2 className="text-sm" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryModal);
