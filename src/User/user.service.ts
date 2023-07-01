import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Business } from '../Business/business.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    authzId: string,
    dni: number,
    name: string,
    surname: string,
  ): Promise<boolean> {
    const user = this.userRepository.create({
      authzId: authzId,
      dni: dni,
      name: name,
      surname: surname,
    });
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
      where: { role: UserRole.UNVERIFIED },
    });
  }

  async verify(dni: number): Promise<boolean> {
    try {
      await this.userRepository.update(
        { dni: dni },
        { role: UserRole.VERIFIED },
      );
    } catch (e) {
      return false;
    }
    return true;
  }

  async setEmployed(dni: number, business: Business): Promise<boolean> {
    try {
      await this.userRepository.update(
        { dni: dni },
        { employedAt: business, role: UserRole.EMPLOYEE },
      );
    } catch (e) {
      return false;
    }
    return true;
  }

  async clearEmployed(dni: number): Promise<boolean> {
    try {
      await this.userRepository.update(
        { dni: dni },
        { employedAt: null, role: UserRole.VERIFIED },
      );
    } catch (e) {
      return false;
    }
    return true;
  }
}
