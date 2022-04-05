import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateMessageData,
  MessageData,
  RemoveMessageData,
  TalkData,
} from '../../models/talk';
import { MessagesRepository } from '../repositories/message.repository';
import { Message } from '../entities/message.entity';
import { TalksService } from './talks.service';
import { UsersService } from '../../users-shared/users.service';
import { DEFAULT_LIMIT } from '../../constants/global-constants';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessagesRepository)
    private messagesRepository: MessagesRepository,
    private talksService: TalksService,
    private userService: UsersService,
  ) {}

  async getTalkMessages(params: MessageData): Promise<any> {
    const talksQuery = this.messagesRepository
      .createQueryBuilder('message')
      .where('message.talkId = :talkId', { talkId: params.talkId })
      .orderBy('message.sendDateTime');
    return talksQuery.getMany();
  }

  async createMessage(createMessage: CreateMessageData) {
    const user = await this.userService.findOne(createMessage.userId);
    const talk = await this.talksService.findOne(createMessage.talkId);
    return this.messagesRepository.addMessage({
      user,
      talk,
      text: createMessage.text,
    });
  }

  async removeMessage(userId: string, removeMessage: RemoveMessageData) {
    return this.messagesRepository.delete({
      id: +removeMessage.messageId,
    });
  }
}
