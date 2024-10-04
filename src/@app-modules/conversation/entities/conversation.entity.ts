import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Friend } from '../../friend/entities/friend.entity';
import { Message } from '../../message/entities/message.entity';


@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Friend, (friend) => friend.conversations)
    friend: Friend[];

    @OneToMany(() => Message, (message) => message.conversation, { eager: true, })
    messages: Message[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
