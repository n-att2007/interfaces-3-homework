import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@auth/entities/user.entity';

import { Session } from './session.entity';
import { Comment } from './comment.entity';

export enum GameCategory {
    BOARD = 'board',
    CARD = 'card',
    DICE = 'dice',
    STRATEGY = 'strategy',
    PARTY = 'party',
    COOPERATIVE = 'cooperative',
    DECK_BUILDING = 'deck_building',
    WORD = 'word',
    TRIVIA = 'trivia',
    ABSTRACT = 'abstract',
    FAMILY = 'family',
    THEMATIC = 'thematic',
    WAR = 'war',
    PUZZLE = 'puzzle',
    ROLE_PLAYING = 'role_playing',
}

@Entity('games') // This decorator marks the class as a database entity and specifies the table name as 'games'
export class Game {
    @PrimaryGeneratedColumn() // Primary key, auto-incremented
    id: number;

    @Column({ length: 100, unique: true }) // Name of the game with a maximum length of 100 characters
    name: string;

    @Column({ length: 255 }) // Description of the game with a maximum length of 255 characters
    description: string;

    @Column({ name: 'min_players' }) // Minimum number of players required to play the game
    minPlayers: number;

    @Column({ name: 'max_players' }) // Maximum number of players allowed to play the game
    maxPlayers: number;

    @Column({ type: 'enum', enum: GameCategory })
    category: GameCategory;

    @ManyToOne(() => User, (user) => user.games, { nullable: false }) // Many-to-one relationship with User entity, meaning that each game can be created by one user, but a user can create many games
    @JoinColumn({ name: 'created_by' }) // This decorator specifies the foreign key column name in the games table that references the users table
    createdBy: User; // This property represents the user who created the game, is of type User and not an array because it's a many-to-one relationship

    @OneToMany(() => Session, (session) => session.game) // One-to-many relationship with Session entity, meaning that each game can have many sessions, but each session is associated with one game
    sessions: Session[]; // This property represents the sessions associated with the game, is an array of Session because it's a one-to-many relationship

    @OneToMany(() => Comment, (comment) => comment.game) // One-to-many relationship with Comment entity, meaning that each game can have many comments, but each comment is associated with one game
    comments: Comment[]; // This property represents the comments associated with the game, is an array of Comment because it's a one-to-many relationship
}
