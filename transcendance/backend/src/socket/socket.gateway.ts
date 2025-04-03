import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { Message } from '../database/message/message.entity';
import { GamesService } from 'src/games/games.service';

@WebSocketGateway({cors: true})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private socketService : SocketService,
    private gameService: GamesService,
    ) {
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.socketService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    this.socketService.handleUserDisconnect(client);
  }

  @SubscribeMessage('user-connection')
  async handleUserConnect(client: Socket, token : string) {
    let response = await this.socketService.handleUserConnect(client, token); 
    if (response != 200)
      client.emit('error', "Error when connecting user, please reconnect");
  } 

  @SubscribeMessage('user-disconnect')
  handleUserDisconnect(client: Socket) {
    this.socketService.handleUserDisconnect(client);
  }



  //------------------------CHAT------------------------//

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    console.log(`Message received from client ${client.id}: ${message}`);
  }

  @SubscribeMessage('updateAdmin')
  async chatUpdateAdmin(client: Socket, body: number[]) {
    if (body.length != 2)
      return ;
    let response = await this.socketService.chatUpdateAdmin(client, body[0], body[1]);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when banning user, please reconnect");
    else
      client.emit('info', "You can't change admin of this chat");
  }

  @SubscribeMessage('kickUser')
  async kickUserFromChat(client: Socket, body: number[]) {
    if (body.length != 2)
      return ;
    let response = await this.socketService.chatKickUser(client, body[0], body[1]);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when kicking user, please reconnect");
    else
      client.emit('info', "You can't kick this user");
  }

  @SubscribeMessage('banUser')
  async banUserFromChat(client: Socket, body: number[]) {
    if (body.length != 2)
      return ;
    let response = await this.socketService.chatBanUser(client, body[0], body[1]);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when banning user, please reconnect");
    else
      client.emit('info', "You can't ban this user");
  }


  @SubscribeMessage('unbanUser')
  async unbanUserFromChat(client: Socket, body: number[]) {
    if (body.length != 2)
      return ;
    let response = await this.socketService.chatUnbanUser(client, body[0], body[1]);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when unbanning user, please reconnect");
    else
      client.emit('info', "You can't ban this user");
  }

  @SubscribeMessage('joinChat')
  async joinChat(client: Socket, chatId: number) {
    let response = await this.socketService.joinChat(client, chatId);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when joining chat, please reconnect");
    else
      client.emit('info', "You can't join this chat");
  }

  @SubscribeMessage('leaveChat')
  leaveChat(client: Socket, chatId: number) {
    const response = this.socketService.leaveChat(client, chatId);
  }

  @SubscribeMessage('refreshChat')
  async refreshChat(client: Socket, chatId: number) {
    let response = await this.socketService.refreshChat(client, chatId);
    if (response != 200)
      client.emit('error', "Error when refreshing chat, please reconnect");
  }

  @SubscribeMessage('changeChatName')
  async changeChatName(client: Socket, body: any) {
    let response = await this.socketService.changeChatName(client, body.chatId, body.name);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when changing chat name, please reconnect");
    else
      client.emit('info', "You can't change this chat name");
  }

  @SubscribeMessage('changeChatPassword')
  async changeChatPassword(client: Socket, body: any) {
    let response = await this.socketService.changeChatPassword(client, body.chatId, body.password);
    if (response != 200)
      client.emit('error', "Error when changing chat password, please reconnect");
  }

  @SubscribeMessage('changeChatPrivacy')
  async changeChatPrivacy(client: Socket, body: any) {
    let response = await this.socketService.changeChatPrivacy(client, body.chatId, body.isPrivate);
    if (response != 200)
      client.emit('error', "Error when changing chat privacy, please reconnect");
  }

  @SubscribeMessage('sendMessage') // 'message' est l'événement personnalisé que vous écoutez
  async sendMessage(client: Socket, message : Message) {
    let response = await this.socketService.sendMessage(client, message);
    if (response == 200)
      return ;
    if (response >= 400)
      client.emit('error', "Error when sending message, please reconnect");
    else
      client.emit('info', "You are muted, please wait");
  }

  @SubscribeMessage('removeMessage') // 'message' est l'événement personnalisé que vous écoutez
  async removeMessage(client: Socket, message : Message) {
    let response = await this.socketService.removeMessage(client, message);
    if (response != 200) //User not connected to server
      client.emit('error', "Error when removing message, please reconnect");
  }

  //------------------------FRIENDS------------------------//

  @SubscribeMessage('friendRequest')
  async addFriend(client: Socket, friendId: number) {
    let response = await this.socketService.addFriend(client, friendId);
    if (response == 200 || response == 201)
      return ;
    if (response >= 400)
      client.emit('error', "Error when adding friend, please reconnect");
    else
      client.emit('info', "You can't add this friend");
  }

  @SubscribeMessage('removeFriend')
  async removeFriend(client: Socket, friendId: number) {
    let response = await this.socketService.removeFriend(client, friendId);
    if (response != 200)
      client.emit('error', "Error when removing friend, please reconnect");
  }

  @SubscribeMessage('cancelFriendRequest')
  async cancelFriendRequest(client: Socket, friendId: number) {
    let response = await this.socketService.cancelFriendRequest(client, friendId);
    if (response != 200)
      client.emit('error', "Error when cancelling friend request, please reconnect");
  }

  //------------------------GAME------------------------//

  @SubscribeMessage('movePaddleUp')
  movePaddleUp(client: Socket) {
    this.gameService.paddleMove(this.socketService.getClientIdBySocketId(client.id), -1)
  }

  @SubscribeMessage('movePaddleDown')
  movePaddleDown(client: Socket) {
    this.gameService.paddleMove(this.socketService.getClientIdBySocketId(client.id), 1)
  }
}