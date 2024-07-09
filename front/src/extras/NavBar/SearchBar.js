import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({
  searchRef,
  searchQuery,
  handleSearchChange,
  handleSearchFocus,
  handleSearchBlur,
  handleSearchSubmit,
  searchResults,
  handleResultClick,
}) => {
  return (
    <div className="hidden lg:flex items-center relative z-40">
      <form onSubmit={handleSearchSubmit}>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="px-4 py-2 rounded-l-lg focus:outline-none z-40"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded-r-lg"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-40 search-results">
          {searchResults.map((result) => (
            <div
              key={result._id}
              className="p-2 hover:bg-gray-300 cursor-pointer flex items-center"
              onClick={() => handleResultClick(result._id)}
            >
              <img
                src={`http://localhost:8000/images/products/${result.coverImage}`}
                alt={result.name}
                className="w-12 h-12 object-cover mr-2"
              />
              <span>{result.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
