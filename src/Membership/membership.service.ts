import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './memebership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  getByBusiness(business_id: number): Promise<Membership> {
    return this.membershipRepository.findOneBy({
      business: { id: business_id },
    });
  }
}
