import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users-shared/users.service';
import { UserData } from '../../models/auth';
import { LocalAuthGuard } from '../local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() user: UserData) {
    return this.usersService.create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: UserData) {
    return this.authService.login(user.username);
  }
}
