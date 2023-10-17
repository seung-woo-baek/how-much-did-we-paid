import { Container, Button, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { OverlayWrapper } from './OverlayWrapper';
import { ServiceLogo } from './ServiceLogo';

export const CenteredOverlayForm = ({
  title,
  validated,
  children,
  handleSubmit,
}) => {
  return (
    <StyledCenterlizedContainer>
      <ServiceLogo />
      <OverlayWrapper>
        <Container>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <StyledCenteralizedContent>
              <Row className="align-items-start">
                <StyledTitle>{title}</StyledTitle>
              </Row>
              <Row className="align-items-center">{children}</Row>
              <Row className="align-items-end">
                <StyledSubmitButton type="submit">저장</StyledSubmitButton>
              </Row>
            </StyledCenteralizedContent>
          </Form>
        </Container>
      </OverlayWrapper>
    </StyledCenterlizedContainer>
  );
};

const StyledCenterlizedContainer = styled(Container)`
  width: 50vw;
  @media (max-width: 500px) {
    width: 80vw;
  }
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
`;

const StyledTitle = styled.h2`
  font-weight: 700;
  line-height: 35px;
  text-align: right;
  overflow-wrap: break-word;
  word-break: keep-all;
`;

const StyledSubmitButton = styled(Button).attrs({ type: 'submit' })`
  width: 60%;
  height: 50px;
  margin: 0 auto;
  background-color: #6610f2;
  border-radius: 8px;
  border: none;

  &:hover {
    background-color: #6610f2;
    filter: brightness(80%);
  }
`;

const StyledCenteralizedContent = styled(Row)`
  height: 60vh;
  justify-content: center;
  align-items: center;
`;
