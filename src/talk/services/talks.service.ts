import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTalkRepository } from '../repositories/talks.repository';
import { Talk } from '../entities/talk.entity';
import { TalkData } from '../../models/talk';
import { DeleteResult, SelectQueryBuilder } from 'typeorm';
import { UserTalk } from '../entities/user-talk.entity';
import { TalkRepository } from '../repositories/user-talk.repository';
import { Users } from '../../users-shared/users.entity';

@Injectable()
export class TalksService {
  constructor(
    @InjectRepository(TalkRepository)
    private talkRepository: TalkRepository,
    @InjectRepository(UserTalkRepository)
    private userTalkRepository: UserTalkRepository,
  ) {}

  findAll(): Promise<Talk[]> {
    return this.talkRepository.find();
  }

  findOne(id: string): Promise<Talk> {
    return this.talkRepository.findOne(id);
  }

  async create(talk: TalkData): Promise<Talk | null> {
    return this.talkRepository.createTalk(talk);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.talkRepository.delete(id);
  }

  async addUserToTalk(userTalk: Partial<UserTalk>): Promise<any> {
    return this.userTalkRepository.addUserToTalk(userTalk);
  }

  async getUser(userTalk: Partial<UserTalk>): Promise<any> {
    return this.userTalkRepository.addUserToTalk(userTalk);
  }

  getRawTalk(talkId: string): SelectQueryBuilder<Talk> {
    return this.talkRepository
      .createQueryBuilder('talk')
      .where('talk.id = :talkId', { talkId });
  }

  async getUserTalks(userId: number): Promise<any> {
    const talksQuery = this.talkRepository
      .createQueryBuilder('talk')
      .leftJoin('talk.talkUsers', 'talkUsers')
      .where('talkUsers.userId = :userId', { userId })
      .leftJoinAndMapMany(
        'talk.talkUsers',
        UserTalk,
        'usertalk',
        'talk.id = usertalk.talkId',
      )
      .leftJoinAndMapOne(
        'usertalk.user',
        Users,
        'user',
        'usertalk.userId = user.id',
      )
      .select([
        'talk',
        'usertalk.status',
        'user.id',
        'user.username',
        'user.lastLoginDateTime',
      ]);
    return talksQuery.getMany();
  }
}
