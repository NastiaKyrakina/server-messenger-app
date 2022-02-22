import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UsersRepository])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersSharedModule {}
