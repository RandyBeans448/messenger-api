import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Column,
} from 'typeorm';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { User } from '../../user/entities/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    message: string;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    conversation: Conversation;
    
    @ManyToOne(() => User, { eager: true })
    sender: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
    
}
