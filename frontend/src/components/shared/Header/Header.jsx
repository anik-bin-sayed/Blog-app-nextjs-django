"use client";

import Logo from "@/components/ui/Logo";
import Search from "@/components/ui/search";
import React, { useState } from "react";
import { FaBars, FaSearch, FaTimes, FaUser } from "react-icons/fa";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden md:flex p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <FaUser className="h-5 w-5" />
            </button>
            <button className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <FaUser className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-3">
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
