import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

export enum AttachmentType {
  image,
  video,
  audio,
  file,
}

@Entity()
export class MessageAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({ type: 'enum', enum: AttachmentType, default: AttachmentType.file })
  type: AttachmentType;

  @ManyToOne((type) => Message)
  message: Message;
}
