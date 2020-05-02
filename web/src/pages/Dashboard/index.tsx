import React, { useState, useEffect } from 'react';

import { FiChevronDown } from 'react-icons/fi';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import {
  Container,
  CardContainer,
  Card,
  TableContainer,
  SortButton,
} from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Accountability {
  transactions: Transaction[];
  balance: Balance;
}

interface SortType {
  filter: 'name' | 'value' | 'category' | 'date';
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [sortFilter, setSortFilter] = useState<SortType>({ filter: 'name' });

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get<Accountability>('/transactions');

      const parsedTransactions = data.transactions.map((transaction) => ({
        ...transaction,
        formattedValue: formatValue(transaction.value),
        formattedDate: formatDate(new Date(transaction.created_at)),
      }));

      const parsedBalance: Balance = {
        income: formatValue(Number(data.balance.income)),
        outcome: formatValue(Number(data.balance.outcome)),
        total: formatValue(Number(data.balance.total)),
      };

      setTransactions((state) => [...state, ...parsedTransactions]);
      setBalance(parsedBalance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header focus="Dashboard" />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  <SortButton>
                    <FiChevronDown size={30} />
                  </SortButton>
                </th>

                <th>
                  Preço
                  <SortButton>
                    <FiChevronDown size={30} />
                  </SortButton>
                </th>
                <th>
                  Categoria
                  <SortButton>
                    <FiChevronDown size={30} />
                  </SortButton>
                </th>
                <th>
                  Data
                  <SortButton>
                    <FiChevronDown size={30} />
                  </SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome'
                      ? `- ${transaction.formattedValue}`
                      : transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
