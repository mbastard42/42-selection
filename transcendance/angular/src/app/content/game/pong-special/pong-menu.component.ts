import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PongRequest } from 'src/app/network/pong';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/nav/nav.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({

    selector: 'app-pong-special-game',
    templateUrl: './pong-menu.component.html',
    styleUrls: ['./pong-menu.component.css']

}) export class SpecialPongMenuComponent{

    isGameSearch: boolean;
    doInGame: boolean;
    doWatchSearchGame: boolean; 
    label : string = "";

    CurrentGames : Array<{id : number, players: string[]}> = [];
    
    @ViewChild('gameWatchScrollContainer') gameWatchScrollContainer!: ElementRef;
    @ViewChild('gameWatchDiv') gameWatchDiv!: ElementRef;

    constructor(private readonly pongRequest: PongRequest, private readonly authService: AuthService, private readonly userService : UserService, private readonly navService: NavService, private readonly router: Router) {
        
        this.navService.setElem({id: 'play_game/game/pong-special', nextBehavior: this.searchOrJoinGame, down: 'watch_game/game/pong-special', next: 'cancel_search/game/pong-special',  prev: 'classic_game/game'})
        this.navService.setElem({id: 'watch_game/game/pong-special', nextBehavior: this.searchCurrentGamesWatch, up: 'play_game/game/pong-special', next: 'cancel_search/game/pong-special', prev: 'classic_game/game'}),
        this.navService.setElem({id: 'cancel_search/game/pong-special', nextBehavior: this.cancelAction, next: 'play_game/game/pong-special'})
        
        this.navService.setDefaultElem('play_game', '/game/pong-special');

        this.isGameSearch = false;
        this.doInGame = false;
        this.doWatchSearchGame = false;
        this.doInGameRequest()
    }
    searchOrJoinGame = () => {
        
        if (this.doInGame)
          this.goInGame();
        else
          this.searchGame();
        this.navService.next();
    }

    async searchGame() {
        
        this.isGameSearch = true;
        this.doInGame = false;
        this.label = "Searching for oponnent...";
        this.joinMatchmaking();
    }

    searchCurrentGamesWatch = async () => {
        
        this.doWatchSearchGame = true;
        this.label = "Loading games..."
        this.navService.next();
        this.CurrentGames = await this.getCurrentGamesFromServer();
        // this.CurrentGames = this.generateFakeGames();
        this.generateNavElements(this.CurrentGames);
        this.label = "";
        if (this.CurrentGames.length == 0)
          this.label = "No game found !"
        if (this.CurrentGames.length > 0)
          this.navService.setElem({id: 'cancel_search/game/pong-special', down: 'watch_game_id' + this.CurrentGames[0].id + '/game/pong-special'})
    }

    cancelAction = () => {

        if (this.doWatchSearchGame)
        this.cancelWatchGameSearch();
        else if (this.isGameSearch)
        this.cancelSearchGame();
        this.label = "";
        this.navService.next();
    }

    async cancelSearchGame() {
        
        this.isGameSearch = false;
        this.leftMatchmaking();
    }

    cancelWatchGameSearch() {

        this.doWatchSearchGame = false;
        this.navService.setElem({id: 'cancel_search/game/pong-special', nextBehavior: this.cancelAction, next: 'play_game/game/pong-special', down: 'cancel_search/game/pong-special'})
    }


    generateFakeGames() :  Array<{id : number, players: string[]}> {
        
        const games :  Array<{id : number, players: string[]}> = [];

        for (let i = 1; i < 30; i++)
        games.push({id: i, players: ["user", "user2"]})
        return games;
    }

  generateNavElements(games : Array<{id : number, players: string[]}>) : void
  {
    let lastId = 'cancel_search/game/pong-special';
    for (let i = 0; i < games.length; i++)
    {
      if (i == 0)
        this.navService.setElem
      this.navService.setElem({
        id: 'watch_game_id' + games[i].id + '/game/pong-special',
        next: 'game_div/game/watch/' + games[i].id,
        up: lastId,
        down: i == games.length - 1 ? 'watch_game_id' + games[i].id + '/game/pong-special' : 'watch_game_id' + games[i + 1].id + '/game/pong-special',
        upBehavior: this.scrollUpGameWatchDiv,
        downBehavior: this.scrollDownGameWatchDiv,
        nextBehavior: () => this.watchGame(games[i].id)
      })
      lastId = 'watch_game_id' + games[i].id + '/game/pong-special';
    }
  }

  scrollDownGameWatchDiv = () =>
  {
    const gameInfosHeight = this.gameWatchDiv.nativeElement.offsetHeight;
    this.gameWatchScrollContainer.nativeElement.scrollTop += gameInfosHeight;
    this.navService.moveDown();
  }

  scrollUpGameWatchDiv = () =>
  {
    const gameInfosHeight = this.gameWatchDiv.nativeElement.offsetHeight;
      this.gameWatchScrollContainer.nativeElement.scrollTop -= gameInfosHeight;
    this.navService.moveUp();
  }


  // ------------BUTTON ACTIONS--------------

  // @HostListener('document:keydown', ['$event'])
  // keypress(event: KeyboardEvent)
  // {
  //   if (event.key == 'b')
  //   {
  //     if (this.isGameSearch)
  //       this.cancelSearchGameButton();
  //     else if (this.watchGameId >= 0)
  //       this.watchGameId = -1;
  //     else if (this.doWatchSearchGame)
  //       this.doWatchSearchGame = false;
  //   }
  // }

  getGameName(players: Array<string>) : string
  {
    let name : string = "";

    for (let i = 0; i < players.length; i++)
    {
      name += players[i];
      if (i < players.length - 1)
        name += " - ";
    }
    return name;
  }

  getCurrentGames()
  {
    return this.CurrentGames;
  }

  async getCurrentGamesFromServer()
  {
    const res = await this.pongRequest.getCurrentGames();
    console.log("GETCURRENTGAMEFROMSERVER| res: " + res);
    if (res)
    {
      return res
    }
    return [];
  }

  rejoinGameButton() {
    this.doInGame = true;
  }

  watchGame = async (id: number) => {
    this.navService.setElem({id: 'game_div/game/watch/' + id, prev: 'play_game/game/pong'})
    this.navService.navigateToId('game_div/game/watch/' + id);
  }


  //-------------REQUEST------------------

  async joinMatchmaking()
  {
    const response = await this.pongRequest.joinSpecialMatchmaking();
    if (response)
    {
      if (response == 200 && this.isGameSearch)
        this.goInGame();
      this.isGameSearch = false;
    }
  }

  async goInGame()
  {
    const actualGameType = await this.pongRequest.gameType();
    if (actualGameType == undefined || actualGameType == -1)
      return
    if (actualGameType == 1)
      this.navService.navigateToId('game_div/game/pong/play')
    else if (actualGameType == 2)
      this.navService.navigateToId('game_div/game/pong-special/play')
  }

  async leftMatchmaking()
  {
    const response = await this.pongRequest.cancelSpecialMatchmaking();
      if (response && response == 200)
        this.isGameSearch = false;
  }

  //---------------GETTER-----------

  playButtonLabel()
  {
    if (this.doInGame)
      return "join current game"
    return "search game"
  }

  isSelected(id: string)
  {
    return this.navService.isSelected(id);
  }

  async doInGameRequest()
  {
    const isInGame = await this.pongRequest.isInGame(this.userService.getUser().id)
    if (isInGame != undefined)
      this.doInGame = isInGame;
  }

  isLogged() {
    return this.authService.isLogIn();
  }

  isSearchingGame() {
    return this.isGameSearch;
  }

  isMainMenu()
  {
    return !this.isGameSearch && !this.doInGame;
  }

  isInGame()
  {
    return this.doInGame;
  }

  isSearchWatching()
  {
    return this.doWatchSearchGame;
  }

  naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
  press(id: string): void {this.navService.keyService.press({id: id}, true);}
}
