import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface RequestCategory {
  title: string;
}

class CreateTransactionService {
  public async execute({ title }: RequestCategory): Promise<Category> {
    let category_id = '';

    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({ title });
    if (!category) {
      const newCategory = categoryRepository.create({ title });
      await categoryRepository.save(newCategory);
      return newCategory;
    }

    return category;
  }
}

export default CreateTransactionService;
