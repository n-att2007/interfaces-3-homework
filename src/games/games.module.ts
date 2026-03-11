import { Module } from '@nestjs/common';

import { GameModule } from './game/game.module';
import { SessionModule } from './session/session.module';
import { ParticipantModule } from './participant/participant.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [GameModule, SessionModule, ParticipantModule, CommentModule],
})
export class GamesModule {}
