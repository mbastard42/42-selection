import { Module } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { NotifService } from 'src/notif/notif.service';
import { UserService } from '../database/user/user.service';
import { SocketService } from './socket.service';

@Module({
  providers: [
    SocketGateway,
    SocketService,
    UserService, 
],
})
export class WebSocketModule {}