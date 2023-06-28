import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Business } from './business.entity';
import { User } from '../User/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  create(owner: User, name: string, cuit: number): Promise<Business> {
    const business = this.businessRepository.create({
      owner: owner,
      name: name,
      cuit: cuit,
    });
    return this.businessRepository.save(business);
  }

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
