import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createAnonce(chatdId: number, message : string)
  {
    let annonce = new Message();
    annonce.chat_id = chatdId
    annonce.user_id = -2;
    annonce.content = message;
    return await this.create(annonce)
  }

  async removeCmdFromUser(chatId : number, userId : number)
  {
    let messages = await this.findByChatId(chatId);
    if (messages == null)
      return;
    for (let message of messages)
    {
      if (message.user_id == userId && message.content.includes("**/DUEL/**"))
        await this.delete(message);
    }
  }

  async removeUserMsgFromChat(chatId : number, userId : number)
  {
    let messages = await this.findByChatId(chatId);
    if (messages == null)
      return;
    for (let message of messages)
    {
      if (message.user_id == userId)
        await this.delete(message);
    }
  }

  async create(newMessage: Message): Promise<number> {
    const message = this.messageRepository.create(newMessage);
    await this.messageRepository.save(message);
    return 200
  }

  async delete(message: Message) : Promise<number> {
    if (await this.findById(message.id))
      await this.messageRepository.delete(message)
    else
      return 404 //Message don't exist
    return 200
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async findByChatId(id: number): Promise<Message[]> {
    const options: FindOneOptions<Message> = {
        where: { chat_id: id },
      };
    return this.messageRepository.find(options);
  }

  async findById(id: number): Promise<Message> {

    const options: FindOneOptions<Message> = {
        where: { id },
    };

    const message = await this.messageRepository.findOne(options);

    return message;
  }
}