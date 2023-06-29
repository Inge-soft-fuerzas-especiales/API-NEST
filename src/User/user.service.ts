import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Business } from '../Business/business.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(authzId: string, dni: number): Promise<boolean> {
    const user = this.userRepository.create({ authzId: authzId, dni: dni });
    try {
      await this.userRepository.insert(user);
    } catch (e) {
      return false;
    }
    return true;
  }

  getByAuthzId(authzId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { authzId: authzId },
      relations: ['employedAt', 'owns'],
    });
  }

  getByDni(dni: number): Promise<User> {
    return this.userRepository.findOne({
      where: { dni: dni },
      relations: ['employedAt', 'owns'],
    });
  }

  getUnverified(): Promise<User[]> {
    return this.userRepository.find({
      where: { verified: false },
    });
  }

  async verify(dni: number): Promise<boolean> {
    try {
      await this.userRepository.update({ dni: dni }, { verified: true });
    } catch (e) {
      return false;
    }
    return true;
  }

  async setEmployment(
    dni: number,
    business: Business | null,
  ): Promise<boolean> {
    try {
      await this.userRepository.update({ dni: dni }, { employedAt: business });
    } catch (e) {
      return false;
    }
    return true;
  }
}
