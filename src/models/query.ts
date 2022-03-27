import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_LIMIT } from '../constants/global-constants';
import { TalkType } from '../talk/entities/talk.entity';

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

export class TalkListQuery {
  @ApiProperty({
    required: false,
  })
  title: string;

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

export class TalkListQueryExtended extends TalkListQuery {

  @ApiProperty({
    required: false,
  })
  type: TalkType;
}
