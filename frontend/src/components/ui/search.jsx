"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
    </form>
  );
};

export default Search;
