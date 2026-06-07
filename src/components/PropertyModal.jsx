import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { generateSummary } from "../utils/openrouter";

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${p => p.theme.colors.overlayDark};
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  padding: 20px;
`;

const ModalBox = styled.div`
  width: 560px;
  max-width: 100%;
  max-height: 90vh;
  background: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radius.xxl};
  box-shadow: ${p => p.theme.shadows.modal};
  overflow-y: auto;
  overflow-x: hidden;
  animation: ${slideUp} 0.25s ease;

  /* Hide scrollbar but keep scroll */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ModalImage = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #C9D6E3, #A8BBC8);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Badge360 = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${p => p.theme.colors.neutral900};
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: ${p => p.theme.radius.sm};
  letter-spacing: 0.5px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const ModalBody = styled.div`
  padding: ${p => p.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.lg};
`;

const PropertyTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${p => p.theme.colors.neutral900};
  margin-bottom: 4px;
`;

const PropertyMeta = styled.p`
  font-size: 15px;
  color: ${p => p.theme.colors.neutral500};
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  padding: ${p => p.theme.spacing.lg} 0;
  border-top: 1px solid ${p => p.theme.colors.neutral300};
  border-bottom: 1px solid ${p => p.theme.colors.neutral300};
`;

const StatBlock = styled.div`
  text-align: center;

  .value {
    display: block;
    font-size: 22px;
    font-weight: 700;
    color: ${p => p.theme.colors.neutral900};
  }
  .label {
    font-size: 12px;
    color: ${p => p.theme.colors.neutral500};
    margin-top: 2px;
  }
`;

const SectionLabel = styled.p`
  font-size: ${p => p.theme.fonts.labelCaps.size};
  font-weight: ${p => p.theme.fonts.labelCaps.weight};
  letter-spacing: ${p => p.theme.fonts.labelCaps.letterSpacing};
  text-transform: uppercase;
  color: ${p => p.theme.colors.neutral500};
  margin-bottom: 10px;
`;

const SkeletonLine = styled.div`
  height: 14px;
  width: ${p => p.width || "100%"};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  margin-bottom: 8px;
`;

const SummaryBox = styled.div`
  background: ${p => p.theme.colors.neutral100};
  border-radius: ${p => p.theme.radius.md};
  border-left: 3px solid ${p => p.theme.colors.saffron};
  padding: ${p => p.theme.spacing.lg};
  font-size: 15px;
  line-height: 1.65;
  color: ${p => p.theme.colors.neutral700};
`;

const AmenitiesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AmenityTag = styled.span`
  background: ${p => p.theme.colors.neutral100};
  color: ${p => p.theme.colors.neutral700};
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: ${p => p.theme.radius.sm};
  border: 1px solid ${p => p.theme.colors.neutral300};
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${p => p.theme.spacing.md};
`;

const PrimaryBtn = styled.button`
  flex: 1;
  height: 48px;
  background: ${p => p.theme.colors.saffron};
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: ${p => p.theme.radius.md};
  transition: background 0.2s, transform 0.1s;

  &:hover  { background: ${p => p.theme.colors.saffronDark}; }
  &:active { transform: scale(0.98); }
`;

const SecondaryBtn = styled.button`
  flex: 1;
  height: 48px;
  border: 1.5px solid ${p => p.theme.colors.saffron};
  color: ${p => p.theme.colors.saffron};
  font-weight: 600;
  font-size: 14px;
  border-radius: ${p => p.theme.radius.md};
  background: transparent;
  transition: background 0.2s;

  &:hover { background: ${p => p.theme.colors.saffronLight}; }
`;

const SavedToast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: ${p => p.theme.colors.neutral900};
  color: white;
  padding: 12px 24px;
  border-radius: ${p => p.theme.radius.pill};
  font-size: 14px;
  font-weight: 500;
  z-index: 500;
  animation: ${fadeIn} 0.2s ease;
`;

export default function PropertyModal({ property, userQuery, onClose }) {
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(false);

  // Live AI summary call when modal opens
  useEffect(() => {
    setSummaryLoading(true);
    setSummary("");

    generateSummary(property, userQuery || "a good property in Gurgaon")
      .then(text => {
        setSummary(text);
        setSummaryLoading(false);
      })
      .catch(() => {
        setSummary(
          `This ${property.bhk}BHK in ${property.location} is a strong match — it fits your budget at ${property.priceLabel}, offers ${property.area} sq ft of space, and includes the amenities you care about.`
        );
        setSummaryLoading(false);
      });
  }, [property.id]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    setSaved(true);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleVisit = () => {
    // In a real app this would open a booking form
    // For the prototype, show a nice toast
    setToast("visit");
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <>
      <Backdrop onClick={onClose}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <ModalImage>
            <img src={property.image} alt={property.title} />
            <Badge360>360 Tour</Badge360>
            <CloseBtn onClick={onClose}>✕</CloseBtn>
          </ModalImage>

          <ModalBody>
            <div>
              <PropertyTitle>{property.title}</PropertyTitle>
              <PropertyMeta>{property.priceLabel} · {property.area} sq ft · {property.location}</PropertyMeta>
            </div>

            <StatsRow>
              <StatBlock>
                <span className="value">{property.bhk}</span>
                <span className="label">BHK</span>
              </StatBlock>
              <StatBlock>
                <span className="value">{property.floor}<sup style={{fontSize:'13px'}}>th</sup></span>
                <span className="label">Floor</span>
              </StatBlock>
              <StatBlock>
                <span className="value">{property.facing}</span>
                <span className="label">Facing</span>
              </StatBlock>
              <StatBlock>
                <span className="value">{property.totalFloors}</span>
                <span className="label">Total Floors</span>
              </StatBlock>
            </StatsRow>

            <div>
              <SectionLabel>Amenities</SectionLabel>
              <AmenitiesRow>
                {property.amenities.map(a => (
                  <AmenityTag key={a}>{a}</AmenityTag>
                ))}
                {property.tags.map(t => (
                  <AmenityTag key={t}>{t}</AmenityTag>
                ))}
              </AmenitiesRow>
            </div>

            <div>
              <SectionLabel>Why this matches your search</SectionLabel>
              <SummaryBox>
                {summaryLoading ? (
                  <>
                    <SkeletonLine width="92%" />
                    <SkeletonLine width="78%" />
                    <SkeletonLine width="63%" />
                  </>
                ) : summary}
              </SummaryBox>
            </div>

            <ActionRow>
              <PrimaryBtn onClick={handleVisit}>📅 Schedule a Visit</PrimaryBtn>
              <SecondaryBtn onClick={handleSave}>
                {saved ? "✓ Saved" : "♡ Save Property"}
              </SecondaryBtn>
            </ActionRow>
          </ModalBody>
        </ModalBox>
      </Backdrop>

      {toast === true && <SavedToast>✓ Property saved to your list</SavedToast>}
      {toast === "visit" && <SavedToast>📅 Visit request noted — team will reach out!</SavedToast>}
    </>
  );
}
