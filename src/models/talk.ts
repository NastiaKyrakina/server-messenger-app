import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TalkType } from '../talk/entities/talk.entity';
import { UserStatus } from '../talk/entities/user-talk.entity';
import { DEFAULT_LIMIT } from '../constants/global-constants';

export class TalkData {
  @ApiProperty()
  title?: string;

  @ApiProperty({ type: 'enum', enum: TalkType, default: TalkType.private })
  @IsNotEmpty()
  type: TalkType;

  @ApiProperty({ required: false })
  imagePath?: string;
}

export class UserTalkData {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: 'enum', enum: UserStatus, default: UserStatus.user })
  status: UserStatus;
}

export class UserTalkDeleteData {
  @ApiProperty()
  userId: string;
}

export class ConversationParams {
  @ApiProperty()
  opponentId: string;
}

export class MessageData {
  @ApiProperty()
  talkId: string;

  @ApiProperty({
    required: false,
    default: DEFAULT_LIMIT,
  })
  limit?: number;

  @ApiProperty({
    required: false,
    default: 0,
  })
  offset?: number;
}

export class CreateMessageData {
  @ApiProperty()
  talkId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  text: string;
}

export class CreateMessageBody {
  @ApiProperty()
  text: string;
}

export class RemoveMessageData {
  @ApiProperty()
  messageId: string;
}
