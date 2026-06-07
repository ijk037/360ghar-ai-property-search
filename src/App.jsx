import { useState } from "react";
import styled from "styled-components";

import properties from "./data/properties";

import SearchBar, { FilterChips } from "./components/SearchBar";
import PropertyCard from "./components/PropertyCard";
import PropertyModal from "./components/PropertyModal";
import FollowUpQuestion from "./components/FollowUpQuestion";
import NavBar from "./components/NavBar";
import { PropertyCardSkeleton } from "./components/loading";
import {
  parseQuery,
  generateFollowUpQuestion
} from "./utils/openrouter";

// ── Layout ────────────────────────────────────────────────

const AppWrapper = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.colors.neutral100};
`;

const HeroSection = styled.section`
  background: linear-gradient(180deg, #FFFBF5 0%, #FFFFFF 100%);
  padding: 72px 80px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${p => p.theme.spacing.xl};
`;

const AIPill = styled.span`
  background: ${p => p.theme.colors.saffronLight};
  color: ${p => p.theme.colors.saffron};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: ${p => p.theme.radius.pill};
`;

const Heading = styled.h1`
  font-size: 52px;
  font-weight: 800;
  line-height: 1.1;
  text-align: center;
  color: ${p => p.theme.colors.neutral900};
  letter-spacing: -1px;

  span { color: ${p => p.theme.colors.saffron}; }
`;

const Sub = styled.p`
  font-size: 17px;
  color: ${p => p.theme.colors.neutral500};
  text-align: center;
`;

// ── Results ───────────────────────────────────────────────

const ResultsSection = styled.section`
  padding: 52px 80px;
  background: ${p => p.theme.colors.neutral100};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${p => p.theme.spacing.xl};
`;

const ResultsCount = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.theme.colors.neutral900};
`;

const ResultsBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.theme.colors.neutral500};
  background: ${p => p.theme.colors.white};
  padding: 4px 12px;
  border-radius: ${p => p.theme.radius.pill};
  border: 1px solid ${p => p.theme.colors.neutral300};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 340px));
  gap: 28px 24px;
  justify-content: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  color: ${p => p.theme.colors.neutral500};

  .icon { font-size: 48px; margin-bottom: 16px; }
  h3 { font-size: 18px; font-weight: 600; color: ${p => p.theme.colors.neutral700}; margin-bottom: 8px; }
  p  { font-size: 14px; }
`;

const ErrorBanner = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  border-radius: ${p => p.theme.radius.md};
  padding: 12px 20px;
  font-size: 14px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

// ── Filter logic ──────────────────────────────────────────

function filterAndRank(allProperties, filters) {
  if (!filters) return allProperties;

  const filtered = allProperties.filter(p => {
    if (filters.bhk && p.bhk !== filters.bhk) return false;
    if (filters.maxPrice && p.price > filters.maxPrice * 100000) return false;
    if (filters.minPrice && p.price < filters.minPrice * 100000) return false;
    if (
      filters.location &&
      !p.location.toLowerCase().includes(filters.location.toLowerCase())
    ) return false;
    return true;
  });

  // Rank by amenity match count
  return [...filtered].sort((a, b) => {
    const scoreA = (filters.amenities || []).filter(am =>
      a.amenities.includes(am)
    ).length;
    const scoreB = (filters.amenities || []).filter(am =>
      b.amenities.includes(am)
    ).length;
    return scoreB - scoreA;
  });
}

// ── App ───────────────────────────────────────────────────

export default function App() {
  const [query, setQuery]                   = useState("");
  const [results, setResults]               = useState(properties);
  const [loading, setLoading]               = useState(false);
  const [filters, setFilters]               = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [followUp, setFollowUp]             = useState("");
  const [error, setError]                   = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Reset results when search box is cleared
  const handleQueryChange = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults(properties);
      setHasSearched(false);
    }
  };

const handleSearch = async () => {
  setLoading(true);
  setError("");
  setHasSearched(true);

  try {
    const q = query.toLowerCase().trim();

    let filtered = [...properties];

    // ---------- BHK ----------
    if (
      q.includes("1bhk") ||
      q.includes("1 bhk") ||
      q.includes("one bhk")
    ) {
      filtered = filtered.filter((p) => p.bhk === 1);
    }

    if (
      q.includes("2bhk") ||
      q.includes("2 bhk") ||
      q.includes("two bhk")
    ) {
      filtered = filtered.filter((p) => p.bhk === 2);
    }

    if (
      q.includes("3bhk") ||
      q.includes("3 bhk") ||
      q.includes("three bhk")
    ) {
      filtered = filtered.filter((p) => p.bhk === 3);
    }

    // ---------- Sector ----------
    const sectorMatch = q.match(/sector\s*(\d+)/i);

    if (sectorMatch) {
      const sector = sectorMatch[1];

      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(`sector ${sector}`)
      );
    }

    setResults(filtered);

    // Optional AI follow-up
    try {
      const parsed = await parseQuery(query);

      setFilters(parsed);

      const followQuestion =
        await generateFollowUpQuestion(parsed, filtered);

      setFollowUp(followQuestion);
    } catch {
      setFilters(null);
      setFollowUp("");
    }
  } catch (err) {
    console.error(err);
    setError("Search failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <AppWrapper>
      <NavBar />

      <HeroSection className="hero-section">
        <AIPill>✦ AI-Powered Search</AIPill>

        <Heading>
          Find your perfect home,<br />
          <span>just by describing it</span>
        </Heading>

        <Sub>Powered by AI — no forms, no filters, just plain English</Sub>

        <SearchBar
        query={query}
        setQuery={handleQueryChange}
        handleSearch={handleSearch}
        loading={loading}
        />

        <FilterChips filters={filters} />

        {error && <ErrorBanner>⚠️ {error}</ErrorBanner>}
      </HeroSection>

      <ResultsSection className="results-section">
        <ResultsHeader>
          <ResultsCount>
            {loading
              ? "Searching…"
              : hasSearched
                ? `${results.length} ${results.length === 1 ? "property" : "properties"} found`
                : `${results.length} properties in Gurgaon`}
          </ResultsCount>
          {hasSearched && !loading && (
            <ResultsBadge>
              {filters?.location || "All Sectors"} · {filters?.bhk ? `${filters.bhk} BHK` : "All BHK"}
            </ResultsBadge>
          )}
        </ResultsHeader>

        <CardsGrid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            : results.length > 0
              ? results.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    query={query}
                    onClick={setSelectedProperty}
                  />
                ))
              : (
                <EmptyState style={{ gridColumn: "1 / -1" }}>
                  <div className="icon">🏠</div>
                  <h3>No properties found</h3>
                  <p>Try broadening your search — adjust the BHK type, price range, or location.</p>
                </EmptyState>
              )
          }
        </CardsGrid>

        <FollowUpQuestion question={followUp} />
      </ResultsSection>

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          userQuery={query}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </AppWrapper>
  );
}
