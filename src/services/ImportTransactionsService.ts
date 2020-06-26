import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import loadTransactionsCSV from '../utils/readTransactionsCsv';
import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';

class ImportTransactionsService {
  async execute(file_name: string): Promise<Transaction[]> {
    const transactions = await loadTransactionsCSV(file_name);

    const createTransactionService = new CreateTransactionService();
    const createCategoryService = new CreateCategoryService();

    const transactionsInserteds = <Transaction[]>[];

    for(const transaction of transactions){
      const categoryBd = await createCategoryService.execute({ title: transaction.category });
      const category_id = categoryBd.id;
      const inserted = await createTransactionService.execute({ ...transaction, category_id });
      transactionsInserteds.push(inserted)
    }

    return transactionsInserteds;
  }
}

export default ImportTransactionsService;
