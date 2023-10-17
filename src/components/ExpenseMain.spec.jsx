import { render, screen, waitFor, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { ExpenseMain } from './ExpenseMain';
import userEvent from '@testing-library/user-event';
import { groupMembersState } from '../state/groupMembers';
import { BrowserRouter } from 'react-router-dom';

const renderComponent = () => {
  render(
    <RecoilRoot
      initializeState={(snap) => {
        snap.set(groupMembersState, ['철수', '영희']);
      }}
    >
      <ExpenseMain />
    </RecoilRoot>
  );

  const dateInput = screen.getByPlaceholderText(/결제한 날짜/i);
  const descInput = screen.getByPlaceholderText(/비용에 대한 설명/i);
  const amountInput = screen.getByPlaceholderText(/비용은 얼마/i);
  const payerInput = screen.getByDisplayValue(/누가 결제/i);
  const addButton = screen.getByText('추가하기');

  const descErrorMessage = screen.getByText(
    '비용 내용을 입력해 주셔야 합니다.'
  );
  const payerErrorMessage = screen.getByText('결제자를 선택해 주셔야 합니다.');
  const amountErrorMessage = screen.getByText(
    '1원 이상의 금액을 입력해 주셔야 합니다.'
  );

  return {
    dateInput,
    descInput,
    amountInput,
    payerInput,
    addButton,
    descErrorMessage,
    payerErrorMessage,
    amountErrorMessage,
  };
};

describe('비용 정산 메인 페이지', () => {
  describe('비용 추가 컴포넌트', () => {
    test('비용 추가 컴포넌트 렌더링', () => {
      const { dateInput, descInput, amountInput, payerInput, addButton } =
        renderComponent();

      expect(dateInput).toBeInTheDocument();
      expect(descInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();
      expect(payerInput).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
    });
    test('비용 추가에 필수적인 값을 입력하지 않고 "추가" 버튼 클릭 시, 에러 메시지를 노출한다.', async () => {
      const {
        addButton,
        descErrorMessage,
        payerErrorMessage,
        amountErrorMessage,
      } = renderComponent();

      expect(addButton).toBeInTheDocument();
      await userEvent.click(addButton);

      expect(descErrorMessage).toHaveAttribute('data-valid', 'false');
      expect(payerErrorMessage).toHaveAttribute('data-valid', 'false');
      expect(amountErrorMessage).toHaveAttribute('data-valid', 'false');
    });
    test('비용 추가에 필수적인 값들을 입력한 후 "추가" 버튼 클릭 시, 저장에 성공', async () => {
      const {
        descInput,
        amountInput,
        payerInput,
        addButton,
        descErrorMessage,
        payerErrorMessage,
        amountErrorMessage,
      } = renderComponent();
      await userEvent.type(descInput, '장보기');
      await userEvent.type(amountInput, '30000');
      await userEvent.selectOptions(payerInput, '철수');
      await userEvent.click(addButton);

      expect(descErrorMessage).toHaveAttribute('data-valid', 'true');
      expect(payerErrorMessage).toHaveAttribute('data-valid', 'true');
      expect(amountErrorMessage).toHaveAttribute('data-valid', 'true');
    });
  });

  describe('비용 리스트 컴포넌트', () => {
    test('비용 리스트 컴포넌트가 렌더링 되는가?', () => {
      renderComponent();
      const expenseListComponent = screen.getByTestId('expenseList');

      expect(expenseListComponent).toBeInTheDocument();
    });

    // test('', () => {});
  });

  describe('비용 정산 결과 컴포넌트', () => {
    test('비용 정산 결과 컴포넌트가 렌더링이 되는가?', () => {
      renderComponent();

      const component = screen.getByText(/정산은 이렇게/i);
      expect(component).toBeInTheDocument();
    });
  });

  describe('새로운 비용이 입력 되었을때,', () => {
    const addNewExpense = async () => {
      const { dateInput, descInput, payerInput, amountInput, addButton } =
        renderComponent();
      await userEvent.type(dateInput, '2023-10-17');
      await userEvent.type(descInput, '장보기');
      await userEvent.type(amountInput, '30000');
      await userEvent.selectOptions(payerInput, '철수');
      await userEvent.click(addButton);
    };

    beforeEach(async () => {
      await addNewExpense();
    });
    test('날짜, 내용, 결제자, 금액 테이터가 정산 리스트에 추가 된다.', () => {
      const expenseListComponent = screen.getByTestId('expenseList');
      const dateValue = within(expenseListComponent).getByText('2023-10-17');
      const descValue = within(expenseListComponent).getByText('장보기');
      const amountValue = within(expenseListComponent).getByText('30000 원');
      const payerValue = within(expenseListComponent).getByText('철수');

      expect(dateValue).toBeInTheDocument();
      expect(descValue).toBeInTheDocument();
      expect(amountValue).toBeInTheDocument();
      expect(payerValue).toBeInTheDocument();
    });

    test('정산 결과가 업데이트가 된다.', () => {
      const totalText = screen.getByText(/2명 - 총 30000 원 지출/i);
      expect(totalText).toBeInTheDocument();

      const transactionText = screen.getByText(/영희 → 철수 : 15000 원/i);
      expect(transactionText).toBeInTheDocument();
    });

    const htmlToImage = require('html-to-image');
    test('정산 결과를 이미지 파일로 저장할 수 있다.', async () => {
      const spiedToPng = jest.spyOn(htmlToImage, 'toPng');

      const downloadBtn = screen.getByTestId('btn-download');
      expect(downloadBtn).toBeInTheDocument();

      await waitFor(() => {
        expect(downloadBtn).toBeInTheDocument();
      });

      userEvent.click(downloadBtn);
      await waitFor(() => {
        expect(spiedToPng).toHaveBeenCalledTimes(1);
      });
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
