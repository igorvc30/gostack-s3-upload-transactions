import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
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
    const categoryRepository = getRepository(Category);

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

    let categoryId: string;
    const foundCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });
    console.log(foundCategory);
    if (!foundCategory) {
      const newCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(newCategory);
      categoryId = newCategory.id;
    } else {
      categoryId = foundCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
