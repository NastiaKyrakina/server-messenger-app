import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users-shared/users.service';
import { UserData } from '../../models/auth';
import { LocalAuthGuard } from '../local-auth.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('registration')
  async signup(@Body() user: UserData) {
    return this.usersService.create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
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
