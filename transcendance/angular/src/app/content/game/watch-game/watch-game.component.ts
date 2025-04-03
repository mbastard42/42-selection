import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PongRequest } from 'src/app/network/pong';
import { UserRequest } from 'src/app/network/user';
import { NavService } from 'src/app/services/nav/nav.service';
import { RootingService } from 'src/app/services/rooting/rooting.service';

@Component({
  selector: 'app-watch-special-game',
  templateUrl: './watch-game.component.html',
  styleUrls: ['./watch-game.component.css']
})

export class WatchGameComponent {
  @Input() gameId : number = -1;

  playersName = Array<string>(2);
  playersAvatar = Array<string>(2);

  playersid = [0, 0];
  paddlePos = [0, 0]
  paddleSize = 10;
  ballPos = [0, 0];
  ballSize = 0;
  score = [0, 0];
  gameStatus = 0;
  label : string = "";

  ngOnInit()
  {
    const gameId = this.rooter.snapshot.paramMap.get('gameId');
    if (gameId)
      this.gameId = parseInt(gameId);
    this.navService.setElem({id: 'game_div/game/watch/' + gameId, next: this.navService.head?.prev?.route!, prev: this.navService.head?.prev?.route!})

    this.navService.setDefaultElem('game_div', '/game/watch/' + gameId);
      this.setUpGame();
      this.gameLoop();
  }

  async setUpGame() {
    await this.updateInfos();
    await this.updatePlayersName();
    this.updatePlayersAvatar();
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
  constructor(private readonly pongRequest: PongRequest, 
    private readonly rooter: ActivatedRoute, 
    private readonly navService: NavService,
    private userRequest: UserRequest
    ) {
  }

  //---------------LOGIC-----------------------


  async gameLoop() {
    while (this.gameStatus != 2)
    {
      await this.updateInfos();
      await new Promise(resolve => setTimeout(resolve, 20));
      if (this.gameStatus == 2)
        this.endGame();
    }
  }

  async updateInfos()
  {
    const data = await this.pongRequest.updateInfosFromGame(this.gameId);
    if (data)
    {
      this.paddlePos = data.paddlePos;
      this.paddleSize = data.paddleSize;
      this.ballPos = data.ballPos;
      this.score = data.score;
      this.gameStatus = data.gameStatus;
      this.ballSize = data.ballSize;
      this.playersid = data.players;
      this.label = data.label;
    }
  }

  async endGame() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.navService.next();
  }

  //---------------PLAYER ACTION----------------

  // @HostListener('document:keydown', ['$event'])
  // paddleMove( event: KeyboardEvent ) {
  //     if (event.key == "ArrowUp")
  //       this.pongRequest.movePaddleUp();
  //     else if (event.key == "ArrowDown")
  //       this.pongRequest.movePaddleDown();
  // }

  //----------------GETTER-------------

  doShowLabel() {
    return this.gameStatus > 0;
  }

  getBallTop() {
    return this.ballPos[1] ;
  }

  getBallLeft() {
    return this.ballPos[0];
  }

  getPaddleTop1() {
    return this.paddlePos[0];
  }

  getPaddleTop2() {
    return this.paddlePos[1];
  }

  getFirstPlayerScore() {
    return this.score[0];
  }

  getSecondPlayerScore() {
    return this.score[1];
  }

  getFirstPlayerId() {
    return this.playersid[0];
  }

  getSecondPlayerId() {
    return this.playersid[1];
  }

  getFirstPlayerName() {
    return this.playersName[0];
}

getSecondPlayerName() {
    return this.playersName[1];
}

getFirstPlayerAvatar() {
    return this.playersAvatar[0];
}

getSecondPlayerAvatar() {
    return this.playersAvatar[1];
}

isGameEnded() {
  return this.gameStatus == 2;
}
}
