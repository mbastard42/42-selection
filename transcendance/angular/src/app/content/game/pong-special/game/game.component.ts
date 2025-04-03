import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { PongRequest } from 'src/app/network/pong';
import { NavService } from 'src/app/services/nav/nav.service';
import { PongService } from 'src/app/services/pong/pong.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-special-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class SpecialPongGameComponent implements OnInit, OnDestroy{

  selectedPower: number = 0;
  doMove : boolean = false;
  moveDirection : number = 0; // 0 = up, 1 = down
  gameLoopInterval : any;

  constructor(
      private readonly pongRequest: PongRequest,
      private socketService: SocketService,
    private readonly pongService: PongService,
    private readonly navService: NavService) {
      this.navService.setElem({id: 'game_div/game/pong-special/play', 
      downBehavior: this.movePaddleDown, 
      upBehavior: this.movePaddleUp, 
      leftBehavior: this.leftSelectPower,
      rightBehavior: this.rightSelectPower,
      nextBehavior: this.executePower,
      })

      this.navService.setDefaultElem('game_div', '/game/pong-special/play');

      this.gameLoopInterval = setInterval(() => {
        if (this.doMove)
        {
            if (this.moveDirection == 0)
                this.pongRequest.movePaddleUp();
            else if (this.moveDirection == 1)
                this.pongRequest.movePaddleDown();
        }
    }, 1000 / 60);

  }

  ngOnInit() {
      this.pongRequest.joinPong()
  }

  ngOnDestroy() {
      this.pongRequest.leavePong()
  }


  //---------------PLAYER ACTION----------------

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
      if (event.key == "z")
          this.moveDirection = 0;
      else if (event.key == "s")
          this.moveDirection = 1;
      else
          this.moveDirection = -1;
      this.doMove = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent) {
      this.doMove = false;
  }

  movePaddleUp = () => {
    // this.pongRequest.movePaddleUp();
    this.socketService.movePaddleUp();
}

movePaddleDown = () => {
    this.socketService.movePaddleDown();
    // this.pongRequest.movePaddleDown();
}

  leftSelectPower = () => {
    if (this.selectedPower > 0)
      this.selectedPower--;
  }
  
  rightSelectPower = () => {
    if (this.selectedPower < this.pongService.powerStatus.length - 1)
      this.selectedPower++;
  }

  executePower = () => {
    if (this.pongService.powerStatus[this.selectedPower] == 1)
      this.pongRequest.executePower(this.selectedPower);
  }
  

  //----------------GETTER-------------

  doShowLabel() {
    return this.pongService.gameStatus > 0;
  }

  getPowerStatus(){
    return this.pongService.powerStatus;
  }

  getPaddleSize() {
      return this.pongService.paddleSize;
  }

  getBallSize() {
      return this.pongService.ballSize;
  }

  getLabel(){
      return this.pongService.label;
  }

  isPlayerActive(index: number){
      return this.pongService.activePlayers[index];
  }

  getBallTop() {
      return this.pongService.ballPos[1] ;
  }

  getBallLeft() {
      return this.pongService.ballPos[0];
  }

  getPaddleTop1() {
      return this.pongService.paddlePos[0];
  }

  getPaddleTop2() {
      return this.pongService.paddlePos[1];
  }

  getFirstPlayerScore() {
      return this.pongService.score[0];
  }

  getSecondPlayerScore() {
      return this.pongService.score[1];
  }

  getFirstPlayerId() {
      return this.pongService.playersid[0];
  }

  getSecondPlayerId() {
      return this.pongService.playersid[1];
  }

  getFirstPlayerName() {
      return this.pongService.playersName[0];
  }

  getSecondPlayerName() {
      return this.pongService.playersName[1];
  }

  getFirstPlayerAvatar() {
      return this.pongService.playersAvatar[0];
  }

  getSecondPlayerAvatar() {
      return this.pongService.playersAvatar[1];
  }

  isGameEnded() {
      return this.pongService.gameStatus == 2;
  }

}
