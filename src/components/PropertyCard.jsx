import MatchBadge from "./MatchBadge";

function PropertyCard({
  property,
  filters,
  onClick
}) {
  return (
    <div
      className="property-card"
      onClick={() => onClick(property)}
    >
      <img
        src={property.image}
        alt={property.title}
        className="property-image"
      />

      <div className="property-content">

        <h3>{property.title}</h3>

        <p>
          {property.bhk} BHK • {property.area} sq ft
        </p>

        <p>{property.location}</p>

        <h2>{property.priceLabel}</h2>

        <MatchBadge
          property={property}
          filters={filters}
        />

      </div>
    </div>
  );
}

export default PropertyCard;