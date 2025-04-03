import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friend } from "./friend.entity";
import { Repository } from "typeorm";
import { FriendRequestService } from "src/friend-request/friend-request.service";
import { UserService } from "../user/user.service";
import { ChatService } from "../chat/chat.service";

@Injectable()
export class FriendService {
    
    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        private readonly friendRequest : FriendRequestService,
        private readonly userService : UserService,
        private readonly chatService : ChatService,
    ){}

    async getFriendList(user_id: number): Promise<{list : string[], status : number[]}> {
        const friendList = await this.findByUserId(user_id);
        if (!friendList)
            return null;
        let friendListName = [];
        for (let i = 0; i < friendList.friends_id.length; i++) {
            friendListName.push(await this.userService.getUsername(friendList.friends_id[i]));
        }

        let statusList = [];
        for (let i = 0; i < friendList.friends_id.length; i++) {
            statusList.push(this.userService.getConnectedUserStatus(friendList.friends_id[i]));
        }
    
        return {list : friendListName, status : statusList};
    }

    async checkStatus(user_id: number, friend_id: number): Promise<number> { // 0 = pas ami, 1 = ami, 2 = demande envoyee, 3 = demande recue
        const friendList = await this.findByUserId(user_id);
        if (friendList && friendList.friends_id.includes(friend_id)) // Si le user_id est deja ami avec friend_id
            return 1;
        else if (this.friendRequest.searchRequest(user_id, friend_id)) // Si le user_id a deja envoye une demande d'ami a friend_id
            return 2;
        else if (this.friendRequest.searchRequest(friend_id, user_id)) // Si le user_id a deja recu une demande d'ami de friend_id
            return 3;
        else
            return 0;
    }

    async requestFriend(user_id: number, friend_id: number): Promise<number> {
        if (user_id === friend_id)
            return 401;
        if (this.friendRequest.searchRequest(user_id, friend_id)) //Si le user_id a deja envoye une demande d'ami a friend_id
            return 400;
        else if (this.friendRequest.searchRequest(friend_id, user_id)) //Si le user_id a deja recu une demande d'ami de friend_id
        {
            this.friendRequest.removeRequest(friend_id, user_id);
            this.addFriend(user_id, friend_id);
            this.addFriend(friend_id, user_id);
            return 201;
        }
        else
            this.friendRequest.addRequest(user_id, friend_id);
        return 200;

    }

    async removeRequest(user_id: number, friend_id: number): Promise<number> {
        if (this.friendRequest.searchRequest(user_id, friend_id))
        {
            this.friendRequest.removeRequest(user_id, friend_id);
            return 200;
        }
        return 400;
    }

    async addFriend(user_id: number, friend_id: number): Promise<Friend> {
        let friendList : Friend;
        
        friendList = await this.findByUserId(user_id);
        if (!friendList)
            friendList = await this.newFriend(user_id, [friend_id]);
        else
            friendList.friends_id.push(friend_id);
        return this.friendRepository.save(friendList);
    }

    async removeFriend(user_id: number, friend_id: number): Promise<Friend> {
        let friendList : Friend;
        
        friendList = await this.findByUserId(user_id);
        if (!friendList)
            return friendList;
        friendList.friends_id = friendList.friends_id.filter(item => item !== friend_id);
        return this.friendRepository.save(friendList);
    }

    async findByUserId(id: number): Promise<Friend> {
        const option = { where: { user_id: id } };
        const friend = await this.friendRepository.findOne(option);
        return friend;
    }

    async newFriend(user_id : number, friend_id : number[])
    {
        let friend = new Friend();
        friend.user_id = user_id;
        friend.friends_id = friend_id;
        friend = this.friendRepository.create(friend);
        return this.friendRepository.save(friend);
    }

    async create(friend: Friend): Promise<Friend> {
        friend = this.friendRepository.create(friend);
        return this.friendRepository.save(friend);
    }

    async findAll(): Promise<Friend[]> {
        return this.friendRepository.find();
    }
}