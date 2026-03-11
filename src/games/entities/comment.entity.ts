import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@/auth/entities/user.entity';

import { Game } from './game.entity';

@Entity('comments') // This decorator marks the class as a database entity and specifies the table name as 'comments'
export class Comment {
    @PrimaryGeneratedColumn() // Primary key, auto-incremented
    id: number;

    @Column({ length: 255 }) // Content of the comment with a maximum length of 255 characters
    content: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically set the creation date of the comment record to the current timestamp
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.comments, { nullable: false }) // Many-to-one relationship with User entity, meaning that each comment is associated with one user, but a user can have many comments
    @JoinColumn({ name: 'user_id' }) // This decorator specifies the foreign key column name in the comments table that references the users table
    user: User; // This property represents the user who made the comment, is of type User and not an array because it's a many-to-one relationship

    @ManyToOne(() => Game, (game) => game.comments, { nullable: false }) // Many-to-one relationship with Game entity, meaning that each comment is associated with one game, but a game can have many comments
    @JoinColumn({ name: 'game_id' }) // This decorator specifies the foreign key column name in the comments table that references the games table
    game: Game; // This property represents the game associated with the comment, is of type Game and not an array because it's a many-to-one relationship
}
