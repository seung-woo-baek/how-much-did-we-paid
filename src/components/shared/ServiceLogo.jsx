import styled from 'styled-components';

export const ServiceLogo = () => {
  return <StyledLogo>어제 얼마 나왔어?</StyledLogo>;
};

const StyledLogo = styled.h1`
  font-weight: 300;
  letter-spacing: 10px;
  color: slateblue;
  text-align: center;
  margin-bottom: 0.8em;
`;
