function SearchBar({
  query,
  setQuery,
  handleSearch,
  loading
}) {
  return (
    <div className="search-container">

      <input
        className="search-input"
        type="text"
        value={query}
        placeholder="Try: 2BHK in Sector 50 under 80 lakhs with good sunlight near school"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="search-button"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

    </div>
  );
}

export default SearchBar;


export function FilterChips({ filters }) {

  if (!filters) return null;

  return (
    <div className="filter-chips">

      {filters.bhk && (
        <span className="chip">
          {filters.bhk} BHK
        </span>
      )}

      {filters.location && (
        <span className="chip">
          {filters.location}
        </span>
      )}

      {filters.maxPrice && (
        <span className="chip">
          Under ₹{filters.maxPrice}L
        </span>
      )}

      {filters.amenities?.map((item) => (
        <span
          key={item}
          className="chip"
        >
          {item}
        </span>
      ))}

    </div>
  );
}