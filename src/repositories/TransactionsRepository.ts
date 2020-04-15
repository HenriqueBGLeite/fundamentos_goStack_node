import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const valorInicial = 0;

    const income = this.transactions.reduce((total, valor) => {
      if (valor.type === 'income') {
        return total + valor.value;
      }
      return total;
    }, valorInicial);

    const outcome = this.transactions.reduce((total, valor) => {
      if (valor.type === 'outcome') {
        return total + valor.value;
      }
      return total;
    }, valorInicial);

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance();
    const transaction = new Transaction({ title, value, type });

    if (transaction.type === 'outcome' && transaction.value > balance.total) {
      throw Error('Saldo insuficiente para realizar a transação.');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
