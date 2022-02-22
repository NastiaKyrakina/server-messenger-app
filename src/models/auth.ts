import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserData {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
