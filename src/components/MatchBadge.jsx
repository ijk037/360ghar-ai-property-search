function MatchBadge({ property, filters }) {
  if (!filters) return null;

  const matches = [];

  if (
    filters.amenities?.includes("sunlight") &&
    property.facing?.toLowerCase().includes("east")
  ) {
    matches.push("☀️ Great Natural Light");
  }

  if (
    filters.amenities?.includes("school nearby") &&
    property.amenities?.includes("school nearby")
  ) {
    matches.push("🏫 Near School");
  }

  if (
    filters.amenities?.includes("park") &&
    property.amenities?.includes("park")
  ) {
    matches.push("🌳 Park Nearby");
  }

  if (
    filters.amenities?.includes("metro") &&
    property.amenities?.includes("metro")
  ) {
    matches.push("🚇 Metro Access");
  }

  if (matches.length === 0) {
    matches.push("✅ Matches Your Search");
  }

  return (
    <div className="match-badge">
      {matches.join(" · ")}
    </div>
  );
}

export default MatchBadge;