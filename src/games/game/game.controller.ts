import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { type Response } from 'express';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }

    @Get()
    findAll() {
        return this.gameService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gameService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
        return this.gameService.update(+id, updateGameDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const result = await this.gameService.remove(+id);
        if (result) {
            return res.status(200).json(`Game with id ${id} deleted successfully`);
        }
        return res.status(404).json(`Game with id ${id} not found`);
    }
}
