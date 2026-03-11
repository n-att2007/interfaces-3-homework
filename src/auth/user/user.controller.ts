import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Res } from '@nestjs/common';
import { type Response } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(200)
    findAll(@Query('username') username?: string) {
        return this.userService.findAll(username);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id: string) {
        return this.userService.findById(+id);
    }

    @Post()
    @HttpCode(201)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const result = await this.userService.remove(+id);
        if (result) {
            return res.status(200).json(`User with id ${id} deleted successfully`);
        }
        return res.status(404).json(`User with id ${id} not found`);
    }
}
