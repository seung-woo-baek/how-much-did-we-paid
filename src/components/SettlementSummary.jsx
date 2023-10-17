import { useRecoilValue } from 'recoil';
import { expensesState } from '../state/expenses';
import { groupMembersState } from '../state/groupMembers';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { StyledTitle } from './AddExpencseForm';
import { useRef } from 'react';
import { Download } from 'react-bootstrap-icons';
import { toPng } from 'html-to-image';

export const calculateMinimumTransaction = (
  expenses,
  members,
  amountPerPerson
) => {
  const minTransactions = [];
  if (!expenses || !members || !amountPerPerson || amountPerPerson === 0) {
    return minTransactions;
  }

  const membersToPay = {};
  members.forEach((member) => {
    membersToPay[member] = amountPerPerson;
  });

  expenses.forEach(({ payer, amount }) => {
    membersToPay[payer] -= amount;
  });

  const sortedMembersToPay = Object.keys(membersToPay)
    .map((member) => ({ member: member, amount: membersToPay[member] }))
    .sort((a, b) => a.amount - b.amount);

  var left = 0;
  var right = sortedMembersToPay.length - 1;
  while (left < right) {
    while (left < right && sortedMembersToPay[left].amount === 0) {
      left++;
    }
    while (left < right && sortedMembersToPay[right].amount === 0) {
      right--;
    }

    const toReceive = sortedMembersToPay[left];
    const toSend = sortedMembersToPay[right];
    const amountToReceive = Math.abs(toReceive.amount);
    const amountToSend = Math.abs(toSend.amount);

    if (amountToSend > amountToReceive) {
      minTransactions.push({
        receiver: toReceive.member,
        sender: toSend.member,
        amount: amountToReceive,
      });
      toReceive.amount = 0;
      toSend.amount -= amountToReceive;
      left++;
    } else {
      minTransactions.push({
        receiver: toReceive.member,
        sender: toSend.member,
        amount: amountToSend,
      });
      toSend.amount = 0;
      toReceive.amount += amountToSend;
      right--;
    }
  }

  return minTransactions;
};

export const SettlementSummary = () => {
  const wrapperElement = useRef(null);
  const expenses = useRecoilValue(expensesState);
  const members = useRecoilValue(groupMembersState);

  const totalExpenseAmount = parseFloat(
    expenses.reduce(
      (prevAmount, curExpense) => prevAmount + parseFloat(curExpense.amount),
      0
    )
  ).toFixed(2);
  const groupMembersCount = members.length;
  const splitAmount = totalExpenseAmount / groupMembersCount;

  //TODO: 핵심 로직
  const minTransaction = calculateMinimumTransaction(
    expenses,
    members,
    splitAmount
  );

  const exportToImage = () => {
    if (wrapperElement.current === null) {
      return;
    }

    toPng(wrapperElement.current, {
      filter: (node) => node.tagName !== 'BUTTON',
    })
      .then((dataURL) => {
        const link = document.createElement('a');
        link.download = 'settlement-summary.png';
        link.href = dataURL;

        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <StyledWrapper ref={wrapperElement}>
      <StyledTitle>2. 정산은 이렇게!</StyledTitle>
      {totalExpenseAmount > 0 && groupMembersCount > 0 && (
        <>
          <StyledSummary>
            <span>
              {groupMembersCount}명 - 총 {parseInt(totalExpenseAmount)} 원 지출
            </span>
            <br />
            <span>한 사람 당 {splitAmount} 원</span>
          </StyledSummary>
          <StyledUl>
            {minTransaction.map(({ sender, receiver, amount }, index) => (
              <li key={`transaction-${index}`}>
                <span>
                  {sender} → {receiver} : {amount} 원 보내기
                </span>
              </li>
            ))}
          </StyledUl>
          <StyledButton data-testid="btn-download" onClick={exportToImage}>
            <Download />
          </StyledButton>
        </>
      )}
    </StyledWrapper>
  );
};

const StyledButton = styled(Button)`
  background: none;
  border: none;
  font-size: 25px;
  position: absolute;
  top: 15px;
  right: 15px;

  &:hover,
  &:active {
    background: none;
    color: #683ba1;
  }
`;

const StyledWrapper = styled.div`
  padding: 1.5em;
  background-color: #683ba1;
  color: #fffbfb;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  position: relative;

  @media screen and (max-width: 600px) {
    font-size: 4vw;
    line-height: 6vw;
  }
`;

const StyledUl = styled.ul`
  margin-top: 1em;
  font-weight: 600;
  line-height: 200%;
  text-align: left;

  list-style-type: disclosure-closed;
  li::marker {
    animation: blinker 1.5s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

const StyledSummary = styled.div`
  margin-top: 1em;
`;
