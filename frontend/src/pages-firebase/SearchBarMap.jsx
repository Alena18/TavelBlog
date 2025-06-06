import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBarMap({
  search,
  setSearch,
  places,
  onPlaceSelect,
}) {
  const handleSearch = () => {
    console.log("Search icon clicked!", search);

    const matchedPlace = places.find(
      (p) => p.placename.toLowerCase() === search.toLowerCase()
    );

    if (matchedPlace && onPlaceSelect) {
      console.log("Matched:", matchedPlace);
      onPlaceSelect(matchedPlace);
    }
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          list="place-suggestions"
        />
        <div className="search-icon" onClick={handleSearch}>
          <FiSearch />
        </div>

        <datalist id="place-suggestions">
          {places.map((p) => (
            <option key={p.id} value={p.placename} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
