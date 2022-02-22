import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserData } from '../models/auth';
import { UsersRepository } from './users.repository';
import { ListQuery } from '../models/query';
import { DEFAULT_LIMIT } from '../constants/global-constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findWithParams(query: ListQuery): Promise<Users[]> {
    let usersQuery = this.usersRepository.createQueryBuilder('user');
    usersQuery = usersQuery.offset(query.offset || 0);
    usersQuery = usersQuery.limit(query.limit || DEFAULT_LIMIT);
    if (query.username) {
      usersQuery = usersQuery.where('LOWER(user.username) like :username', {
        username: query.username.toLowerCase(),
      });
    }

    return usersQuery.getMany();
  }

  findOne(id: string): Promise<Users> {
    return this.usersRepository.findOne(id);
  }

  findOneByName(username: string): Promise<Users> {
    return this.usersRepository.findOne({ username });
  }

  updateLoginDateTime(userId: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .update(Users)
      .set({ lastLoginDateTime: Date() })
      .where('id = :userId', { userId })
      .execute();
  }

  async create(user: UserData): Promise<Users | null> {
    const isUserExist = await this.findOneByName(user.username);
    if (isUserExist) {
      throw new HttpException(
        `User with name ${user.username} already exist`,
        HttpStatus.CONFLICT,
      );
    }
    return this.usersRepository.createUser(user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }
}
