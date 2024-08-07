import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // Assuming you have a User entity
import { Conversation } from '../../conversation/entities/conversation.entity'; // Assuming you have a Conversation entity

@Entity('friends')
export class Friend {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.friends)
    user: User;

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    friend: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.friend, {
        nullable: true,
        eager: true,
    })
    conversations: Conversation[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
