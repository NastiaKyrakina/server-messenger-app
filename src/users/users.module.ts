import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersSharedModule } from '../users-shared/users-shared.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({}), UsersSharedModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
