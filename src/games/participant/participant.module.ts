import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/auth/user/user.module';

import { Participant } from '../entities/participant.entity';
import { SessionModule } from '../session/session.module';

import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';

@Module({
    providers: [ParticipantService],
    imports: [SessionModule, UserModule, TypeOrmModule.forFeature([Participant])],
    controllers: [ParticipantController],
})
export class ParticipantModule {}
