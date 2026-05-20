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
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        Error loading users: {error?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-300">
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
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded bg-white text-sm placeholder-gray-400
                   focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                   transition-all duration-200 ease-out
                   hover:border-gray-300 hover:shadow-sm outline-0"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="bg-gray-50 px-2 py-1 rounded-full">
            Search users
          </span>
        </div>
      </div>

      <div className="bg-white shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Banned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div>{user.full_name || user.username}</div>
                      {user.full_name && (
                        <div className="text-xs text-gray-400">
                          @{user.username}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex items-center text-xs font-semibold rounded-full ${
                          user.is_banned ? " text-green-800" : "text-red-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={user.is_banned}
                          disabled={updatingId === user.id}
                          onChange={(e) =>
                            handleToggle(user.id, e.target.checked)
                          }
                          className="mr-1"
                        />
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                        {user.role || "User"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!data?.previous}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.next}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUser;
