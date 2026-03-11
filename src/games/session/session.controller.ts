import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { type Response } from 'express';

import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Post()
    create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionService.create(createSessionDto);
    }

    @Get()
    findAll() {
        return this.sessionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sessionService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
        return this.sessionService.update(+id, updateSessionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const result = await this.sessionService.remove(+id);
        if (result) {
            return res.status(200).json(`Session with id ${id} deleted successfully`);
        }
        return res.status(404).json(`Session with id ${id} not found`);
    }
}
