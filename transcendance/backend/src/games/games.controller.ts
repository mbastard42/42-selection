import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './games.model';
import { SpecialGames } from './specialGames/specialGames.model';

@Controller('games')
export class GamesController {

    constructor(private gamesService : GamesService) {}

    @Get('getCurrentGames')
    async getCurrentGames() : Promise<Array<{
        id : number,
        players : Array<string>
    }>>
    {
        return await this.gamesService.getCurrentGames()
    }

    @Post('joinCurrentGame')
    async joinCurrentGame(@Body() body: any) : Promise<number>
    {
        return await this.gamesService.joinCurrentGame(body.id)
    }

    @Post('leaveCurrentGame')
    async leaveCurrentGame(@Body() body: any) : Promise<number>
    {
        return await this.gamesService.leaveCurrentGame(body.id)
    }

    @Post('doInGame')
    doInGame(@Body() body: any) {
        return this.gamesService.getGameOfPlayer(body.id) != null;
    }

    @Post('actualGameType')
    actualGameType(@Body() body: any) {
        const game = this.gamesService.getGameOfPlayer(body.id);
        if (game instanceof SpecialGames)
            return 2;
        else if (game instanceof Game)
            return 1;
        return -1;
    }

    @Post('getGameInfos')
    getGameInfos(@Body() playerId: any) : {} {
        const game = this.gamesService.getGameOfPlayer(playerId.id);
        if (game)
            return game.toJson(playerId.id);
        return new Game().toJson(playerId.id);
    }

    @Post('getGameInfosById')
    getGameInfosById(@Body() gameId: any) : {} {
        const game = this.gamesService.getGame(gameId.id);
        if (game)
            return game.toJson();
        return new Game().toJson();
    }

    @Post('paddleDown')
    paddleDown(@Body() playerId: any) {
        return this.gamesService.paddleMove(playerId.id, 1);
    }

    @Post('paddleUp')
    paddleUp(@Body() playerId: any) {
        return this.gamesService.paddleMove(playerId.id, -1);
    }

    @Post('execute')
    executeAction(@Body() body: any) {
        return this.gamesService.executeAction(body.id, body.action);
    }
     
}
