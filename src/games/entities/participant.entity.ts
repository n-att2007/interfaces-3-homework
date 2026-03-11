import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@/auth/entities/user.entity';

import { Session } from './session.entity';

@Entity('participants')
export class Participant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    score: number; // This column stores the score of the participant in the session, is of type number and is not nullable, meaning that it must have a value when a participant record is created

    @Column()
    position: number; // This column stores the position of the participant in the session, is of type number and is not nullable, meaning that it must have a value when a participant record is created

    @Column({ name: 'is_winner' }) // This column indicates whether the participant is the winner of the session, is of type boolean and is not nullable, meaning that it must have a value (true or false) when a participant record is created
    isWinner: boolean; // This column indicates whether the participant is the winner of the session, is of type boolean and is not nullable, meaning that it must have a value (true or false) when a participant record is created

    @ManyToOne(() => Session, (session) => session.participants, { nullable: false }) // Many-to-one relationship with Session entity, meaning that each participant is associated with one session, but a session can have many participants
    @JoinColumn({ name: 'session_id' }) // This decorator specifies the foreign key column name in the participants table that references the sessions table
    session: Session; // This property represents the session associated with the participant, is of type Session and not an array because it's a many-to-one relationship

    @ManyToOne(() => User, (user) => user.participations, { nullable: false }) // Many-to-one relationship with User entity, meaning that each participant is associated with one user, but a user can be a participant in many sessions
    @JoinColumn({ name: 'user_id' }) // This decorator specifies the foreign key column name in the participants table that references the users table
    user: User; // This property represents the user associated with the participant, is of type User and not an array because it's a many-to-one relationship
}
