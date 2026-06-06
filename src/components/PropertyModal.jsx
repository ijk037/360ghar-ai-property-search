import { useEffect, useState } from "react";
import { generateSummary } from "../utils/openrouter";

function PropertyModal({
  property,
  query,
  onClose
}) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const result = await generateSummary(
          property,
          query
        );

        setSummary(result);
      } catch (error) {
        console.error(error);

        setSummary(
          "Unable to generate summary."
        );
      }

      setLoading(false);
    }

    loadSummary();
  }, [property, query]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-button"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={property.image}
          alt={property.title}
          className="modal-image"
        />

        <h2>{property.title}</h2>

        <p>
          {property.area} sq ft •{" "}
          {property.location}
        </p>

        <p>{property.priceLabel}</p>

        <h3>
          Why this matches your search
        </h3>

        {loading ? (
          <p>Generating AI summary...</p>
        ) : (
          <p>{summary}</p>
        )}
      </div>
    </div>
  );
}

export default PropertyModal;