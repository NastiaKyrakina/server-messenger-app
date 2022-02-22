import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_LIMIT } from '../constants/global-constants';

export class ListQuery {
  @ApiProperty({
    required: false,
  })
  username: string;

  @ApiProperty({
    required: false,
    default: DEFAULT_LIMIT,
  })
  limit: number;

  @ApiProperty({
    required: false,
    default: 0,
  })
  offset: number;
}
