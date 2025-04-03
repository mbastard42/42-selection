import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { NotificationsService } from '../notifService/notifications.service';
import { ChatService } from '../chat/chat.service';
import { message } from 'src/app/class/message';
import { chat } from 'src/app/class/chat';
import { RootingService } from '../rooting/rooting.service';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { NavService } from '../nav/nav.service';
import { PongService } from '../pong/pong.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private readonly socket : Socket,
    private readonly notifService : NotificationsService,
    private readonly chatService : ChatService,
    private readonly navService: NavService,
    private readonly router : Router,
    private readonly pongService: PongService
    ) {}

  setupSocketConnection() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('notification', (message: string, type: number) => {
      this.notifService.addNotification(message, type);
    });

    //-----------------------------CHAT---------------------------------

    this.socket.on('message', (message: string) => {
      console.log(message);
    });

    this.socket.on('chat', (newchat : chat, msg : message[]) => {
      this.chatService.updateChatService(newchat, msg);
    });

    this.socket.on('chatKick', () => {
      if (this.navService.cutOnRoute(this.navService.head?.route!)[1].includes('/chat/chat'))
      {
        this.navService.navigateToId('nav_mychat/chat')
        this.notifService.addNotification("You have been kick from a chat", 1);
      }
    });

    this.socket.on('chatBan', () => {
      if (this.navService.cutOnRoute(this.navService.head?.route!)[1].includes('/chat/chat'))
      {
        this.navService.navigateToId('nav_mychat/chat')
        this.notifService.addNotification("You have been ban from a chat", 1);
      }
    });

    this.socket.on('chatUnban', () => {
      this.notifService.addNotification("You have been unban from a chat", 1);
    });

 
    this.socket.on('error', (errorlabel : string) => {
      alert(errorlabel);
      this.router.navigate(['/login']);
      this.reloadPage();
    });

    this.socket.on('info', (infolabel : string) => {
      this.notifService.addNotification(infolabel, 2);
    });

    //-----------------------------PONG---------------------------------

    this.socket.on('switchToPong', () =>{
      this.navService.navigateToId('game_div/game/pong/play');
    })

    this.socket.on('pongPlayers', (playersId : [number, number], activePlayers : boolean[])=> {
      this.pongService.updatePlayers(playersId, activePlayers);
    });

    this.socket.on('pongPositions', (paddlePos : number[], ballPos : number[])=> {
      this.pongService.updatePostions(paddlePos, ballPos);
    });

    this.socket.on('pongStatus', (score: number[], status : number, label : string)=> {
      this.pongService.updateGameStatus(score, status, label);
    });

    this.socket.on('pong', (pongJson : any) => {
      this.pongService.setUpPong(pongJson);
    });

  }

  reloadPage = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    window.location.reload();
  }

  connectToServer(token : string) : number {
    try {
      this.setupSocketConnection();
      this.socket.emit('user-connection', token);
      return 200;
    } catch (error) {
    }
    return 400;
  }

  disconnectToServer() : number {
    try {
      this.socket.emit('user-disconnect');
      return 200;
    } catch (error) {
      console.log("DISCONNECT ERROR: " + error)
    }
    return 400;
  }

  //---------------------------------FRIEND---------------------------------
  addFriendRequest(otherId: number) {
    this.socket.emit('friendRequest', otherId);
  }

  removeFriendRequest(otherId: number) {
    this.socket.emit('cancelFriendRequest', otherId);
  }

  removeFriend(otherId: number) {
    this.socket.emit('removeFriend', otherId);
  }



  //---------------------------------CHAT---------------------------------

  sendMessage(message: message) {
    this.socket.emit('sendMessage', message); // 'message' est l'événement personnalisé que vous émettez
  }

  removeMessage(message: message) {
    this.socket.emit('removeMessage', message); // 'message' est l'événement personnalisé que vous émettez
  }

  updateAdmin(chatId : number, otherId: number){
    this.socket.emit('updateAdmin', chatId, otherId)
  }

  kickUserFromChat(chatId: number, otherId: number){
    this.socket.emit('kickUser', chatId, otherId)
  }

  banUserFromChat(chatId: number, otherId: number){
    this.socket.emit('banUser', chatId, otherId)
  }

  unbanUserFromChat(chatId: number, otherId: number){
    this.socket.emit('unbanUser', chatId, otherId)
  }

  joinChat(chatId : number) {
    this.socket.emit('joinChat', chatId);
  }

  leaveChat(chatId : number) {
    this.socket.emit('leaveChat', chatId);
    this.chatService.resetChatService();
  }

  refreshChat(chatId : number) {
    this.socket.emit('refreshChat', chatId);
  }

  changeChatName(chatId : number, newName : string) {
    this.socket.emit('changeChatName', {chatId: chatId, name: newName});
  }

  changeChatPassword(chatId : number, newPasswd : string) {
    this.socket.emit('changeChatPassword', {chatId: chatId, password: newPasswd});
  }

  changeChatPrivacy(chatId : number, newPrivacy : boolean) {
    this.socket.emit('changeChatPrivacy', {chatId: chatId, isPrivate: newPrivacy});
  }

  //---------------------------------PONG---------------------------------

  movePaddleUp = () => {
    this.socket.emit('movePaddleUp');
  }

  movePaddleDown = () => {
    this.socket.emit('movePaddleDown');
  }


}
