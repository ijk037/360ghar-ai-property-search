import styled, { css } from "styled-components";

const SearchBarWrapper = styled.div`
  width: 780px;
  max-width: 100%;
  height: 64px;
  background: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radius.lg};
  border: 1.5px solid ${p => p.theme.colors.neutral300};
  box-shadow: ${p => p.theme.shadows.searchBar};
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 20px;
  gap: ${p => p.theme.spacing.md};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: ${p => p.theme.colors.saffron};
    box-shadow: 0px 4px 32px rgba(232, 130, 26, 0.18);
  }
`;

const SearchIcon = styled.span`
  font-size: 18px;
  color: ${p => p.theme.colors.neutral500};
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  font-size: ${p => p.theme.fonts.large.size};
  color: ${p => p.theme.colors.neutral900};
  background: transparent;

  &::placeholder {
    color: ${p => p.theme.colors.neutral500};
  }
`;

const SearchButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background: ${p => p.theme.colors.saffron};
  color: white;
  font-size: ${p => p.theme.fonts.base.size};
  font-weight: 600;
  border-radius: ${p => p.theme.radius.md};
  white-space: nowrap;
  transition: background 0.2s, transform 0.1s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${p => p.theme.colors.saffronDark};
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// ── Filter chips ──────────────────────────────────────────
const ChipsRow = styled.div`
  display: flex;
  gap: ${p => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
  min-height: 32px;
`;

const chipBase = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: ${p => p.theme.radius.pill};
  font-size: ${p => p.theme.fonts.labelBold.size};
  font-weight: ${p => p.theme.fonts.labelBold.weight};
  line-height: 1;
`;

const SaffronChip = styled.span`
  ${chipBase};
  background: ${p => p.theme.colors.saffronLight};
  color: ${p => p.theme.colors.saffron};
  border: 1px solid rgba(232, 130, 26, 0.3);
`;

const BlueChip = styled.span`
  ${chipBase};
  background: #EFF6FF;
  color: ${p => p.theme.colors.blueInfo};
  border: 1px solid rgba(37, 99, 235, 0.2);
`;

const GreenChip = styled.span`
  ${chipBase};
  background: ${p => p.theme.colors.greenMatchLight};
  color: ${p => p.theme.colors.greenMatch};
  border: 1px solid rgba(22, 163, 74, 0.2);
`;

export default function SearchBar({ query, setQuery, handleSearch, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleSearch();
  };

  return (
    <SearchBarWrapper>
      <SearchIcon>🔍</SearchIcon>
      <Input
        type="text"
        value={query}
        placeholder="Try: 2BHK in Sector 50 under ₹80 lakhs with sunlight near school"
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <SearchButton onClick={handleSearch} disabled={loading}>
        {loading ? "Searching…" : "Search Properties"}
      </SearchButton>
    </SearchBarWrapper>
  );
}

export function FilterChips({ filters }) {
  if (!filters) return null;

  const hasAny =
    filters.bhk || filters.location || filters.maxPrice ||
    filters.minPrice || filters.amenities?.length;

  if (!hasAny) return null;

  return (
    <ChipsRow>
      {filters.bhk && <SaffronChip>🏠 {filters.bhk} BHK</SaffronChip>}
      {filters.location && <BlueChip>📍 {filters.location}</BlueChip>}
      {filters.maxPrice && <GreenChip>💰 Under ₹{filters.maxPrice}L</GreenChip>}
      {filters.minPrice && <GreenChip>💰 Above ₹{filters.minPrice}L</GreenChip>}
      {filters.amenities?.map(item => (
        <SaffronChip key={item}>✦ {item}</SaffronChip>
      ))}
    </ChipsRow>
  );
}
