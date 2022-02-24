import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne((type) => Talk, {
    onDelete: 'CASCADE',
  })
  talk: Talk;

  @ManyToOne((type) => Users)
  user: Users;
}
