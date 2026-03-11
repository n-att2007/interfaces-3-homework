import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/auth/user/user.module';

import { Comment } from '../entities/comment.entity';
import { GameModule } from '../game/game.module';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
    providers: [CommentService],
    imports: [GameModule, UserModule, TypeOrmModule.forFeature([Comment])],
    controllers: [CommentController],
})
export class CommentModule {}
