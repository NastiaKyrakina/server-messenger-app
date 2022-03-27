import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TalksService } from './talks.service';
import { UsersService } from '../../users-shared/users.service';
import { TalkData, UserTalkData } from '../../models/talk';
import { Talk, TalkType } from '../entities/talk.entity';
import { UserStatus } from '../entities/user-talk.entity';

@Injectable()
export class UserTalksService {
  constructor(
    private talksService: TalksService,
    private userService: UsersService,
  ) {}

  async createWithUser(talk: TalkData, userId: string): Promise<Talk | null> {
    console.log(talk);
    const newTalk = await this.talksService.create(talk);
    const currentUser = await this.userService.findOne(userId);
    const talkOwner = await this.talksService.addUserToTalk({
      talk: newTalk,
      user: currentUser,
      status: UserStatus.admin,
    });
    return { ...newTalk, talkUsers: [talkOwner] };
  }

  async createConversation(currentUserId: string, opponentId: string) {
    const currentUser = await this.userService.findOne(currentUserId);
    const opponentUser = await this.userService.findOne(opponentId);
    const talk = await this.talksService.create({ type: TalkType.private });
    const userInTalk1 = await this.talksService.addUserToTalk({
      talk,
      user: currentUser,
      status: UserStatus.user,
    });

    const userInTalk2 = await this.talksService.addUserToTalk({
      talk,
      user: opponentUser,
      status: UserStatus.user,
    });

    return { ...talk, talkUsers: [userInTalk1, userInTalk2] };
  }

  async addUserToTalk(talkId: string, userTalk: UserTalkData) {
    const user = await this.userService.findOne(userTalk.userId);
    const talk = await this.talksService.findOne(talkId);
    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
    if (!talk) {
      throw new HttpException(`User task not found`, HttpStatus.NOT_FOUND);
    }
    return this.talksService.addUserToTalk({
      user,
      talk,
      status: userTalk.status,
    });
  }
}
