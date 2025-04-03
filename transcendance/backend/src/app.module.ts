import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user/user.entity';
import { UserService } from './database/user/user.service';
import { UserController } from './database/user/user.controller';
import { Chat } from './database/chat/chat.entity';
import { ChatService } from './database/chat/chat.service';
import { ChatController } from './database/chat/chat.controller';
import { Message } from './database/message/message.entity';
import { MessageService } from './database/message/message.service';
import { MessageController } from './database/message/message.controller';
import { GamesController } from './games/games.controller';
import { MatchmakingController } from './matchmaking/matchmaking.controller';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { GamesService } from './games/games.service';
import { NotifService } from './notif/notif.service';
import { NotifController } from './notif/notif.controller';
import { Score } from './database/score/score.entity';
import { ScoreController } from './database/score/score.controller';
import { ScoreService } from './database/score/score.service';
import { Friend } from './database/friend/friend.entity';
import { FriendController } from './database/friend/friend.controller';
import { FriendService } from './database/friend/friend.service';
import { FriendRequestService } from './friend-request/friend-request.service';
import { TokenMiddleware } from './middleware';
import { SocketService } from './socket/socket.service';
import { SocketGateway } from './socket/socket.gateway';
import { AvatarController } from './database/avatar/avatar.controller';
import { AvatarService } from './database/avatar/avatar.service';
import { Avatar } from './database/avatar/avatar.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Permet d'utiliser le fichier .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Chat, Message, Score, Friend, Avatar],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Chat, Message, Score, Friend, Avatar]),
    // WebSocketModule
  ],
  controllers: [UserController, ChatController, MessageController, ScoreController, GamesController, MatchmakingController, NotifController, FriendController, AvatarController],
  providers: [UserService, ChatService, MessageService, ScoreService, MatchmakingService, GamesService, NotifService, FriendService, FriendRequestService, SocketService, SocketGateway, AvatarService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('/'); // Applique le middleware à toutes les routes
  }
}
