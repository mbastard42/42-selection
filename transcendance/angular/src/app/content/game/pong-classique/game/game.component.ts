import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PongRequest } from 'src/app/network/pong';
import { NavService } from 'src/app/services/nav/nav.service';
import { PongService } from 'src/app/services/pong/pong.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({

    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']

})
export class PongGameComponent implements OnInit, OnDestroy{

    doMove : boolean = false;
    moveDirection : number = 0; // 0 = up, 1 = down
    gameLoopInterval : any;

    constructor(
        private readonly pongRequest: PongRequest,
        private socketService: SocketService,
        private readonly pongService: PongService,
        private readonly navService: NavService,
        ) {
        this.navService.setElem({id: 'game_div/game/pong/play', 
            // downBehavior: () => {this.moveDirection = 1; this.doMove = true;},
            // upBehavior: () => {this.moveDirection = 0; this.doMove = true;},
        //  upBehavior: this.movePaddleUp, 
        })

        this.navService.setDefaultElem('game_div', '/game/pong/play');

        this.gameLoopInterval = setInterval(() => {
            if (this.navService.keyService.pressedKeys.has(this.navService.keyService.getValues({id: 'up'})?.key ?? ''))
                this.movePaddleUp();
            else if (this.navService.keyService.pressedKeys.has(this.navService.keyService.getValues({id: 'down'})?.key ?? ''))
                this.movePaddleDown();
            // if (this.doMove)
            // {
            //     if (this.moveDirection == 0)
            //         this.pongRequest.movePaddleUp();
            //     else if (this.moveDirection == 1)
            //         this.pongRequest.movePaddleDown();
            // }
        }, 1000 / 60);

    }

    @HostListener('window:keyup', ['$event'])
    keyEventUp(event: KeyboardEvent) {
        this.doMove = false;
    }



    ngOnInit() {
        this.pongRequest.joinPong()
    }

    ngOnDestroy() {
        this.pongRequest.leavePong()
        clearInterval(this.gameLoopInterval);
    }


    movePaddleUp = () => {
        // this.pongRequest.movePaddleUp();
        this.socketService.movePaddleUp();
    }

    movePaddleDown = () => {
        this.socketService.movePaddleDown();
        // this.pongRequest.movePaddleDown();
    }

    //----------------GETTER-------------

    doShowLabel() {
        return this.pongService.gameStatus > 0;
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
