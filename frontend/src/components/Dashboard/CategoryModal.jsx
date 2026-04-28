"use client";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/services/blogs/blogApi";
import React, { useState } from "react";
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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold mb-4">Create New Category</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none mb-4"
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
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">All Category</h3>

          <div className="category border border-gray-200 rounded-xl p-3 max-h-80 overflow-y-auto">
            <div className="flex flex-wrap gap-3">
              {data &&
                data.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-gray-800 text-sm font-medium">
                      {cat.name}
                    </p>

                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
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

export default CategoryModal;
