import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talk } from './entities/talk.entity';
import { TalksService } from './services/talks.service';
import { TalksController } from './talks.controller';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserTalk } from './entities/user-talk.entity';
import { UsersSharedModule } from '../users-shared/users-shared.module';
import { UserTalksService } from './services/user-talks.service';
import { UserTalkRepository } from './repositories/talks.repository';
import { TalkRepository } from './repositories/user-talk.repository';
import { MessageService } from './services/message.service';
import { MessagesRepository } from './repositories/message.repository';
import { Message } from './entities/message.entity';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Talk,
      UserTalk,
      Message,
      TalkRepository,
      UserTalkRepository,
      MessagesRepository,
    ]),
    PassportModule.register({}),
    AuthModule,
    UsersSharedModule,
  ],
  providers: [TalksService, UserTalksService, MessageService, MessageGateway],
  controllers: [TalksController],
})
export class TalksModule {}
