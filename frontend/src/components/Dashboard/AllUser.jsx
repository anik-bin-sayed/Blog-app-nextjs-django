import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/services/user/userApi";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import ComponentLoader from "../Loader/ComponentLoader";

const AllUser = () => {
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetUsersQuery({
    search,
    page,
  });

  const [updateUser] = useUpdateUserMutation();

  const users = data?.results || [];

  const handleToggle = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await updateUser({
        id,
        data: { is_banned: newStatus },
      }).unwrap();
    } catch (err) {
      console.log("Update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <ComponentLoader />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-5 text-sm text-rose-700">
        Error loading users: {error?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-[#fffdf9] p-4 sm:flex-row">
        <div className="relative w-full sm:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="block w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3 pl-10 pr-10 text-sm text-stone-800 placeholder:text-stone-400
                   focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10
                   transition-all duration-200 ease-out
                   hover:border-gray-300 hover:shadow-sm outline-0"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span className="rounded-full bg-[#faf7f0] px-3 py-1.5">
            Search users
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf9] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-[#faf7f0]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Banned
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Role
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 bg-white">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-[#faf7f0]">
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      <div>{user.full_name || user.username}</div>
                      {user.full_name && (
                        <div className="text-xs text-stone-400">
                          @{user.username}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-500">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${user.is_banned ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                        <input
                          type="checkbox"
                          checked={user.is_banned}
                          disabled={updatingId === user.id}
                          onChange={(e) =>
                            handleToggle(user.id, e.target.checked)
                          }
                          className="accent-amber-800"
                        />
                        {user.is_banned ? "Banned" : "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-500">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium capitalize text-amber-900">
                        {user.role || "User"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-sm text-stone-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!data?.previous}
          className="rounded-full border border-stone-200 bg-[#fffdf9] px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-amber-50 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-stone-500">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.next}
          className="rounded-full border border-stone-200 bg-[#fffdf9] px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-amber-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUser;
