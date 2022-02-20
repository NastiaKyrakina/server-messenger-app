import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UserData } from '../models/auth';
import { UsersRepository } from '../users-shared/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Users> {
    return this.usersRepository.findOne(id);
  }

  findOneByName(username: string): Promise<Users> {
    return this.usersRepository.findOne({ username });
  }

  async create(user: UserData): Promise<Users | null> {
    const isUserExist = this.findOneByName(user.username);
    if (isUserExist) {
      throw new HttpException(
        `User with name ${user.username} already exist`,
        HttpStatus.CONFLICT,
      );
    }
    return this.usersRepository.createUser(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
