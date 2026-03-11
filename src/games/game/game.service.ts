import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '@/auth/user/user.service';

import { Game } from '../entities/game.entity';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        private readonly userService: UserService,
    ) {}

    async create(createGameDto: CreateGameDto): Promise<Game> {
        const createdBy = await this.userService.findById(createGameDto.createdBy);
        if (!createdBy) {
            throw new Error('User not found');
        }

        const newGame = this.gameRepository.create({
            ...createGameDto,
            category: createGameDto.category as Game['category'],
            createdBy,
        });

        return await this.gameRepository.save(newGame);
    }

    async findAll(): Promise<Game[]> {
        return await this.gameRepository.find({
            relations: ['createdBy'],
        });
    }

    async findOne(id: number): Promise<Game | null> {
        return await this.gameRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
    }

    async update(id: number, updateGameDto: UpdateGameDto): Promise<Game | null> {
        const game = await this.gameRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });

        if (!game) {
            return null;
        }

        const { createdBy: createdById, ...gameData } = updateGameDto;
        Object.assign(game, gameData);

        if (createdById !== undefined) {
            const createdBy = await this.userService.findById(createdById);
            if (!createdBy) {
                throw new Error('User not found');
            }
            game.createdBy = createdBy;
        }

        return await this.gameRepository.save(game);
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.gameRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }
}
