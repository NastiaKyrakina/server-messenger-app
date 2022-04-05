import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTalkRepository } from '../repositories/talks.repository';
import { Talk, TalkType } from '../entities/talk.entity';
import { TalkData } from '../../models/talk';
import { DeleteResult } from 'typeorm';
import { UserTalk } from '../entities/user-talk.entity';
import { TalkRepository } from '../repositories/user-talk.repository';
import { Users } from '../../users-shared/users.entity';
import { TalkListQueryExtended } from '../../models/query';
import { DEFAULT_LIMIT } from '../../constants/global-constants';

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

  findWithParams(query: TalkListQueryExtended): Promise<Talk[]> {
    let talksQuery = this.talkRepository
      .createQueryBuilder('talk')
      .offset(query.offset || 0)
      .limit(query.limit || DEFAULT_LIMIT);

    if (Number.isInteger(query.type)) {
      talksQuery = talksQuery.where('talk.type = :type', {
        type: query.type,
      });
    }

    if (query.title) {
      talksQuery = talksQuery.where('LOWER(talk.title) like :title', {
        title: `%${query.title.toLowerCase()}%`,
      });
    }

    return talksQuery.getMany();
  }

  findOne(id: string): Promise<Talk> {
    return this.talkRepository.findOne(id, { relations: ['talkUsers'] });
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

  async getUserInTalk(
    talkId: string,
    userId: string,
  ): Promise<UserTalk | null> {
    return this.userTalkRepository.findOne({ where: { talkId, userId } });
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
      .orderBy('talk.creationDateTime')
      .select([
        'talk',
        'usertalk.status',
        'user.id',
        'user.username',
        'user.lastLoginDateTime',
      ]);
    return talksQuery.getMany();
  }

  async getUserConversation(userId: string, opponentId: string): Promise<any> {
    const talkUsersQuery = this.userTalkRepository
      .createQueryBuilder('userTalk')
      .where('userTalk.userId = :userId', {
        userId,
      })
      .leftJoinAndSelect('userTalk.talk', 'talk')
      .andWhere('userTalk.userId = :userId AND talk.type = :type', { userId, type: TalkType.private })
      .leftJoinAndSelect('talk.talkUsers', 'talkUsers')
      .andWhere('talkUsers.userId = :opponentId', { opponentId });

    return talkUsersQuery.getOne();
  }
}
