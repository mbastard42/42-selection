import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Score } from 'src/app/class/score';
import { User } from 'src/app/class/user';
import { UserRequest } from 'src/app/network/user';


@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit{
  @Input() userName : string = "";

  userId : number = 0;
  gameScoreArray: Score[] = [];
  avatarArray: string[] = [];
  totalGame: number = 0;
  winGame: number = 0;
  level: {lvl: number, xp: number, rank: number} = {lvl: 0, xp: 0, rank: 0}; //rank = 0 - 3 = bronze, 4 - 7 = silver, 8 - 11 = gold, 12 - 15 = diamond, 16 - 19 = master, 20 = grand master


  async ngOnInit()
  {
    if (this.userName != "")
    {
      await this.updateScore();
      this.updateLevel();
      this.updateAvatar();
    }
  }

  constructor(public userRequest: UserRequest, private changeDetector: ChangeDetectorRef) {
    console.log("SCORE CONSTRCUTOR")
  }


  async updateAvatar() {
    for (let i = 0; i < this.totalGame; i++)
    {
      const id = this.gameScoreArray[i].users_id[0] == this.userId ? this.gameScoreArray[i].users_id[1] : this.gameScoreArray[i].users_id[0];
      const avatar = await this.userRequest.getAvatar(id);
      this.avatarArray.push(avatar ? avatar : "");
    }
  }

  async updateScore() {
    await this.getUserId();

    await this.getScoreFromServer();
  }
 

  updateLevel() {
    const exp = this.getLevel(this.getExp());
    const rank = this.getRank();
    this.level = {lvl: exp.lvl, xp: exp.xp, rank: rank};
  }

  getAvatar(game: Score)
  {
    const index = this.gameScoreArray.indexOf(game);
    return this.avatarArray[index];
  }

  getProgress() {
    const xp = this.level.xp;
    const lvl = this.level.lvl;

    const xpNeed = 50 + (lvl - 1) * 15;
    return Math.ceil((xp / xpNeed) * 100);
  }


  getLevel(xp: number): {lvl: number, xp: number}
  {
    let lvl = 1;
    let xpNeed = 50;
    while (xp >= xpNeed)
    {
      xp -= xpNeed;
      xpNeed += 15;
      lvl++;
    }
    return {lvl: lvl, xp: xp};
  }


  getRank() {
    let score = 0;
    for (let i = 0; i < this.totalGame; i++)
    {
      if (this.gameScoreArray[i].winner_id == this.userId)
        score += 2;
      else if (score > 0)
        score--;
    }
    return score / 10;
  }

  getRankLabel(rank: number) {
    const threshold = [3, 6, 9, 12, 15];
    const rankLabel = ["bronze", "silver", "gold", "diamond", "master"];
    for (let i = 0; i < threshold.length; i++)
    {
      if (rank < threshold[i])
      return `${rankLabel[i]} ${Math.ceil(threshold[i] - rank)}`;
    }
    return 'grand master'
  }

  getExp() //2XP PER LOSE GAME AND 6XP PER WIN GAME
  {
    return this.totalGame * 2 + this.winGame * 4;
  }

  async getUserId() {
    const id = await this.userRequest.getUserIdFromUsername(this.userName);
    console.log("score getuserId : " + id + " for username: " + this.userName);
    if (id)
    {
      this.userId = id;
    }
  }


  async getScoreFromServer() {
    const scores = await this.userRequest.getUserScore(this.userId)
    console.log("score getScoreFromServer : " + scores);
    if (scores)
    {

      this.gameScoreArray = scores;
      this.gameScoreArray.reverse();
      this.totalGame = this.gameScoreArray.length;
      this.updateTotalWin();
    }
  }

  getOtherUsername(score: Score) {
    if (score.users_id[0] == this.userId)
      return score.users_username[1];
    return score.users_username[0];
  }

  isUserWin(score: Score) {
    if (score.winner_id == this.userId)
      return "win";
    return "lose";
  }


  updateTotalWin() {
    for (let i = 0; i < this.totalGame; i++)
    {
      if (this.gameScoreArray[i].winner_id == this.userId)
        this.winGame++;
    }
  }

  getScoreArray() {
    return this.gameScoreArray;
  }

  getTotalGame() {
    return this.totalGame;
  }

  getWinGame() {
    return this.winGame;
  }

  getWinRate() {
    if (this.totalGame > 0)
      return Math.ceil(((this.winGame / this.totalGame) * 100));
    return 0;
  }

  getHeader()
  {
    return {
      headers: {'user': JSON.stringify(this.userId)}
    };
  }

}
