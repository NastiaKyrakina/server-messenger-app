import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Talk } from './talk.entity';
import { Users } from '../../users-shared/users.entity';

export enum UserStatus {
  user,
  admin,
}

@Entity()
export class UserTalk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.user })
  status: UserStatus;

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
}
