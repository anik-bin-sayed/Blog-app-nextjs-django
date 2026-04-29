import React from "react";
import Image from "next/image";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { useDeleteBlogsMutation } from "@/redux/services/blogs/blogApi";

const AdminBlogCard = ({ blog, onEdit, onToggleStatus }) => {
  const [deleteBlogs] = useDeleteBlogsMutation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlogs(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />

        <div className="absolute top-3 right-3 z-10">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-md backdrop-blur-sm ${
              blog.is_public
                ? "bg-green-500/90 text-white"
                : "bg-amber-500/90 text-white"
            }`}
          >
            {blog.is_public ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <span className="font-medium">Category:</span> {blog.category}
        </p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <CiTimer className="w-3.5 h-3.5" />
          <span>{formatDate(blog.created_at)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/80 flex justify-between items-center">
        <button
          onClick={() => onToggleStatus(blog.id)}
          className={`text-xs font-medium px-2 py-1 rounded-full transition ${
            blog.is_public
              ? "text-amber-600 hover:bg-amber-50"
              : "text-green-600 hover:bg-green-50"
          }`}
        >
          {blog.is_public ? "→ Draft" : "→ Publish"}
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(blog)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition flex items-center gap-1"
          >
            <FaEdit size={14} /> Edit
          </button>

          <button
            onClick={() => handleDelete(blog.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center gap-1"
          >
            <FaTrashAlt size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogCard;
