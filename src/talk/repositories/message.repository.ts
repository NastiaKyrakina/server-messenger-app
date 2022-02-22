import { EntityRepository, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  addMessage = async (messageData: Partial<Message>) => {
    return await this.save(messageData);
  };
}
