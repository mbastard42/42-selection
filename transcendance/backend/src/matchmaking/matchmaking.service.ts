import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/database/chat/chat.service';
import { SocketService } from 'src/socket/socket.service';
import { GamesService } from 'src/games/games.service';
import { UserService } from 'src/database/user/user.service';

@Injectable()
export class MatchmakingService {

    private searchQueue: number[] = [];

    private specialsearchQueue: number[] = [];


    constructor (
        private gameService: GamesService, 
        private readonly socketService : SocketService, 
        private readonly chatService : ChatService,
        private readonly userService: UserService,
        ) {}

    acceptDuel(userId : number, otherId : number) : number
    {
        if (!this.userService.hasConnectedUser(userId) || !this.userService.hasConnectedUser(otherId))
            return 404; //Le joueur ayant effectué la demande n'est plus connecté
        else if (!this.chatService.UserIsActive(otherId))
            return 400; //Le joueur n'est plus dans la conversation
        else if (this.gameService.isUserInGame(userId))
            return 401;
        else if (this.gameService.isUserInGame(otherId))
            return 402;
        else if (userId == otherId)
            return 403
        this.gameService.newGame(userId, otherId);
        this.socketService.launchPongApp(userId);
        this.socketService.launchPongApp(otherId);
        return 200;
    }

    async startSearch(id: number, specialGame : boolean = false) {
        let retry = 100;
        let queue : number[] = this.searchQueue;
    
        if (specialGame)
            queue = this.specialsearchQueue
        if (queue.includes(id))
        queue = queue.filter(queueId => queueId != id)
        queue.push(id);
        while (retry-- > 0) {
            if (queue.find(playersid => playersid == id) == null)
            {
                if (this.gameService.getGameOfPlayer(id) != null)
                    return 200;
            }
           else  if (queue.length > 1) { //  && queue[0] != id && queue[1] == id
                this.gameService.newGame(queue.shift(), queue.shift(), specialGame);
                return 200;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        this.cancelSearch(id);
        return 0;
    }

    cancelSearch(id: number, specialGame : boolean = false) {
        if (specialGame)
            this.specialsearchQueue.splice(this.specialsearchQueue.indexOf(id), 1);
        else
            this.searchQueue.splice(this.searchQueue.indexOf(id), 1);
        return 200;
    }
}
