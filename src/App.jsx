import { useState } from "react";
import properties from "./data/properties";
import { parseQuery } from "./utils/openrouter";

import SearchBar, {
  FilterChips
} from "./components/SearchBar";

import "./App.css";
import PropertyCard from "./components/PropertyCard";
import PropertyModal from "./components/PropertyModal";
import FollowUpQuestion
  from "./components/FollowUpQuestion";

import {
  generateFollowUpQuestion
} from "./utils/openrouter";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(properties);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [followUp, setFollowUp] =
    useState("");

  function filterProperties(properties, filters) {
    return properties.filter((p) => {
      if (filters.bhk && p.bhk !== filters.bhk) return false;

      if (
        filters.maxPrice &&
        p.price > filters.maxPrice * 100000
      )
        return false;

      if (
        filters.minPrice &&
        p.price < filters.minPrice * 100000
      )
        return false;

      if (
        filters.location &&
        !p.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      )
        return false;

      return true;
    });
  }

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const parsedFilters = await parseQuery(query);

      setFilters(parsedFilters);

      const filtered = filterProperties(
        properties,
        parsedFilters
      );
      
      const ranked = filtered.sort((a, b) => {
        const scoreA = a.amenities.filter(
          amenity =>
            parsedFilters.amenities?.includes(amenity)
        ).length;
        const scoreB = b.amenities.filter(
          amenity =>
            parsedFilters.amenities?.includes(amenity)
        ).length;
        
        return scoreB - scoreA;
      });
      
      setResults(ranked);

      const followUpQuestion =
        await generateFollowUpQuestion(
          parsedFilters,
          ranked
        );
      console.log("FOLLOW UP:", followUpQuestion);
      setFollowUp(followUpQuestion);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="app">

      <h1 className="title">
        🏠 360 Ghar AI Property Search
      </h1>

      <p className="subtitle">
        Describe your ideal property in natural language
      </p>

      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        loading={loading}
      />
      
      <FilterChips filters={filters} />

      <FollowUpQuestion
        question={followUp}
      />

      {loading && (
        <div className="loading">
          Searching properties...
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="empty-state">
          No matching properties found.
          Try increasing your budget or removing some filters.
        </div>
      )}

      <hr />

      <h3>Results: {results.length}</h3>

      <div className="property-grid">
        {results.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            filters={filters}
            onClick={(property) =>
              setSelectedProperty(property)
            }
          />
        ))}
      </div>
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          query={query}
          onClose={() =>
            setSelectedProperty(null)
          }
        />
      )}
    </div>
  );
}

export default App;
