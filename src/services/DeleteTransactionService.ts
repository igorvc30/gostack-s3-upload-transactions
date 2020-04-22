import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const selectedTransaction = await transactionRepository.findOne({ id });
    console.log(selectedTransaction);
    if (!selectedTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
