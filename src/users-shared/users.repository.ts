import { UserData } from '../models/auth';
import { EntityRepository, Repository } from 'typeorm';
import { Users } from './users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  createUser = async (userData: UserData) => {
    return await this.save(userData);
  };
}
