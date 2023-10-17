import { Col, Container, Row } from 'react-bootstrap';
import { AddExpenseForm } from './AddExpencseForm';
import { ExpenseTable } from './ExpenseTable';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { groupNameState } from '../state/groupName';
import { SettlementSummary } from './SettlementSummary';
import { ServiceLogo } from './shared/ServiceLogo';

export const ExpenseMain = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={5} md={4}>
          <LeftPane />
        </Col>
        <Col>
          <RightPane />
        </Col>
      </Row>
    </Container>
  );
};

const LeftPane = () => (
  <Container>
    <StyledGapRow>
      <Row>
        <ServiceLogo />
      </Row>
      <Row>
        <AddExpenseForm />
      </Row>
      <Row>
        <SettlementSummary />
      </Row>
    </StyledGapRow>
  </Container>
);

const RightPane = () => {
  const groupName = useRecoilValue(groupNameState);
  return (
    <StyledRightPaneWrapper>
      <Row>
        <StyledGroupName>{groupName}</StyledGroupName>
      </Row>
      <Row>
        <ExpenseTable />
      </Row>
    </StyledRightPaneWrapper>
  );
};

const StyledRightPaneWrapper = styled(Container)`
  padding: 5vh 2vw 2vh 2vw;

  @media screen and (max-width: 600px) {
    padding: 50px 25px;
  }
`;

const StyledGroupName = styled.h2`
  margin-bottom: 80px;
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  line-height: 48px;
  letter-spacing: 0.25px;
`;

const StyledGapRow = styled(Row)`
  gap: 3vh;
  padding-top: 4vh;
  justify-content: center;

  @media screen and (max-width: 600px) {
    padding-top: 30px;
  }
`;
