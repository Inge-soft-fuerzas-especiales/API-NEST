import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Business } from './business.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  getById(businessId: number): Promise<Business> {
    return this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['owner', 'membership'],
    });
  }

  getUnverified(): Promise<Business[]> {
    return this.businessRepository.find({
      where: {
        verified: false,
        cuit: Not(IsNull()),
      },
    });
  }

  update(business: Business) {
    return this.businessRepository.update({ id: business.id }, business);
  }
}
