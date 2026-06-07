import { useState } from "react";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  height: 68px;
  background: ${p => p.theme.colors.white};
  border-bottom: 1px solid ${p => p.theme.colors.neutral300};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0,0,0,0.05);
`;

const Logo = styled.button`
  font-size: 22px;
  font-weight: 700;
  color: ${p => p.theme.colors.neutral900};
  letter-spacing: -0.5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    color: ${p => p.theme.colors.saffron};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavBtn = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.theme.colors.neutral700};
  border-radius: ${p => p.theme.radius.md};
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${p => p.theme.colors.neutral100};
    color: ${p => p.theme.colors.neutral900};
  }
`;

const CTABtn = styled.button`
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${p => p.theme.colors.saffron};
  border-radius: ${p => p.theme.radius.md};
  transition: background 0.2s;
  margin-left: 8px;

  &:hover {
    background: ${p => p.theme.colors.saffronDark};
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoModal = styled.div`
  background: white;
  border-radius: ${p => p.theme.radius.xxl};
  padding: 36px;
  width: 440px;
  max-width: 90vw;
  text-align: center;
  box-shadow: ${p => p.theme.shadows.modal};
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.theme.colors.neutral900};
  margin-bottom: 12px;
`;

const ModalText = styled.p`
  font-size: 15px;
  color: ${p => p.theme.colors.neutral500};
  line-height: 1.6;
  margin-bottom: 24px;
`;

const CloseModalBtn = styled.button`
  padding: 10px 28px;
  background: ${p => p.theme.colors.saffron};
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: ${p => p.theme.radius.md};
  &:hover { background: ${p => p.theme.colors.saffronDark}; }
`;

export default function NavBar() {
  const [modal, setModal] = useState(null); // null | 'about' | 'coming-soon'

  const scrollTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Nav>
        <Logo onClick={() => scrollTo(".hero-section")}>
          <span>360 </span>Ghar
        </Logo>

        <NavLinks>
          <NavBtn onClick={() => scrollTo(".hero-section")}>Search</NavBtn>
          <NavBtn onClick={() => scrollTo(".results-section")}>Properties</NavBtn>
          <NavBtn onClick={() => setModal("coming-soon")}>Rent</NavBtn>
          <NavBtn onClick={() => setModal("coming-soon")}>Projects</NavBtn>
          <CTABtn onClick={() => setModal("about")}>About 360 Ghar</CTABtn>
        </NavLinks>
      </Nav>

      {modal === "about" && (
        <ModalBackdrop onClick={() => setModal(null)}>
          <InfoModal onClick={e => e.stopPropagation()}>
            <ModalTitle>About 360 Ghar</ModalTitle>
            <ModalText>
              360 Ghar is India's first AI and VR-powered real estate platform, focused on verified 360 property walkthroughs in Gurgaon and NCR.
              <br /><br />
              Just describe what you're looking for in plain English — our AI understands you and surfaces the most relevant properties instantly.
            </ModalText>
            <CloseModalBtn onClick={() => setModal(null)}>Got it</CloseModalBtn>
          </InfoModal>
        </ModalBackdrop>
      )}

      {modal === "coming-soon" && (
        <ModalBackdrop onClick={() => setModal(null)}>
          <InfoModal onClick={e => e.stopPropagation()}>
            <ModalTitle>Coming Soon 🚀</ModalTitle>
            <ModalText>
              This section is under development. We're working on bringing you
              the best rental and project listings in Gurgaon and NCR.
              <br /><br />
              Stay tuned!
            </ModalText>
            <CloseModalBtn onClick={() => setModal(null)}>Got it</CloseModalBtn>
          </InfoModal>
        </ModalBackdrop>
      )}
    </>
  );
}
