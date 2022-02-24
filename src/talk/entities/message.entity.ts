import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Talk } from './talk.entity';
import { Users } from '../../users-shared/users.entity';
import { MessageAttachment } from './message-attachment.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  sendDateTime: Date;

  @Column()
  talkId: string;

  @Column()
  userId: string;

  @ManyToOne((type) => Talk, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'talkId' })
  talk: Talk;

  @ManyToOne((type) => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany((type) => MessageAttachment, (attachment) => attachment.message)
  @JoinColumn({ referencedColumnName: 'id' })
  attachments: MessageAttachment[];
}
