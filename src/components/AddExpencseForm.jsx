import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { groupMembersState } from '../state/groupMembers';
import { expensesState } from '../state/expenses';
import styled from 'styled-components';

export const AddExpenseForm = () => {
  const members = useRecoilValue(groupMembersState);
  const setExpenses = useSetRecoilState(expensesState);

  const today = new Date();
  const [date, setDate] = useState(
    [today.getFullYear(), today.getMonth() + 1, today.getDate()].join('-')
  );
  const [desc, setDesc] = useState('');
  const [isDescValid, setIsDescValid] = useState(false);
  const [isPayerValid, setIsPayerValid] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [amount, setAmount] = useState(0);
  const [payer, setPayer] = useState('');
  const [validated, setValidated] = useState(false);

  const checkFormValidity = () => {
    const descValid = desc.length > 0;
    const amountValid = amount > 0;
    const payerValid = payer !== '';

    setIsDescValid(descValid);
    setIsAmountValid(amountValid);
    setIsPayerValid(payerValid);

    return descValid && amountValid && payerValid;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (checkFormValidity()) {
      const newExpense = {
        date,
        desc,
        amount,
        payer,
      };
      setExpenses((expenses) => [...expenses, newExpense]);
    }
    setValidated(true);
  };
  return (
    <StyledWrapper>
      <Form noValidate onSubmit={handleSubmit}>
        <StyledTitle>1. 비용 추가하기</StyledTitle>
        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type="date"
                placeholder="결제한 날짜를 선택해 주세요."
                onChange={(e) => setDate(e.target.value)}
              />
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type="text"
                placeholder="비용에 대한 설명을 입력해 주세요."
                value={desc}
                isValid={isDescValid}
                isInvalid={!isDescValid && validated}
                onChange={({ target }) => setDesc(target.value)}
              />
              <Form.Control.Feedback type="invalid" data-valid={isDescValid}>
                비용 내용을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Control
                type="number"
                placeholder="비용은 얼마였나요?"
                value={amount}
                isValid={isAmountValid}
                isInvalid={!isAmountValid && validated}
                onChange={({ target }) => setAmount(target.value)}
              />
              <Form.Control.Feedback type="invalid" data-valid={isAmountValid}>
                1원 이상의 금액을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Select
                isValid={isPayerValid}
                isInvalid={!isPayerValid && validated}
                defaultValue=""
                className="form-control"
                onChange={({ target }) => setPayer(target.value)}
              >
                <option disabled value="">
                  누가 결제 했나요?
                </option>
                {members.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" data-valid={isPayerValid}>
                결제자를 선택해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <StyledSubmitButton>추가하기</StyledSubmitButton>
          </Col>
        </Row>
      </Form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  padding: 40px;
  background-color: #683ba1;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;

  input,
  select {
    background: #59359a;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    border: 0;
    color: #f8f9fa;
    height: 40px;

    &:focus {
      color: #f8f9fa;
      background: #59359a;
      filter: brightness(80%);
    }

    &::placeholder {
      color: #f8f9fa;
    }
  }
`;

export const StyledTitle = styled.h3`
  color: #fffbfb;
  text-align: center;
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
  letter-spacing: 0.25px;
  margin-bottom: 15px;
`;

const StyledSubmitButton = styled(Button).attrs({ type: 'submit' })`
  width: 100%;
  height: 60px;
  padding: 16px 32px;
  border-radius: 8px;
  border: none;
  background-color: #e2d9f3;
  color: #59359a;
  margin-top: 18px;

  &:hover,
  &:focus {
    background-color: #e2d9f3;
    filter: rgba(0, 0, 0, 0.3);
  }
`;
