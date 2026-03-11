import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
    providers: [],
    imports: [UserModule, RoleModule, PermissionModule],
})
export class AuthModule {}
