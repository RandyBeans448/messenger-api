import { User } from 'src/@app-modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('messages')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pending: boolean = true;

  @Column()
  accepted: boolean = false;

  @OneToMany(() => User, (user) => user.friendRequests)
  requestSentBy: User;

  @OneToOne(() => User, { eager: true })
  receiver: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
