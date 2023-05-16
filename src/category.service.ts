import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private usersRepository: Repository<Category>,
  ) {}

  getAll(): Promise<Category[]> {
    return this.usersRepository.find();
  }
}
