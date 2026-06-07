import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const SkeletonCard = styled.div`
  width: 340px;
  background: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radius.xl};
  overflow: hidden;
  box-shadow: ${p => p.theme.shadows.card};
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

const SkeletonBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonLine = styled.div`
  height: 13px;
  width: ${p => p.width || "100%"};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

export function PropertyCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <SkeletonBody>
        <SkeletonLine width="65%" />
        <SkeletonLine width="45%" />
        <SkeletonLine width="80%" />
        <SkeletonLine width="55%" />
        <SkeletonLine width="70%" />
      </SkeletonBody>
    </SkeletonCard>
  );
}
