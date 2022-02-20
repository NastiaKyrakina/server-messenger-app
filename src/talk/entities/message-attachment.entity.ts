import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Talk } from './talk.entity';
import { Users } from '../../users-shared/users.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  sendDateTime: Date;

  @ManyToOne((type) => Talk)
  talk: Talk;

  @ManyToOne((type) => Users)
  user: Users;
}
