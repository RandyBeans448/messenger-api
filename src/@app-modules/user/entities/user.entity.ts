import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Friend } from '../../friend/entities/friend.entity';
import { FriendRequest } from '../../friend-request/entities/friend-request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  auth0Id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Friend, (friend) => friend.user, {
    nullable: true,
  })
  friends: Friend[];

  @OneToMany(
    () => FriendRequest,
    (friendRequests) => friendRequests.requestSentBy,
    {
      nullable: true,
    },
  )
  friendRequests: FriendRequest[];

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
