import styled from 'styled-components';

export const OverlayWrapper = ({ children, padding, minHeight }) => {
  return (
    <StyledContainer padding={padding} minHeight={minHeight}>
      {children}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding: ${(props) => props.padding || '2vw'};
  @media screen and (max-width: 600px) {
    padding: 6vw;
  }
  border-radius: 15px;
  background-color: #fcfeff;
  filter: drop-shadow(5px 4px 6px rgba(0, 0, 0, 0.25));
  min-height: ${(props) => props.minHeight || '0'};
`;
