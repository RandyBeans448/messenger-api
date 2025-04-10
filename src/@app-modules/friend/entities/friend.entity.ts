import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { CryptoKeys } from '../../crypto-key/entities/crypto-key.entity';

@Entity('friends')
export class Friend {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.friends)
    user: User;

    @ManyToOne(() => User, { eager: true })
    friend: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.friend, { nullable: true, eager: true, cascade: true })
    conversations: Conversation;

    @OneToOne(() => CryptoKeys, (cryptoKey) => cryptoKey.friend, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    cryptoKey: CryptoKeys;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
