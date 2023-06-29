import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { User } from '../User/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  async create(owner: User, name: string, cuit: number): Promise<boolean> {
    const business = this.businessRepository.create({
      owner: owner,
      name: name,
      cuit: cuit,
    });
    try {
      await this.businessRepository.insert(business);
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
      where: { verified: false },
      relations: ['owner'],
    });
  }

  async verify(cuit: number): Promise<boolean> {
    try {
      await this.businessRepository.update({ cuit: cuit }, { verified: true });
    } catch (e) {
      return false;
    }
    return true;
  }
}
