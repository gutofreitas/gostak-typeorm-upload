import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category_id}: RequestTransaction): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();

    if( value > balance.total && type === 'outcome') {
      throw new AppError('Insufficient balance to complete the transaction');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
