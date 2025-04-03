import { Game } from "../games.model";

export class SpecialGames extends Game{
    map : number = 0;
    powerUpState : [Array<number>, Array<number>] = [[1, 1, 1, 1], [1, 1, 1, 1]] //[userIndex, userIndex] | [IBS, BM, IMS, DMS] STATE (0 IN USE, 1 READY)
    powerUp : Array<Function>;

    constructor() {
        super();
        this.powerUp = [this.IncreaseBallSpeed, this.BallMinimize, this.IncreaseMoveSpeed, this.DecreaseMoveSpeed]
    }

    //-------------------POWER UP-----------------
    IncreaseBallSpeed = async ()  =>
    {
        this.ballSpeed *= 1.5;
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.ballSpeed /= 1.5;
    }

    BallMinimize = async () =>
    {
        this.ballSize /= 2;
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.ballSize *= 2;    
    }

    IncreaseMoveSpeed = async () =>
    {
        this.paddleSpeed *= 1.5
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.paddleSpeed /= 1.5
    }

    DecreaseMoveSpeed = async () =>
    {
        this.paddleSpeed /= 1.5
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.paddleSpeed *= 1.5
    }

    //----------------NEW FUNCTIONS-----------

    async usePowerUp(userIndex: number, powerIndex: number)
    {
        if (this.powerUpState[userIndex][powerIndex] == 1) //Si le powerUp numéro (powerindex) du joueur (userIndex) est pret
        {
            this.powerUpState[userIndex][powerIndex] = 0;
            await this.powerUp[powerIndex]();
            await new Promise(resolve => setTimeout(resolve, 5000));
            this.powerUpState[userIndex][powerIndex] = 1;
        }
    }

    resetPowerUp()
    {
        this.powerUpState[0] = [1, 1, 1, 1]
        this.powerUpState[1] = [1, 1, 1, 1]
    }


    //------------------EXISTING FUNCTIONS----------------

    executeAction(id: number, action: any) {
        // if (this.gameStatus == 1)
            this.usePowerUp(this.getUserIndex(id), action);
    }

    toJson(playerId: number = -1) : {} {
        let powerState = [];
        if (playerId > -1)
            powerState = this.powerUpState[this.getUserIndex(playerId)];
        return {
            players: this.players,
            score: this.score,
            paddlePos: this.paddlePos,
            paddleSize : this.paddleSize,
            ballPos: this.ballPos,
            ballSize: this.ballSize,
            gameStatus: this.gameStatus,
            label: this.labelText,
            powerUpState: powerState
        };
    }
}