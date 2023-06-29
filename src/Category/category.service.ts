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

  getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  getById(categoryId: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id: categoryId });
  }

  async createCategory(name: string): Promise<boolean> {
    const category = this.categoryRepository.create({ name: name });
    try {
      await this.categoryRepository.insert(category);
    } catch (e) {
      return false;
    }
    return true;
  }
}
