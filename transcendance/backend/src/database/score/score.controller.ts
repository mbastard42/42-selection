import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { Score } from './score.entity';
import { TokenMiddleware } from 'src/middleware';

@Controller('scores')
export class ScoreController {
    constructor(private readonly gameService: ScoreService) {}

    @Get()
    async findAll(): Promise<any> {
        return this.gameService.findAll();
    }

    @Post('userid')
    async findAllByUserId(@Body() body: any): Promise<Score[]> {
        return this.gameService.findAllByUserId(body.id);
    }


}
