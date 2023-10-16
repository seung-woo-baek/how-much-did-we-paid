import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import { OverlayWrapper } from './OverlayWrapper';

export const CenteredOverlayForm = ({ children }) => {
  return (
    <CenterlizedContainer>
      <StyledHeader>어제 얼마 나왔어?</StyledHeader>
      <OverlayWrapper>{children}</OverlayWrapper>
    </CenterlizedContainer>
  );
};

const StyledHeader = styled.h1`
  font-weight: 300;
  letter-spacing: 10px;
`;

const CenterlizedContainer = styled(Container)`
  width: 50vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
`;
