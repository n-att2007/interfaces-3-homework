import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '@/auth/user/user.service';

import { Game } from '../entities/game.entity';
import { Session, SessionStatus } from '../entities/session.entity';

import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { GameService } from '../game/game.service';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        private readonly gameService: GameService,
        private readonly userService: UserService,
    ) {}

    async create(createSessionDto: CreateSessionDto): Promise<Session> {
        const game = await this.gameService.findOne(createSessionDto.gameId);
        if (!game) {
            throw new Error('Game not found');
        }

        const host = await this.userService.findById(createSessionDto.hostId);
        if (!host) {
            throw new Error('User not found');
        }

        const newSession = this.sessionRepository.create({
            game,
            host,
            status: (createSessionDto.status as SessionStatus) || SessionStatus.SCHEDULED,
            notes: createSessionDto.notes,
        });

        return await this.sessionRepository.save(newSession);
    }

    async findAll(): Promise<Session[]> {
        return await this.sessionRepository.find({
            relations: ['game', 'host'],
        });
    }

    async findOne(id: number): Promise<Session | null> {
        return await this.sessionRepository.findOne({
            where: { id },
            relations: ['game', 'host', 'participants'],
        });
    }

    async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Session | null> {
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: ['game', 'host'],
        });

        if (!session) {
            return null;
        }

        const { gameId, hostId, ...sessionData } = updateSessionDto;
        Object.assign(session, sessionData);

        if (gameId !== undefined) {
            const game = await this.gameService.findOne(gameId);
            if (!game) {
                throw new Error('Game not found');
            }
            session.game = game;
        }

        if (hostId !== undefined) {
            const host = await this.userService.findById(hostId);
            if (!host) {
                throw new Error('User not found');
            }
            session.host = host;
        }

        if (updateSessionDto.status) {
            session.status = updateSessionDto.status as SessionStatus;
        }

        return await this.sessionRepository.save(session);
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.sessionRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }
}
