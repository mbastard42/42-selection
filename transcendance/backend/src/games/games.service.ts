import { Injectable } from '@nestjs/common';
import { Game } from './games.model';
import { ScoreService } from 'src/database/score/score.service';
import { UserService, UserStatus } from 'src/database/user/user.service';
import { SpecialGames } from './specialGames/specialGames.model';
import { SocketService } from 'src/socket/socket.service';
import { stat } from 'fs';

@Injectable()
export class GamesService {
    private activeUsers: number[] = [];
    private currentGames: (Game | SpecialGames)[] = [];

    constructor(private readonly scoreService: ScoreService, private readonly userService: UserService, private readonly socketService : SocketService) {
        setInterval(() => {
            this.checkActiveUsers();
            if (this.currentGames.length > 0)
                this.checkGamesStatus();
        }, 20);
    }

    async executeAction(id : number, action: any)
    {
        const game = this.getGames().find(Game => Game.players.indexOf(id) != -1);
        if (game) {
            game.executeAction(id, action)
            return 200;
        }
        return 0;    
    }

    async joinCurrentGame(userId: number) : Promise<number>
    {
        const game = this.getGameOfPlayer(userId);
        if (game)
        this.activeUsers.push(userId);
        this.userService.setConnectedUserStatus(userId, UserStatus.GAME);
        if (game)
        {
            this.socketService.sendPongPlayers(game.players, this.getActiveUsersArray(game.players));
            this.socketService.sendPong(game);
        }
        return 200;
    }

    async leaveCurrentGame(userId: number) : Promise<number>
    {
        const game = this.getGameOfPlayer(userId);
        let status = 200;
        if (!game)
            status =  400;
        this.activeUsers.splice(this.activeUsers.indexOf(userId), 1);
        this.userService.setConnectedUserStatus(userId, UserStatus.ONLINE);
        if (game)
            this.socketService.sendPongPlayers(game.players, this.getActiveUsersArray(game.players));
        return status;
    }

    getActiveUsersArray(gamePlayers: Array<number>) : Array<boolean>
    {
        let activeArray = [];
        for (let i = 0; i < gamePlayers.length; i++)
            activeArray.push(this.activeUsers.includes(gamePlayers[i]));
        return activeArray;
    }

    async getCurrentGames()
    {
        let gameList = new Array<{
            id : number,
            players : Array<string>
        }>

        for (let i = 0; i < this.currentGames.length; i++)
        {
            const id = this.currentGames[i].id;
            let usernames : Array<string> = new Array<string>;
            for (let k = 0; k < this.currentGames[i].players.length; k++)
                usernames.push(await this.userService.getUsername(this.currentGames[i].players[k]))
            gameList.push({id: id, players: usernames})
        }

        return gameList
    }

    isUserInGame(userId: number) : boolean {
        for (let i = 0; i < this.currentGames.length; i++) {
            if (this.currentGames[i].players[0] == userId || this.currentGames[i].players[1] == userId)
                return true;
        }
        return false;
    }

    checkActiveUsers() {
        for (let i = 0; i < this.activeUsers.length; i++) {
            if (!this.userService.hasConnectedUser(this.activeUsers[i]))
                this.leaveCurrentGame(this.activeUsers[i]);
        }
    }
    
    checkGamesStatus() {
        for (let i = 0; i < this.currentGames.length; i++) {
            const game = this.currentGames[i];
            if (this.currentGames[i].isGameFinished()) {
                this.finishGame(game, i);
            } if (game.gameStatus == 1)
                this.socketService.sendPongStatus(game.players, game.score, game.gameStatus, game.labelText);
            else
                this.socketService.sendPong(game)
        }
    }

    finishGame(game: Game, index: number) {
        this.socketService.sendPongStatus(game.players, game.score, game.gameStatus, game.labelText);
        this.saveGameScore(game);
        for (let i = 0; i < game.players.length; i++)
            this.leaveCurrentGame(game.players[i]);
        this.currentGames.splice(index, 1);   
    }

    saveGameScore(game: Game) {
        this.scoreService.create(game.players, game.score);
    }

    newGame(idPlayer1: number, idPlayer2: number, isSpecialGame : boolean = false) {
        let newGame : Game | SpecialGames;

        if (!isSpecialGame)
            newGame = new Game();
        else
            newGame = new SpecialGames();
        newGame.id = this.currentGames.length;
        newGame.players = [idPlayer1, idPlayer2];
        newGame.startGame();

        this.currentGames.push(newGame);
        return newGame;
    }

    paddleMove(id: number, direction: number) : number {
        const game = this.getGames().find(Game => Game.players.indexOf(id) != -1);
        if (game) {
            game.paddleMove(game.players.indexOf(id), direction);
            return 200;
        }
        return 0;
    }

    getGames() {
        return this.currentGames;
    }

    getGameOfPlayer(userId: number) : any {
       for (let i = 0; i < this.currentGames.length; i++) {
           if (this.currentGames[i].players[0] == userId || this.currentGames[i].players[1] == userId)
                return this.currentGames[i];
       }
        return null;
    }

    getGame(id: number) {
        return this.currentGames.find(Game => Game.id === id);
    }
    

}
