import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/auth/user/user.module';

import { Session } from '../entities/session.entity';
import { GameModule } from '../game/game.module';

import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
    providers: [SessionService],
    imports: [GameModule, UserModule, TypeOrmModule.forFeature([Session])],
    exports: [SessionService],
    controllers: [SessionController],
})
export class SessionModule {}
