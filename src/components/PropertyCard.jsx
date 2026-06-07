import styled from 'styled-components';

const Card = styled.div`
  width: 340px;
  background: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radius.xl};
  box-shadow: ${p => p.theme.shadows.card};
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.25s, border-left 0.25s;
  border-left: 3px solid transparent;

  &:hover {
    box-shadow: ${p => p.theme.shadows.cardHover};
    transform: translateY(-4px);
    border-left-color: ${p => p.theme.colors.saffron};
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #C9D6E3, #A8BBC8);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Badge360 = styled.span`
  position: absolute;
  top: 12px; left: 12px;
  background: ${p => p.theme.colors.neutral900};
  color: white;
  font-size: ${p => p.theme.fonts.labelBold.size};
  font-weight: ${p => p.theme.fonts.labelBold.weight};
  padding: 4px 10px;
  border-radius: ${p => p.theme.radius.sm};
`;

const PriceOverlay = styled.span`
  position: absolute;
  bottom: 12px; left: 12px;
  background: rgba(0,0,0,0.55);
  color: white;
  font-size: ${p => p.theme.fonts.h3.size};
  font-weight: ${p => p.theme.fonts.h3.weight};
  padding: 4px 10px;
  border-radius: ${p => p.theme.radius.sm};
  backdrop-filter: blur(4px);
`;

const MatchScoreBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;

  padding: 6px 10px;

  border-radius: 999px;

  color: white;

  font-size: 12px;
  font-weight: 700;

  background: ${({ score }) =>
    score >= 90
      ? "#16A34A"
      : score >= 75
      ? "#F59E0B"
      : "#6B7280"};
`;

const Body = styled.div`
  padding: ${p => p.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.sm};
`;

const Title = styled.h3`
  font-size: ${p => p.theme.fonts.h3.size};
  font-weight: ${p => p.theme.fonts.h3.weight};
  color: ${p => p.theme.colors.neutral900};
`;

const Meta = styled.p`
  font-size: ${p => p.theme.fonts.small.size};
  color: ${p => p.theme.colors.neutral500};
`;

const TagsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${p => p.theme.colors.neutral100};
  color: ${p => p.theme.colors.neutral700};
  font-size: ${p => p.theme.fonts.small.size};
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
`;

const MatchBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${p => p.theme.colors.greenMatchLight};
  color: ${p => p.theme.colors.greenMatch};
  font-size: ${p => p.theme.fonts.labelBold.size};
  font-weight: ${p => p.theme.fonts.labelBold.weight};
  padding: 6px 10px;
  border-radius: ${p => p.theme.radius.sm};
`;

const CTARow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const ViewDetails = styled.button`
  font-size: ${p => p.theme.fonts.labelBold.size};
  font-weight: ${p => p.theme.fonts.labelBold.weight};
  color: ${p => p.theme.colors.saffron};
  &:hover { text-decoration: underline; }
`;

export default function PropertyCard({
  property,
  query,
  onClick
}) {

  let matchScore = 70;

  const q = query?.toLowerCase() || "";

  if (
    q.includes(`${property.bhk}bhk`) ||
    q.includes(`${property.bhk} bhk`)
  ) {
    matchScore += 15;
  }

  if (
    q &&
    property.location
      .toLowerCase()
      .includes(q)
  ) {
    matchScore += 10;
  }

  matchScore += Math.min(
    property.amenities.length,
    4
  );

  matchScore = Math.min(matchScore, 99);

  return (
    <Card
      onClick={() => onClick(property)}
    >
      <ImageArea>

        <img
          src={property.image}
          alt={property.title}
        />

        <Badge360>
          360 Tour
        </Badge360>

        <MatchScoreBadge
          score={matchScore}
        >
          {matchScore}% Match
        </MatchScoreBadge>

        <PriceOverlay>
          {property.priceLabel}
        </PriceOverlay>

      </ImageArea>

      <Body>

        <Title>
          {property.title}
        </Title>

        <Meta>
          {property.area} sq ft · {property.location}
        </Meta>

        <TagsRow>
          {property.tags.map(tag => (
            <Tag key={tag}>
              {tag}
            </Tag>
          ))}
        </TagsRow>

        {property.matchReason && (
          <MatchBadge>
            ⚡ {property.matchReason}
          </MatchBadge>
        )}

        <CTARow>
          <ViewDetails>
            View Details →
          </ViewDetails>

          <span
            style={{
              fontSize: "18px",
              color: "#D1D5DB",
              cursor: "pointer"
            }}
          >
            ♡
          </span>
        </CTARow>

      </Body>
    </Card>
  );
}