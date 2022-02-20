import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTalkRepository } from '../repositories/talks.repository';
import { Talk } from '../entities/talk.entity';
import { TalkData } from '../../models/talk';
import { DeleteResult } from 'typeorm';
import { UserTalk } from '../entities/user-talk.entity';
import { TalkRepository } from '../repositories/user-talk.repository';

@Injectable()
export class TalksService {
  constructor(
    @InjectRepository(TalkRepository)
    private talkRepository: TalkRepository,
    @InjectRepository(UserTalk)
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

  async getUserTalks(userId: number): Promise<any> {
    const userTalksQuery = this.userTalkRepository
      .createQueryBuilder('userTalks')
      .where('userTalks.userId = :userId', { userId })
      .innerJoinAndSelect('userTalks.talk', 'talk');

    return userTalksQuery.getMany();
  }
}
