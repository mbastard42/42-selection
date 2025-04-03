import { Injectable } from '@nestjs/common';
import { UserService, UserStatus } from '../database/user/user.service';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatService } from '../database/chat/chat.service';
import { Chat } from '../database/chat/chat.entity';
import { Message } from '../database/message/message.entity';
import { MessageService } from '../database/message/message.service';
import { User } from 'src/database/user/user.entity';
import { FriendService } from 'src/database/friend/friend.service';
import { Game } from 'src/games/games.model';

@Injectable()
export class SocketService {
 
    server : Server;

    constructor (private userService : UserService,
      private messageService : MessageService,
      private chatService : ChatService,
      private friendService : FriendService
      ) {
    }

    getClientIdBySocketId(socketId: string) : number {
      return this.userService.getConnectedClientIdBySocketId(socketId);
    }

    getSocketByUserId(userId: number) : Socket {
      return this.userService.getConnectedSocketByUserId(userId);
    }

    hasUser(userId : number) : boolean {
      return this.userService.hasConnectedUser(userId);
    }

    setUser(userId : number, socket : Socket, status: UserStatus = UserStatus.ONLINE) {
      return this.userService.setConnectedUser(userId, socket, status);
    }

    removeClient(client : Socket) {
      return this.userService.removeConnectedClient(client);
    }

    setServer(server : any) {
      if (server == null)
        console.log("server is null")
      this.server = server;
    }

    isUserConnected(userId : number) : boolean {
      return this.hasUser(userId);
    }

    async handleUserConnect(client: Socket, token: string) {
        const user = await this.userService.findByToken(token);
        if (user != null)
        {
          if (this.hasUser(user.id))
            return 402; //user already connected
          this.setUser(user.id, client);
        }
        else
          return 401; //user not found
        return 200;
      }

    handleUserDisconnect(client: Socket) {
      this.chatService.removeActiveUser(this.getClientIdBySocketId(client.id))
      this.removeClient(client);
    }

    async handleLogin(client: Socket, email: string, password: string) {
        const response = await this.userService.login(email, password)
          if (response.status == 200)
          {
            const res = await this.handleUserConnect(client, response.token);
            if (res == 200)
              client.emit('login', response);
            else
              return res
          }
          return response.status;
      }

    sendNotifToClient(clientId: number, message: string) {
      let client = this.getSocketByUserId(clientId);
      if (client)
      {
        this.server.to(client.id).emit('notification', message, 1);
      }
    }

    // ------------------------FRIENDS------------------------//

    async addFriend(client: Socket, friendId: number) {
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      const res = await this.friendService.requestFriend(userId, friendId);
      if (res == 200)
        this.sendNotifToClient(friendId, "You have a new friend request from " + await this.userService.getUsername(userId));
      else if (res == 201)
      {
        this.sendNotifToClient(friendId, "You are now friend with " + await this.userService.getUsername(userId));
        this.sendNotifToClient(userId, "You are now friend with " + await this.userService.getUsername(friendId));
      }
      return res;
    }

    async removeFriend(client: Socket, friendId: number) {
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      this.friendService.removeFriend(userId, friendId);
      this.friendService.removeFriend(friendId, userId);
      this.sendNotifToClient(friendId, "You are no longer friend with " + await this.userService.getUsername(userId));
      this.sendNotifToClient(userId, "You are no longer friend with " + await this.userService.getUsername(friendId));
      return 200;
    }

    async cancelFriendRequest(client: Socket, friendId: number) {
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      this.friendService.removeRequest(userId, friendId);
      return 200;
    }

    // ------------------------CHAT------------------------//

    async sendChat(chatId : number) {
      let chat = await this.chatService.findById(chatId);
      let messages = await this.messageService.findByChatId(chatId);
      let users = this.chatService.getActiveUsers(chatId);
      if (chat && messages && users)
      {
        for (let user_id of users)
          this.sendChatToClient(user_id, chat);
        return 200;
      }
      return 402;
    } 

    async sendChatToClient(clientId: number, chat: Chat) {
      let client = this.getSocketByUserId(clientId);
      let messages = await this.messageService.findByChatId(chat.id);
      if (client && messages)
      {
        this.server.to(client.id).emit('chat', chat, messages);
      }
    }

    async chatKickUser(client : Socket, chatId: number, otherId: number){
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      const res = await this.chatService.CankickUser(chatId, userId, otherId)
      if (res != 200)
        return res;
      let kickedClient = this.getSocketByUserId(otherId);
      if (kickedClient)
        this.server.to(kickedClient.id).emit("chatKick")
      await this.messageService.createAnonce(chatId, await this.userService.getUsername(otherId) + " has been kicked")
      await this.sendChat(chatId);
      return res;
    }

    async chatBanUser(client : Socket, chatId: number, otherId: number){
      const userId = this.getClientIdBySocketId(client.id)
      if (!userId)
        return 400;
      const res = await this.chatService.banUser(chatId, userId, otherId)
      if (res != 200)
        return res;
      let bannedClient = this.getSocketByUserId(otherId);
      if (bannedClient)
        this.server.to(bannedClient.id).emit("chatBan")
      await this.messageService.createAnonce(chatId, await this.userService.getUsername(otherId) + " has been banned")
      await this.sendChat(chatId);
      return res;
    }

    async chatUnbanUser(client : Socket, chatId: number, otherId: number){
      const userId = this.getClientIdBySocketId(client.id)
      if (!userId)
        return 400;
      const res = await this.chatService.unbanUser(chatId, userId, otherId)
      if (res != 200)
        return res;
      let bannedClient = this.getSocketByUserId(otherId);
      if (bannedClient)
        this.server.to(bannedClient.id).emit("chatUnban")
      await this.messageService.createAnonce(chatId, await this.userService.getUsername(otherId) + " has been unbanned")
      await this.sendChat(chatId);
      return res;
    }

    async chatUpdateAdmin(client: Socket, chatId: number, otherId: number){
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      const res = await this.chatService.updateAdmin(chatId, userId, otherId);
      if (res == 200)
      {
        await this.messageService.createAnonce(chatId, await this.userService.getUsername(otherId) + " admin status haas been changed")
        await this.sendChat(chatId);
      }
      return res;
    }

    async joinChat(client: Socket, chatId: number) : Promise<number> {
      const res = await this.chatService.addActiveUser(chatId, this.getClientIdBySocketId(client.id));
      this.userService.setConnectedUserStatus(this.getClientIdBySocketId(client.id), UserStatus.CHAT);
      if (res == 200)
        this.sendChat(chatId);
      return res;
    }

    async leaveChat(client: Socket, chatId: number) : Promise<number> {
      this.chatService.removeActiveUserFromChat(chatId, this.getClientIdBySocketId(client.id));
      await this.messageService.removeCmdFromUser(chatId, this.getClientIdBySocketId(client.id));
      this.userService.setConnectedUserStatus(this.getClientIdBySocketId(client.id), UserStatus.ONLINE);
      this.sendChat(chatId);
      return 200;
    }

    async refreshChat(client: Socket, chatId: number) : Promise<number> {
      return this.sendChat(chatId);
    }

    async sendMessage(client: Socket, message : Message) {
      const user_id = this.getClientIdBySocketId(client.id);
      if (user_id == null)
        return 400; //user not connected to server
      if (message.user_id != user_id || message.chat_id == null || message.content == null)
        return 501; //bad request
      if (this.chatService.isUserActive(message.chat_id, user_id))
      {
        if (await this.chatService.isMuted(message.chat_id, user_id))
          return 303; //user muted
        await this.commandLogic(client, message);
        await this.messageService.create(message);
        this.sendChat(message.chat_id);
        return 200;
      }
      return 502; //user not active in chat
    }

    async commandLogic(client: Socket, message: Message) {
      const chat = await this.chatService.findById(message.chat_id);
      if (message.content == "**/DUEL/**") //if is a cmd
        if (chat && chat.isDirect)
          this.sendNotifToClient(chat.users_id[0] == message.user_id ? chat.users_id[1] : chat.users_id[0], "You have been challenged to a duel by " + await this.userService.getUsername(message.user_id));
    }


    async removeMessage(client: Socket, message : Message) {
      const user_id = this.getClientIdBySocketId(client.id);
      if (user_id == null)
        return 400; //user not connected to server
      if (message.chat_id == null)
        return 501; //bad request
      if (this.chatService.isUserActive(message.chat_id, user_id))
      {
        const response = await this.messageService.delete(message)
        if (response == 200)
          return this.sendChat(message.chat_id);
        return response;
      }
      return 502; //user not active in chat
    } 

    async changeChatName(client: Socket, chatId: number, name : string) : Promise<number> {
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      const res = await this.chatService.updateName(chatId, name);
      if (res == 200)
      {
        await this.messageService.createAnonce(chatId, await this.userService.getUsername(userId) + " changed the chat name to " + name)
        await this.sendChat(chatId);
      }
      return res;
    }

    async changeChatPassword(client: Socket, chatId: number, password : string) : Promise<number> {
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      const res = await this.chatService.updatePassword(chatId, password);
      if (res == 200)
      {
        await this.messageService.createAnonce(chatId, await this.userService.getUsername(userId) + " changed the chat password")
        await this.sendChat(chatId);
      }
      return res;
    }

    async changeChatPrivacy(client: Socket, chatId: number, isPrivate : boolean) : Promise<number> {
      const userId = this.getClientIdBySocketId(client.id)
      if (userId == null)
        return 400;
      const res = await this.chatService.updateIsPrivate(chatId, isPrivate);
      if (res == 200)
      {
        await this.messageService.createAnonce(chatId, await this.userService.getUsername(userId) + " changed the chat privacy to " + isPrivate ? "public" : "private")
        await this.sendChat(chatId);
      }
      return res;
    }

    // ----------------------------------PONG---------------------------------------//

    launchPongApp(userId : number)
    {
      let client = this.getSocketByUserId(userId);
      this.server.to(client.id).emit('switchToPong');
    }

    sendPong(game: Game) {
      const players = game.players;
      for (let player of players)
      {
        let client = this.getSocketByUserId(player);
        if (client)
          this.server.to(client.id).emit('pong', game.toJson(player));
      }
    }

    sendPongStatus(players : number[], score : [number, number], gameStatus : number, labelText : string) {
      for (let player of players)
      {
        let client = this.getSocketByUserId(player);
        if (client)
          this.server.to(client.id).emit('pongStatus', score, gameStatus, labelText);
      }
    }

    sendPongPlayers(players : number[], activePlayers : boolean[]) {
      for (let player of players)
      {
        let client = this.getSocketByUserId(player);
        if (client)
          this.server.to(client.id).emit('pongPlayers', players, activePlayers);
      }
    }

}
