import styled, { keyframes } from "styled-components";

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${p => p.theme.spacing.xl};
  animation: ${fadeSlide} 0.3s ease;
`;

const Bubble = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${p => p.theme.spacing.md};
  background: ${p => p.theme.colors.white};
  border: 1.5px solid ${p => p.theme.colors.saffronLight};
  border-left: 3px solid ${p => p.theme.colors.saffron};
  border-radius: ${p => p.theme.radius.lg};
  padding: ${p => p.theme.spacing.lg};
  max-width: 640px;
  box-shadow: ${p => p.theme.shadows.card};
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${p => p.theme.colors.saffronLight};
  color: ${p => p.theme.colors.saffron};
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Label = styled.span`
  display: block;
  font-size: ${p => p.theme.fonts.labelCaps.size};
  font-weight: ${p => p.theme.fonts.labelCaps.weight};
  letter-spacing: ${p => p.theme.fonts.labelCaps.letterSpacing};
  text-transform: uppercase;
  color: ${p => p.theme.colors.saffron};
  margin-bottom: 4px;
`;

const Text = styled.p`
  font-size: ${p => p.theme.fonts.base.size};
  color: ${p => p.theme.colors.neutral700};
  line-height: ${p => p.theme.fonts.base.lineHeight};
`;

export default function FollowUpQuestion({ question }) {
  if (!question) return null;

  return (
    <Wrapper>
      <Bubble>
        <Avatar>AI</Avatar>
        <div>
          <Label>Follow-up</Label>
          <Text>💬 {question}</Text>
        </div>
      </Bubble>
    </Wrapper>
  );
}
