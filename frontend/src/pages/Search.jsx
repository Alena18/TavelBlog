import { useState } from "react";
import { FiSearch } from "react-icons/fi";

function Search({ data, onFilter, sortBy }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilter(term, sortOption);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    applyFilter(searchTerm, option);
  };

  const applyFilter = (term, sortOpt) => {
    let filtered = [...data];
    if (term) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.tags?.toLowerCase().includes(term)
      );
    }

    if (sortOpt === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOpt === "startDate") {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    onFilter(filtered);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchTerm}
          onChange={handleSearch} // <-- use handleSearch
          className="search-input"
        />
        <FiSearch className="search-icon" />
      </div>

      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="name">Name / Title</option>
          <option value="startDate">Start Date</option>
        </select>
      </div>
    </div>
  );
}

export default Search;
