import { Controller, Post, Body, Get } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { SocketService } from 'src/socket/socket.service';

@Controller('matchmaking')
export class MatchmakingController {
    constructor (private readonly matchmakingService: MatchmakingService) {}

    @Post('acceptDuel')
    acceptDuel(@Body() body : any)
    {
        return this.matchmakingService.acceptDuel(body.id, body.other); 
    }

    @Post('start')
        async startSearch(@Body() body: any) {
            return this.matchmakingService.startSearch(body.id);
    }

    @Post('cancel')
    cancelSearch(@Body() body: any) {
        return this.matchmakingService.cancelSearch(body.id);
    } 


    @Post('startSpecial')
        async startSearchSpecial(@Body() body: any) {
            return this.matchmakingService.startSearch(body.id, true);
    }

    @Post('cancelSpecial')
    cancelSearchSpecial(@Body() body: any) {
        return this.matchmakingService.cancelSearch(body.id, true);
    } 

    // @Post('search')
    //     async searchGame(@Body() playerid: number) {
    //         return this.matchmakingService.searchGame(playerid);
    //     }
}