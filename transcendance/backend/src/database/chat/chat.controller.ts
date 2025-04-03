import { Controller, Get, Post, Put, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { Message } from '../message/message.entity';
import { TokenMiddleware } from 'src/middleware';
import { User } from '../user/user.entity';

@Controller('chats')
export class ChatController {
    
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async findAll(): Promise<Chat[]> {
    return this.chatService.findAll();
  }

  @Post('banUser')
  async banUser(@Body() body: any): Promise<number> {
    return this.chatService.banUser(body.chat_id, body.user_id, body.target_id);
  }

  @Post('unbanUser')
  async unbanUser(@Body() body: any): Promise<number> {
    return this.chatService.unbanUser(body.chat_id, body.user_id, body.target_id);
  }

  @Post('isMutted')
  async isMutted(@Body() body: any): Promise<boolean> {
    return this.chatService.isMuted(body.chat_id, body.user_id);
  }

  @Post('muteUser')
  async muteUser(@Body() body: any): Promise<number> {
    return this.chatService.muteUser(body.chat_id, body.target_id, body.time);
  }

  @Post('updateAdmin')
  async updateAdmin(@Body() body: any) : Promise<number>
  {
    return await this.chatService.updateAdmin(body.chat_id, body.user, body.target)
  }

  @Post('getUsersFromChat')
  async getUsersFromChat(@Body() body: any): Promise<User[]> {
    return this.chatService.getUsersFromChat(body.chat_id);
  }

  @Post('directWithId')
  async createDirectWithId(@Body() body: any): Promise<Chat> {
    return this.chatService.createDirectWithId(body.current, body.other);
  }

  @Post('createChannel')
  async createChannel(@Body() body: any): Promise<number> {
    return this.chatService.createChannel(body.user, body.isPrivate, body.password, body.name);
  }

  @Post('joinPublicChat')
  async joinPublicChat(@Body() body: any): Promise<number> {
    return await this.chatService.joinPublicChat(body.chat_id, body.user);
  }

  @Post('leaveChat')
  async leaveChat(@Body() body: any): Promise<number> {
    return this.chatService.leaveChat(body.chat_id, body.user);
  }

  @Post('inviteFriend')
  async inviteUser(@Body() body: any): Promise<number> {
    return await this.chatService.inviteUser(body.chat_id, body.user, body.target);
  }

  @Post('joinProtectedChat')
  async joinProtectedChat(@Body() body: any): Promise<number> {
    return this.chatService.joinProtectedChat(body.chat_id, body.user, body.password);
  }

  @Post('getPublicChats')
  async getPublicChats(): Promise<Chat[]> {
    return this.chatService.getPublicChats();
  }

  @Post()
  async createChat(@Body() newChat: Chat): Promise<Chat> {
    return this.chatService.create(newChat);
  }

  @Post('getChatByUsersId')
  async getChatByUsersId(@Body() body: any): Promise<Chat> {
    return this.chatService.findAllByUsersId(body.current, body.other);
  }

  @Post('getChatsByUserId')
  async getChatsByUserId(@Body() body: any): Promise<Chat[]> {
    return this.chatService.findByUserId(body.id);
  }

  @Post('id')
  async getChat(@Body() body: any): Promise<Chat> {
    return this.chatService.findById(body.id);
  }

}