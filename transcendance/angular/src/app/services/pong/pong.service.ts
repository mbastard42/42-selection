import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/class/user';
import { AuthRequest } from 'src/app/network/auth';
import { SocketService } from '../socket/socket.service';
import { SettingsService } from '../settings/settings.service';
import { UserRequest } from 'src/app/network/user';
import { NavService } from '../nav/nav.service';

@Injectable({
  providedIn: 'root'
})
export class PongService {

  playersName = Array<string>(2);
  playersAvatar = Array<string>(2);

  activePlayers = Array<boolean>(2);

  playersid = [0, 0];
  paddlePos = [0, 0]
  paddleSize = 15;
  ballPos = [0, 0];
  ballSize = 2;
  score = [0, 0];
  gameStatus = 0;
  label : string = "";

  powerStatus : number[] = [];

  constructor(
    private readonly userRequest: UserRequest,
    private readonly navService: NavService
  ) {}

  //------------------METHODS-----------------

  setUpPong(pongJson : {
    id : number,
    players: [number, number],
    score: [number, number],
    paddlePos: [number, number],
    paddleSize : number,
    ballPos: [number, number],
    ballSize: number,
    gameStatus: number,
    label: string,
    powerUpState: number[],
  }){
    this.playersid = pongJson.players;
    this.score = pongJson.score;
    this.paddlePos = pongJson.paddlePos;
    this.paddleSize = pongJson.paddleSize;
    this.ballPos = pongJson.ballPos;
    this.ballSize = pongJson.ballSize;
    this.gameStatus = pongJson.gameStatus;
    this.label = pongJson.label;
    this.powerStatus = pongJson.powerUpState ? pongJson.powerUpState : [];
  }

  updatePowerStatus(powerStatus : number[])
  {
    this.powerStatus = powerStatus;
  }

  async updatePlayersName() {
    const res = await this.userRequest.getUser(this.playersid[0]);
    if (res)
        this.playersName[0] = res.name;
    const res2 = await this.userRequest.getUser(this.playersid[1]);
    if (res2)
        this.playersName[1] = res2.name;
}

  updatePlayersAvatar() {
    this.userRequest.getAvatar(this.playersid[0]).then((avatar) => {
        this.playersAvatar[0] = avatar!;
    });
    this.userRequest.getAvatar(this.playersid[1]).then((avatar) => {
        this.playersAvatar[1] = avatar!;
    });
  }

  async updatePlayers(playersId : [number, number], activeUsers : Array<boolean>)
  {
    this.playersid = playersId;
    this.activePlayers = activeUsers;
    await this.updatePlayersName();
    this.updatePlayersAvatar();
  }

  updatePostions(paddlePos : number[], ballPos : number[])
  {
    console.log("UPDATE POS")
    this.paddlePos = paddlePos;
    this.ballPos = ballPos;
  }


  updateGameStatus(score: number[], status : number, label: string)
  {
    this.score = score;
    this.gameStatus = status;
    this.label = label;
    if (this.gameStatus == 2)
      this.endGame();
  }

  // ------------------GAME-------------------

  async endGame()
  {
    setTimeout(() => {
      this.playersid = [0, 0];
      this.paddlePos = [0, 0];
      this.ballPos = [0, 0];
      this.playersAvatar = ["", ""];
      this.playersName = ["", ""];
      this.activePlayers = [false, false];
      this.ballSize = 2;
      this.paddleSize = 15;
      this.gameStatus = 0;
      this.label = "";
      this.score = [0, 0];
      this.powerStatus = [];
      this.navService.navigateToId('classic_game/game');
    }, 3000);
  }
}
