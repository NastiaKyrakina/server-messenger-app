import { Injectable } from '@nestjs/common';
import { UsersService } from '../users-shared/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user && user.password == pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string) {
    const validatedUser = await this.usersService.findOneByName(username);
    await this.usersService.updateLoginDateTime(validatedUser.id);
    const payload = { username: validatedUser.username, sub: validatedUser.id };
    return {
      user: {
        username: validatedUser.username,
        lastLoginDateTime: validatedUser.lastLoginDateTime,
        registrationDate: validatedUser.registration_date,
      },
      accessToken: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        privateKey: jwtConstants.secret,
      }),
    };
  }
}
