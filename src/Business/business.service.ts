import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business, BusinessRole } from './business.entity';
import { User, UserRole } from '../User/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  async create(cuit: number, name: string, owner: User): Promise<boolean> {
    if ((await this.getByCuit(cuit)) !== null) return false;

    owner.role = UserRole.OWNER;
    const business = this.businessRepository.create({
      cuit: cuit,
      name: name,
      owner: owner,
    });
    try {
      await this.businessRepository.save(business);
    } catch (e) {
      return false;
    }
    return true;
  }

  getByCuit(cuit: number): Promise<Business> {
    return this.businessRepository.findOne({
      where: { cuit: cuit },
      relations: ['owner', 'membership'],
    });
  }

  getUnverified(): Promise<Business[]> {
    return this.businessRepository.find({
      where: { role: BusinessRole.UNVERIFIED },
      relations: ['owner'],
    });
  }

  async verify(cuit: number): Promise<boolean> {
    try {
      await this.businessRepository.update(
        { cuit: cuit },
        { role: BusinessRole.VERIFIED },
      );
    } catch (e) {
      return false;
    }
    return true;
  }
}
