import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  getCategoryById(categoryId: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id: categoryId });
  }

  async createCategory(name: string): Promise<Category> {
    const category = this.categoryRepository.create({ name: name });
    try {
      return await this.categoryRepository.save(category);
    } catch (e) {
      return null;
    }
  }
}
