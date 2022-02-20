import { EntityRepository, Repository } from 'typeorm';
import { Talk } from './entities/talk.entity';
import { TalkData } from '../models/talk';

@EntityRepository(Talk)
export class TalkRepository extends Repository<Talk> {
  createTalk = async (talkData: TalkData) => {
    return await this.save(talkData);
  };
}
