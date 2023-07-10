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
  ): Promise<User> {
    const user = this.userRepository.create({
      authzId: authzId,
      dni: dni,
      name: name,
      surname: surname,
    });
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      return null;
    }
  }

  getByAuthzId(authzId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { authzId: authzId },
      relations: ['business'],
    });
  }

  getUserByDni(dni: number): Promise<User> {
    return this.userRepository.findOne({
      where: { dni: dni },
      relations: ['business'],
    });
  }

  getUnverifiedUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.UNVERIFIED },
    });
  }

  async verifyUser(dni: number): Promise<boolean> {
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

  async getEmployees(cuit: number): Promise<User[]> {
    return this.userRepository.find({
      where: { business: { cuit: cuit }, role: UserRole.EMPLOYEE },
    });
  }

  async setEmployed(dni: number, business: Business): Promise<User> {
    const user = await this.userRepository.preload({
      dni: dni,
      business: business,
      role: UserRole.EMPLOYEE,
    });

    return await this.userRepository.save(user);
  }

  async clearEmployed(dni: number): Promise<User> {
    const user = await this.userRepository.preload({
      dni: dni,
      business: null,
      role: UserRole.VERIFIED,
    });

    return await this.userRepository.save(user);
  }
}
