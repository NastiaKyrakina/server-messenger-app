import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users-shared/users.service';
import { from, Observable } from 'rxjs';
import { Users } from '../users-shared/users.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { ListQuery } from '../models/query';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('list')
  findAll(@Query() query: ListQuery): Observable<Users[]> {
    return from(this.usersService.findWithParams(query));
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string): Observable<DeleteResult> {
    return from(this.usersService.delete(id));
  }
}
