import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { RoleModule } from '../role/role.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    providers: [UserService],
    imports: [RoleModule, TypeOrmModule.forFeature([User])],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
