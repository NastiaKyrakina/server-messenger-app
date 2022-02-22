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

  // findAll(): Promise<Talk[]> {
  //   return this.talkRepository.find();
  // }
  //
  // findOne(id: string): Promise<Talk> {
  //   return this.talkRepository.findOne(id);
  // }
  //
  // async create(talk: TalkData): Promise<Talk | null> {
  //   return this.talkRepository.createTalk(talk);
  // }
  //
  // async delete(id: string): Promise<DeleteResult> {
  //   return this.talkRepository.delete(id);
  // }
  //
  // async addUserToTalk(userTalk: Partial<UserTalk>): Promise<any> {
  //   return this.userTalkRepository.addUserToTalk(userTalk);
  // }

  // async getUsersConversation(currentUserId: string, opponentId: string) {
  //   return this.userTalkRepository.find({});
  // }

  async getTalkMessages(params: MessageData): Promise<any> {
    const talksQuery = this.messagesRepository
      .createQueryBuilder('message')
      .where('message.talkId = :talkId', { talkId: params.talkId })
      .skip(params.offset || 0)
      .limit(params.limit || DEFAULT_LIMIT);
    return talksQuery.getMany();
  }

  async createMessage(createMessage: CreateMessageData) {
    const user = await this.userService.findOne(createMessage.userId);
    const talk = await this.talksService.findOne(createMessage.userId);
    return this.messagesRepository.addMessage({
      user,
      talk,
      text: createMessage.text,
    });
  }

  // async removeMessage(userId: string, removeMessage: RemoveMessageData) {
  //   const message = await this.messagesRepository.findOne({
  //     id: +removeMessage.messageId,
  //     talk: +removeMessage.talkId,
  //   });
  // }
}
