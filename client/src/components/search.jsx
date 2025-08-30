import React, { useEffect, useState, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useLocation();
  const searchText = searchParams.search?.slice(3) || "";

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
    // Set the search value from URL when component mounts or URL changes
    setSearchValue(searchText);
  }, [location, searchText]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSearch = useCallback(async () => {
    if (searchValue.trim()) {
      setIsSearching(true);
      const url = `/search?q=${encodeURIComponent(searchValue.trim())}`;
      try {
        await navigate(url);
      } finally {
        setIsSearching(false);
      }
    } else {
      console.log("Search value is empty, not navigating");
    }
  }, [searchValue, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-yellow-400 ">
      <div>
        {isMobile && isSearchPage ? (
          <div className="flex items-center gap-2">
            <Link
              to={"/"}
              className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-yellow-400 bg-white rounded-full shadow-md"
            >
              <FaArrowLeft size={20} />
            </Link>
            <button
              className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-yellow-400 bg-white rounded-full shadow-md"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              ) : (
                <IoSearch size={18} />
              )}
            </button>
          </div>
        ) : (
          <button
            className="flex justify-center items-center h-full p-3 group-focus-within:text-yellow-400"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
            ) : (
              <IoSearch size={22} />
            )}
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={() => navigate("/search")}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full relative">
            <input
              type="text"
              placeholder="Search for atta dal and more."
              autoFocus
              value={searchValue}
              className="bg-transparent w-full h-full outline-none"
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
