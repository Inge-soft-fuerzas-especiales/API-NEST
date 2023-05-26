import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private categoryRepository: Repository<Business>,
  ) {}

  getByOwner(owner_id: number): Promise<Business> {
    return this.categoryRepository.findOneBy({ owner: { id: owner_id } });
  }
}
