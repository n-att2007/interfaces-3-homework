import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { type Response } from 'express';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(createCommentDto);
    }

    @Get()
    findAll() {
        return this.commentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commentService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(+id, updateCommentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const result = await this.commentService.remove(+id);
        if (result) {
            return res.status(200).json(`Comment with id ${id} deleted successfully`);
        }
        return res.status(404).json(`Comment with id ${id} not found`);
    }
}
