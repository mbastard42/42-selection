import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Score } from "./score.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";

@Injectable()
export class ScoreService {
    
    constructor(
        @InjectRepository(Score)
        private readonly gameRepository: Repository<Score>,
        private readonly userService: UserService
        ) {}

    async create(users_id: number[], score: number[]): Promise<Score> {
        let game = new Score();
        game.users_id = users_id;
        game.score = score;
        game.winner_id = game.users_id[this.getMaxScoreIndex(score)];
        game.users_username = await this.getUsersUsername(users_id);
        game = this.gameRepository.create(game);
        return this.gameRepository.save(game);
    }

    async getUsersUsername(users_id : number[]): Promise<string[]> {
        let users_username : string[] = [];
        for (let i = 0; i < users_id.length; i++) {
            users_username.push((await this.userService.findById(users_id[i])).name);
        }
        return users_username;
    }

    getMaxScoreIndex(score: number[]): number {
        let max = 0;
        let index = 0;
        for (let i = 0; i < score.length; i++) {
            if (score[i] > max) {
                max = score[i];
                index = i;
            }
        }
        return index;
    }

    async findAll(): Promise<Score[]> {
        return this.gameRepository.find();
    }

    async findAllByUserId(id: number): Promise<Score[]> {
        const scoreList = await this.gameRepository.find();
        let returnList = [];
        for (let i = 0; i < scoreList.length; i++) {
            if (scoreList[i].users_id.includes(id)) {
                returnList.push(scoreList[i]);
            }
        }
        return returnList;
    }
}