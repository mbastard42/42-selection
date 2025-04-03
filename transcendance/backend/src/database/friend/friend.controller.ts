import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { Friend } from "./friend.entity";
import { TokenMiddleware } from "src/middleware";

@Controller('friends')
export class FriendController {

    constructor(private readonly friendService: FriendService) {}
    
    @Post('checkStatus')
    async checkStatus(@Body() body: any): Promise<number> {
        return this.friendService.checkStatus(body.id, body.friend_id);
    }

    @Post('add')
    async addFriend(@Body() body: any): Promise<number> {
        this.friendService.requestFriend(body.id, body.friend_id);
        return 200;
    }

    @Post('remove')
    async removeFriend(@Body() body: any): Promise<number> {
        if (body.id === body.friend_id)
            return 400;
        this.friendService.removeFriend(body.friend_id, body.id);
        this.friendService.removeFriend(body.id, body.friend_id);
        return 200;
    }

    @Post('cancel')
    async cancelRequest(@Body() body: any): Promise<number> {
        this.friendService.removeRequest(body.id, body.friend_id);
        return 200;
    }
    
    @Get()
    async findAll(): Promise<any> {
        return this.friendService.findAll();
    }

    @Post('getFriendList')
    async getFriendList(@Body() body: any) : Promise<{list : string[], status : number[]}>
    {
        return this.friendService.getFriendList(body.id);
    }

    @Post('userid')
    async findByUserId(@Body() body: any): Promise<Friend> {
        return this.friendService.findByUserId(body.id);
    }
}