import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { type Response } from 'express';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        try {
            const result = await this.permissionService.remove(+id);
            if (result) {
                return res.status(200).json(`Permission with id ${id} deleted successfully`);
            }
            return res.status(404).json(`Permission with id ${id} not found`);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            return res.status(500).json(`Error deleting permission with id ${id}: ${msg}`);
        }
    }
}
