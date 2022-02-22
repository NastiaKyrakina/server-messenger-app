import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersSharedModule } from '../users-shared/users-shared.module';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    UsersSharedModule,
    PassportModule.register({}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, LocalAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
