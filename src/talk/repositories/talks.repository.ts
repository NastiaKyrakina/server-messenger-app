import { EntityRepository, Repository } from 'typeorm';
import { UserTalk } from '../entities/user-talk.entity';

@EntityRepository(UserTalk)
export class UserTalkRepository extends Repository<UserTalk> {
  addUserToTalk = async (talkData: Partial<UserTalk>) => {
    return await this.save(talkData);
  };
}
