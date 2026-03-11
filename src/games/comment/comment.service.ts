import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '@/auth/user/user.service';

import { Comment } from '../entities/comment.entity';
import { Game } from '../entities/game.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GameService } from '../game/game.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly gameService: GameService,
        private readonly userService: UserService,
    ) {}

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        const game = await this.gameService.findOne(createCommentDto.gameId);
        if (!game) {
            throw new Error('Game not found');
        }

        const user = await this.userService.findById(createCommentDto.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newComment = this.commentRepository.create({
            game,
            user,
            content: createCommentDto.content,
        });

        return await this.commentRepository.save(newComment);
    }

    async findAll(): Promise<Comment[]> {
        return await this.commentRepository.find({
            relations: ['game', 'user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Comment | null> {
        return await this.commentRepository.findOne({
            where: { id },
            relations: ['game', 'user'],
        });
    }

    async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['game', 'user'],
        });

        if (!comment) {
            return null;
        }

        const { gameId, userId, ...commentData } = updateCommentDto;
        Object.assign(comment, commentData);

        if (gameId !== undefined) {
            const game = await this.gameService.findOne(gameId);
            if (!game) {
                throw new Error('Game not found');
            }
            comment.game = game;
        }

        if (userId !== undefined) {
            const user = await this.userService.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            comment.user = user;
        }

        return await this.commentRepository.save(comment);
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.commentRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }
}
