import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserTalk } from './user-talk.entity';
import { Message } from './message.entity';

export enum TalkType {
  public,
  private,
}

@Entity()
export class Talk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'enum', enum: TalkType, default: TalkType.private })
  type: TalkType;

  @CreateDateColumn()
  creationDateTime: Date;

  @Column({ nullable: true })
  imagePath: string;

  @OneToMany((type) => UserTalk, (userTalk) => userTalk.talk)
  @JoinColumn({ referencedColumnName: 'id' })
  talkUsers: UserTalk[];

  @OneToMany((type) => Message, (message) => message.talk)
  @JoinColumn({ referencedColumnName: 'id' })
  talkMessages: Message[];
}
