import React from "react";
import Image from "next/image";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import {
  useDeleteBlogsMutation,
  useToggleBlogStatusMutation,
} from "@/redux/services/blogs/blogApi";
import Link from "next/link";

const AdminBlogCard = ({ blog, onEdit }) => {
  const [deleteBlogs] = useDeleteBlogsMutation();
  const [toggleBlogStatus] = useToggleBlogStatusMutation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleBlogStatus(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlogs(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf9] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[1.65/1] w-full overflow-hidden bg-stone-200">
        <Link href={`/blogs/${blog.slug}`}>
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={false}
          />
        </Link>

        <div className="absolute top-3 right-3 z-10">
          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide shadow-md backdrop-blur-sm ${
              blog.is_public
                ? "bg-emerald-700/90 text-white"
                : "bg-stone-800/90 text-white"
            }`}
          >
            {blog.is_public ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="flex-1 p-5">
        <Link
          href={`/blogs/${blog.slug}`}
          className="line-clamp-2 font-serif text-xl font-semibold leading-snug text-stone-900 transition group-hover:text-amber-900 cursor-pointer"
        >
          {blog.title}
        </Link>
        <p className="mt-2 text-xs font-medium text-stone-500">
          {blog.category}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
          <CiTimer className="h-3.5 w-3.5 text-amber-800" />
          <span>{formatDate(blog.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-200 bg-[#faf7f0] px-5 py-3">
        <button
          onClick={() => handleToggleStatus(blog.id)}
          className={`text-xs font-medium px-2 py-1 rounded-full transition ${
            blog.is_public
            ? "text-stone-600 hover:bg-amber-100 hover:text-amber-950"
              : "text-emerald-800 hover:bg-emerald-50"
          }`}
        >
          {blog.is_public ? "→ Draft" : "→ Publish"}
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(blog)}
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 transition hover:text-amber-900"
          >
            <FaEdit size={14} /> Edit
          </button>

          <button
            onClick={() => handleDelete(blog.id)}
            className="flex items-center gap-1 text-xs font-semibold text-rose-700 transition hover:text-rose-900"
          >
            <FaTrashAlt size={14} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default AdminBlogCard;
