import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@/auth/entities/user.entity';

import { Game } from './game.entity';
import { Participant } from './participant.entity';

export enum SessionStatus {
    SCHEDULED = 'scheduled',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'date_session' }) // This decorator automatically sets the value of this column to the current date and time when a new session is created
    dateSession: Date;

    @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED }) // This column stores the status of the session, which can be one of the values defined in the SessionStatus enum, and defaults to 'scheduled'
    status: SessionStatus;

    @Column({ length: 255, nullable: true }) // This column stores additional notes about the session, with a maximum length of 255 characters, and is optional (nullable)
    notes: string;

    @ManyToOne(() => Game, (game) => game.sessions, { nullable: false }) // Many-to-one relationship with Game entity, meaning that each session is associated with one game, but a game can have many sessions
    @JoinColumn({ name: 'game_id' }) // This decorator specifies the foreign key column name in the sessions table that references the games table
    game: Game;

    @ManyToOne(() => User, (user) => user.sessions, { nullable: false }) // Many-to-one relationship with User entity, meaning that each session is associated with one user, but a user can have many sessions
    @JoinColumn({ name: 'host_id' }) // This decorator specifies the foreign key column name in the sessions table that references the users table
    host: User;

    @OneToMany(() => Participant, (participant) => participant.session) // One-to-many relationship with Participant entity, meaning that each session can have many participants, but each participant is associated with one session
    participants: Participant[]; // This property represents the participants associated with the session, is an array of Participant because it's a one-to-many relationship
}
