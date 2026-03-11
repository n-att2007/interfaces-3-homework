import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { type Response } from 'express';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.roleService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        try {
            const result = await this.roleService.remove(+id);
            if (result) {
                return res.status(200).json(`Role with id ${id} deleted successfully`);
            }
            return res.status(404).json(`Role with id ${id} not found`);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            return res.status(500).json(`Error deleting role with id ${id}: ${msg}`);
        }
    }
}
