import { Controller, Get, Post, Put, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { TokenMiddleware } from 'src/middleware';

@Controller('messages')
@UseGuards(TokenMiddleware)
export class MessageController {
  constructor(private readonly messageService: MessageService,) {}


  @Post('chatId')
  async findByChatId(@Body() body: any): Promise<Message[]> {
    return this.messageService.findByChatId(body.id);
  }

  @Post('add')
  async create(@Body() body : any): Promise<number> {
    return this.messageService.create(body.msg);
  }

  @Get(':id')
  async findById(@Param('id') chatId: number): Promise<Message> {
    return this.messageService.findById(chatId);
  }

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }
}