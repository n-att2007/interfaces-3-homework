import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { type Response } from 'express';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ParticipantService } from './participant.service';

@Controller('participants')
export class ParticipantController {
    constructor(private readonly participantService: ParticipantService) {}

    @Post()
    create(@Body() createParticipantDto: CreateParticipantDto) {
        return this.participantService.create(createParticipantDto);
    }

    @Get()
    findAll() {
        return this.participantService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.participantService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateParticipantDto: UpdateParticipantDto) {
        return this.participantService.update(+id, updateParticipantDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const result = await this.participantService.remove(+id);
        if (result) {
            return res.status(200).json(`Participant with id ${id} deleted successfully`);
        }
        return res.status(404).json(`Participant with id ${id} not found`);
    }
}
