import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  // try with bcrypt
  @Column()
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginDateTime: Date;

  @CreateDateColumn()
  registration_date: Date;
}
