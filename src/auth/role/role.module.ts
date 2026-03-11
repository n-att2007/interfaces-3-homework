import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../entities/role.entity';

import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
    providers: [RoleService],
    imports: [TypeOrmModule.forFeature([Role])],
    exports: [RoleService],
    controllers: [RoleController],
})
export class RoleModule {}
