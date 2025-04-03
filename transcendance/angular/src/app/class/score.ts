export class Score {
    id : number;
    score: number[];
    users_id: number[];
    users_username: string[];
    winner_id: number;
  
    
    constructor(id : number, score: number[], users_id: number[], users_username: string[], winner_id: number) {
      this.id = id;
      this.score = score;
      this.users_id = users_id;
      this.users_username = users_username;
      this.winner_id = winner_id;
    }
  
    
}