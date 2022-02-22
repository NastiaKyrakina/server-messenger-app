import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserData } from './models/auth';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users-shared/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('controller/signup')
  async signup(@Body() user: UserData) {
    return this.usersService.create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('controller/login')
  async login(@Body() user: UserData) {
    return this.authService.login(user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  getProfile(@Request() req) {
    return req.user;
  }
}
