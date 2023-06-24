import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  add(authz_id: string): Promise<User> {
    const newUser = this.userRepository.create({ authz_id: authz_id });
    return this.userRepository.save(newUser);
  }

  getByAuthzId(authz_id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { authz_id: authz_id },
      relations: ['employedAt', 'owns'],
    });
  }
}
