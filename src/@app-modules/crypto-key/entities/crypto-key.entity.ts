import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Friend } from '../../friend/entities/friend.entity';

@Entity()
export class CryptoKeys {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  sharedSecret: string;

  @OneToOne(() => Friend, (friend) => friend.cryptoKey, { eager: true, })
  friend: Friend;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deletedAt: Date;
}
