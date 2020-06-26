import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface RequestDelete {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDelete): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transaction = await transactionRepository.findOne({ id });

    if(!transaction) {
      throw new AppError('Transaction not found!', 400);
    }

    await transactionRepository.remove(transaction);

    return;
  }
}

export default DeleteTransactionService;
