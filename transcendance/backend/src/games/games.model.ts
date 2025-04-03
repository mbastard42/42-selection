import { ScoreService } from "src/database/score/score.service";
import { SocketService } from "src/socket/socket.service";

export class Game {
    id: number;

    //-----------NON SENDABLE VARIABLES-----------
    paddleSpeed: number;
    ballSpeed: number;
    ballDir: [number, number];

    //-----------SENDABLE VARIABLES-----------
    players : Array<number>;
    score: [number, number];
    paddlePos: [number, number];
    paddleSize: number;
    ballPos : [number, number];
    ballSize : number
    gameStatus: number; // 0 en cours, 1 pause, 2 fini 
    labelText: string;


    constructor() {
        this.id = 0;
        this.players = [0, 0];
        this.score = [0, 0];
        this.paddlePos = [0, 0];
        this.paddleSize = 15;
        this.paddleSpeed = 1;
        this.ballPos = [0, 0];
        this.ballDir = [1, 0];
        this.ballSize = 1.3;
        this.ballSpeed = 1.15;
        this.gameStatus = 2;
        this.labelText = "";
    }

    async startGame() {
        this.gameStatus = 1;
        this.resetGame(3000, "Démarrage dans ");
        this.gameLoop();
    }

    async gameLoop()
    {
        while (this.gameStatus != 2) {
            if (this.gameStatus == 0)
                this.gameUpdate();
            else if (this.gameStatus == 1)
                await this.checkScore();
            await new Promise(resolve => setTimeout(resolve, 1000 / 60));
        }
    }

    gameUpdate() {
        this.checkCollision();
        this.moveBall();
    }

    moveBall() {
        this.ballPos[0] += this.ballDir[0] * this.ballSpeed;
        this.ballPos[1] += this.ballDir[1] * this.ballSpeed;
    }

    async checkScore() {
        if (this.score[0] >= 8 || this.score[1] >= 8)
            this.endGame();
        else
            await this.resetGame(3000, "Round " + (this.score[0] + this.score[1] + 1) + " dans ");
    }

    endGame() {
        this.gameStatus = 2;
        this.labelText = "Fin de la partie";
    }

    async resetGame(startTimer : number, label : string = "") {
        const dir = Math.random() > 0.5 ? 1 : -1;
        this.ballPos = [50, 50];
        this.ballDir = [dir, 0];
        this.paddlePos = [50, 50];
        for (let i = 0; i < startTimer / 1000; i++) {
            this.labelText = label + (startTimer / 1000 - i) + " secondes";
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        this.gameStatus = 0;
    }

    executeAction(id: number, action: any) {}

    getUserIndex(id: number) : number {
        return this.players.indexOf(id);
    }

    paddleMove(pad: number, direction: number) {
        const vec = this.getPaddleVector(pad);
        if (this.gameStatus == 0 && vec[0] + direction * this.paddleSpeed > 0 && vec[1] + direction * this.paddleSpeed < 100)
            this.paddlePos[pad] += direction * this.paddleSpeed;
    }

    getPaddleVector(pad : number) : [number, number] {
        return [this.paddlePos[pad], this.paddlePos[pad] + this.paddleSize];
    }
    checkCollision() {
        if (this.ballPos[0] <= this.ballSize / 2 && this.ballPos[1] >= this.getPaddleVector(0)[0] && this.ballPos[1] <= this.getPaddleVector(0)[1])
            this.rebound();
        else if (this.ballPos[0] > 100 - this.ballSize * 1.5 && this.ballPos[1] >= this.getPaddleVector(1)[0] && this.ballPos[1] < this.getPaddleVector(1)[1])
            this.rebound()
        else if (this.ballPos[0] < 0)
            this.goal(1)
        else if (this.ballPos[0] + this.ballSize > 100)
            this.goal(0);
        else if (this.ballPos[1] + this.ballSize > 100 || this.ballPos[1] < 0)
            this.ballDir[1] *= -1;
    }

    async goal(index : number)
    {
        this.gameStatus = 1;
        this.score[index]++;
    }

    rebound()
    {
        this.ballDir[0] *= -1;
        this.ballDir[1] = Math.random() * 2 - 1;
    }

    isGameFinished() : boolean {
        return this.gameStatus == 2;
    }

    toJson(playerId: number = -1) : {} {
        return {
            players: this.players,
            score: this.score,
            paddlePos: this.paddlePos,
            paddleSize : this.paddleSize,
            ballPos: this.ballPos,
            ballSize: this.ballSize,
            gameStatus: this.gameStatus,
            label: this.labelText,
        };
    }
}