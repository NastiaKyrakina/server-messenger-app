import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TalkType {
  public,
  private,
}

@Entity()
export class Talk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: TalkType, default: TalkType.private })
  type: TalkType;

  @CreateDateColumn()
  creationDateTime: Date;

  @Column({ nullable: true })
  imagePath: string;
}
