import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const balance = await transactionRepository.getBalance();

    if (value < 0) {
      throw new AppError('The value should be greater than zero.');
    }
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('The type should be income or outcome.');
    }
    const { total } = balance;
    if (type === 'outcome' && value > total) {
      throw new AppError('Insufficient balance for the transaction.');
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
