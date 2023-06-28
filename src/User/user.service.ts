import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  add(authzId: string): Promise<User> {
    const newUser = this.userRepository.create({ authzId: authzId });
    return this.userRepository.save(newUser);
  }

  getByAuthzId(authzId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { authzId: authzId },
      relations: ['employedAt', 'owns'],
    });
  }

  getById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['employedAt', 'owns'],
    });
  }

  getUnverified(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        verified: false,
        dni: Not(IsNull()),
      },
    });
  }

  update(user: User): Promise<UpdateResult> {
    return this.userRepository.update({ id: user.id }, user);
  }
}
