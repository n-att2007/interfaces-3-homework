import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '@/auth/user/user.service';

import { Participant } from '../entities/participant.entity';
import { Session } from '../entities/session.entity';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { SessionService } from '../session/session.service';

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>,
        private readonly sessionService: SessionService,
        private readonly userService: UserService,
    ) {}

    async create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
        const session = await this.sessionService.findOne(createParticipantDto.sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const user = await this.userService.findById(createParticipantDto.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newParticipant = this.participantRepository.create({
            session,
            user,
            score: createParticipantDto.score,
            position: createParticipantDto.position,
            isWinner: createParticipantDto.isWinner,
        });

        return await this.participantRepository.save(newParticipant);
    }

    async findAll(): Promise<Participant[]> {
        return await this.participantRepository.find({
            relations: ['session', 'user'],
        });
    }

    async findOne(id: number): Promise<Participant | null> {
        return await this.participantRepository.findOne({
            where: { id },
            relations: ['session', 'user'],
        });
    }

    async update(id: number, updateParticipantDto: UpdateParticipantDto): Promise<Participant | null> {
        const participant = await this.participantRepository.findOne({
            where: { id },
            relations: ['session', 'user'],
        });

        if (!participant) {
            return null;
        }

        const { sessionId, userId, ...participantData } = updateParticipantDto;
        Object.assign(participant, participantData);

        if (sessionId !== undefined) {
            const session = await this.sessionService.findOne(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }
            participant.session = session;
        }

        if (userId !== undefined) {
            const user = await this.userService.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            participant.user = user;
        }

        return await this.participantRepository.save(participant);
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.participantRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }
}
