import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from '@/games/entities/game.entity';
import { Session } from '@/games/entities/session.entity';
import { Participant } from '@/games/entities/participant.entity';
import { Comment } from '@/games/entities/comment.entity';

import { Role } from './role.entity';

@Entity('users') // This decorator marks the class as a database entity and specifies the table name as 'users'
// DON'T CALL IT USER, IT'S A RESERVED WORD IN SQL
export class User {
    @PrimaryGeneratedColumn() // Primary key, auto-incremented
    id: number;

    @Column({ unique: true, length: 50 }) // Unique username with a maximum length of 50 characters
    username: string;

    @Column({ unique: true, length: 255 }) // Unique email address for each user
    email: string;

    @Column({ length: 255, name: 'password_hash' }) // Hashed password for each user
    passwordHash: string;

    @Column({ length: 255, nullable: true }) // Optional full name of the user
    bio: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically set the creation date of the user record to the current timestamp
    createdAt: Date;

    @ManyToOne(() => Role, (role) => role.users, { eager: false, nullable: false }) // Many-to-one relationship with Role entity, meaning that each user can have one role, but a role can be assigned to many users
    @JoinColumn({ name: 'role_id' }) // Eager loading is enabled for the role relationship, meaning that when a user is fetched from the database, the associated role will be loaded automatically without needing to specify it in the query
    role: Role; // This property represents the role associated with the user, is of type Role and not an array because it's a many-to-one relationship

    @OneToMany(() => Game, (game) => game.createdBy) // One-to-many relationship with Game entity, meaning that each user can create many games, but each game can only be created by one user
    games: Game[]; // This property represents the games created by the user, is an array of type Game because it's a one-to-many relationship

    @OneToMany(() => Session, (session) => session.host) // One-to-many relationship with Session entity, meaning that each user can host many sessions, but each session can only be hosted by one user
    sessions: Session[]; // This property represents the sessions hosted by the user, is an array of type Session because it's a one-to-many relationship

    @OneToMany(() => Participant, (participant) => participant.user) // One-to-many relationship with Participant entity, meaning that each user can be a participant in many sessions, but each participant record is associated with one user
    participations: Participant[]; // This property represents the participations of the user in different sessions, is an array of type Participant because it's a one-to-many relationship

    @OneToMany(() => Comment, (comment) => comment.user) // One-to-many relationship with Comment entity, meaning that each user can make many comments, but each comment can only be made by one user
    comments: Comment[]; // This property represents the comments made by the user, is an array of type Comment because it's a one-to-many relationship
}
