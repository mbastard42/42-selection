import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, In } from 'typeorm';
import { Chat } from './chat.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { MessageService } from '../message/message.service';

@Injectable()
export class ChatService {

  MutedUsers : Map<number, Map<number, Date>> = new Map(); 
  ActiveUsers : Map<number, Array<number>> = new Map(); // key = chat_id, value = array of user_id

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly messageService: MessageService,
    // private readonly notifService: NotifService,
    private readonly userService: UserService,
  ) {}

  //-----------------------------INITIALISATION---------------------------------//

  async create(newChat: Chat): Promise<Chat> {
    const chat = this.chatRepository.create(newChat);
    return this.chatRepository.save(chat);
  }

  async delete(id: number): Promise<void> {
    await this.chatRepository.delete(id);
  }

  async createDirectWithId(current: number, other: number): Promise<Chat> {
    let chat = await this.findDirectByUsersId(current, other);
    if (chat)
      return chat;
    chat = new Chat();
    chat.users_id = [current, other] 
    chat.users_name = [await this.userService.getUsername(current), await this.userService.getUsername(other)];
    chat.isDirect = true;
    chat = this.chatRepository.create(chat);

    // this.notifService.addNotification(other, "You have a new chat with " + chat.users_name[0]);
    // this.notifService.addNotification(current, "You have a new chat with " + chat.users_name[1]); 
    return this.chatRepository.save(chat);
  }

  async createChannel(user : User, isPrivate: boolean, password: string, name : string): Promise<number> {
    if (await this.findByName(name) != null)
      return 400;
    if (name.length < 3 || name.length > 20)
      return 401;
    let chat = new Chat();
    chat.owner_id = user.id;
    chat.admins_id = [user.id];
    chat.users_id = [user.id];
    chat.users_name = [user.name];
    chat.isPrivate = isPrivate;
    chat.password = password;
    chat.name = name;
    chat = this.chatRepository.create(chat);
    this.chatRepository.save(chat);
    return 200;
  }


  //-----------------------------GETTERS---------------------------------//

  async getUsersFromChat(id: number): Promise<User[]> {
    const chat = await this.findById(id);
    let users = [];
    for (let i = 0; i < chat.users_id.length; i++) {
      users.push(await this.userService.findById(chat.users_id[i]));
    }
    return users;
  }

  async getPublicChats(): Promise<Chat[]> {
    const chatList = await this.chatRepository.find();
    let returnList = [];
    for (let i = 0; i < chatList.length; i++) {
      if (!chatList[i].isPrivate) {
        returnList.push(chatList[i]);
      }
    }
    return returnList;
  }

  UserIsActive(user_id : number) : boolean
  {
    for (let [key, value] of this.ActiveUsers) {
      if (value.includes(user_id))
        return true;
    }
    return false;
  }

  async isBan(chat_id : number, user_id : number) : Promise<boolean>
  {
    const chat = await this.findById(chat_id);
    if (!chat)
      return false;
    if (chat.bans_id.includes(user_id))
    {
      return true;
    }
    return false;
  }

  getActiveUsers(chat_id : number) : Array<number>
  {
    if (!this.ActiveUsers.has(chat_id))
      return null;
    return this.ActiveUsers.get(chat_id);
  }

  isUserActive(chat_id : number, user_id : number) : boolean
  {
    if (!this.ActiveUsers.has(chat_id))
      return false;
    return this.ActiveUsers.get(chat_id).includes(user_id);
  }


  async isMuted(chat_id : number, user_id : number) : Promise<boolean>
  {
   await this.updateMutedUsers();
    if (!this.MutedUsers.has(chat_id))
    {
      return false;
    }
    return this.MutedUsers.get(chat_id).has(user_id);
  }

  async doChatAsUser(chat_id : number, user_id : number) : Promise<boolean>
  {
    if (!this.ActiveUsers.has(chat_id))
      return false;
    if (!this.ActiveUsers.get(chat_id).includes(user_id))
      return false;
    return true;
  }

    //-----------------------------FINDERS---------------------------------//

    async findByUserId(id: number): Promise<Chat[]> {
      const chatList = await this.chatRepository.find();
      let returnList = [];
      for (let i = 0; i < chatList.length; i++) {
        if (chatList[i].users_id.includes(id)) {
          returnList.push(chatList[i]);
        }
      }
      return returnList;
    }
  
    async findDirectByUsersId(current: number, other: number): Promise<Chat> {
      const chatList = await this.chatRepository.find();
      for (let i = 0; i < chatList.length; i++) {
        if (chatList[i].users_id.includes(current) && chatList[i].users_id.includes(other) && chatList[i].isDirect) {
          return chatList[i];
        }
      }
      return null;
    }
  
    async findAllByUsersId(current: number, other: number): Promise<Chat> {
      const chatList = await this.chatRepository.find();
      for (let i = 0; i < chatList.length; i++) {
        if (chatList[i].users_id.includes(current) && chatList[i].users_id.includes(other)) {
          return chatList[i];
        }
      }
      return null;
    }
  
    async findById(index: number): Promise<Chat> {
  
      const options: FindOneOptions<Chat> = {
          where: { id: index },
        };
  
      const chat = await this.chatRepository.findOne(options);
      return chat;
    }
  
    async findByName(name: string): Promise<Chat> {
      const options: FindOneOptions<Chat> = {
          where: { name: name },
        };
  
      return await this.chatRepository.findOne(options);
    }
  
    async findAll(): Promise<Chat[]> {
      return this.chatRepository.find();
    }

  //-----------------------------ACTIONS---------------------------------//


  async banUser(chat_id : number, user_id : number, target_id: number) : Promise<number>
  {
    const chat = await this.findById(chat_id);
    if (!chat)
      return 404;
    if (chat.owner_id == target_id)
      return 303; //can't ban owner
    if (chat.admins_id.includes(target_id) && chat.owner_id != user_id)
      return 302; //can't ban admin if you're not owner
    if (user_id == target_id)
      return 301; //can't ban yourself
    if (!chat.admins_id.includes(user_id) && chat.owner_id != user_id)
      return 300; //user not admin
    chat.bans_id.push(target_id);
    await this.chatRepository.save(chat);
    await this.leaveChat(chat_id, await this.userService.findById(target_id));
    return 200; 
  }

  async unbanUser(chat_id : number, user_id : number, target_id: number) : Promise<number>
  {
    const chat = await this.findById(chat_id);
    if (!chat)
      return 404;
    if (!chat.admins_id.includes(user_id))
      return 301; //user not admin
    if (!chat.bans_id.includes(target_id))
      return 300; //user not banned
    chat.bans_id = chat.bans_id.filter(item => item !== target_id);
    await this.chatRepository.save(chat);
    return 200;
  }

  async addActiveUser(chat_id : number, user_id : number) : Promise<number>
  {
    if (!user_id)
      return 404;
    if (!this.doChatAsUser(chat_id, user_id))
      return 300; //user not in chat
    if (await this.isBan(chat_id, user_id))
      return 301; //user is banned
    if (!this.ActiveUsers.has(chat_id))
      this.ActiveUsers.set(chat_id, new Array<number>());
    if (!this.ActiveUsers.get(chat_id).includes(user_id))
      this.ActiveUsers.get(chat_id).push(user_id);
    return 200; 
  }

  removeActiveUserFromChat(chat_id : number, user_id : number) : void
  {
    if (!this.ActiveUsers.has(chat_id))
      return;
    this.ActiveUsers.set(chat_id, this.ActiveUsers.get(chat_id).filter(item => item != user_id));
  }

  removeActiveUser(user_id : number) : void
  {
    for (let [key, value] of this.ActiveUsers) {
      this.ActiveUsers.set(key, value.filter(item => item != user_id));
    }
  }

  clearActiveUsers(chat_id : number) : void
  {
    if (!this.ActiveUsers.has(chat_id))
      return;
    this.ActiveUsers.set(chat_id, new Array());
  }

  async updateMutedUsers() : Promise<void>
  {
    for (let [key, value] of this.MutedUsers) {
      for (let [key2, value2] of value) {
        if (value2 < new Date(Date.now()))
          value.delete(key2);
      }
    }
  }

  async muteUser(chat_id : number, target_id : number, time : number) : Promise<number>
  {
    if (time < 0 || time > 60 || time == null || time == undefined || isNaN(time))
      return 400;
    let chat = await this.findById(chat_id);
    if (!chat)
      return 404;
    if (!chat.users_id.includes(target_id))
      return 401;
    else if (chat.owner_id == target_id)
      return 403;
    if (!this.MutedUsers.has(chat_id))
      this.MutedUsers.set(chat_id, new Map());
    else if (this.MutedUsers.get(chat_id).has(target_id))
      return 402;
    this.MutedUsers.get(chat_id).set(target_id, new Date(Date.now() + time * 60000));
    return 200;
  }

  async CankickUser(chatId : number, userId: number, otherId: number)
  {
    let chat = await this.findById(chatId);
    if (!chat)
      return 404; //Chat do'nt exist
    if (!this.ActiveUsers.get(chatId).includes(otherId))
      return 302; //user to kick isn't active
    if (!chat.admins_id.includes(userId) && chat.owner_id != userId)
      return 301; //user don't have permission to kick
    else if (chat.owner_id == userId)
      return 200;
    else if (chat.admins_id.includes(userId) && !chat.admins_id.includes(otherId))
      return 200; //if user is admin and other isn't
    else //if user is admin and other too, can't kick
      return 303;
  }

  async updateAdmin(chat_id : number, user_id : number, target_id : number) : Promise<number>
  {
    let chat = await this.findById(chat_id);
    if (!chat)
      return 404
    if (chat.owner_id != user_id)
      return 301
    if (chat.admins_id.includes(target_id))
      chat.admins_id = chat.admins_id.filter(item => item !== target_id)
    else
      chat.admins_id.push(target_id)
    this.chatRepository.save(chat);
    return 200;
  }

  async updateName(id: number, name: string): Promise<number> {
    const chat = await this.findById(id);
    if (!chat) {
      return 404;
    }
    if (name.length < 3 || name.length > 20)
      return 400;
    chat.name = name;
    this.chatRepository.save(chat);
    return 200;
  }

  async updatePassword(id: number, password: string): Promise<number> {
    const chat = await this.findById(id);
    if (!chat) {
      return 404;
    }
    chat.password = password;
    this.chatRepository.save(chat);
    return 200;
  }

  async updateIsPrivate(id: number, isPrivate: boolean): Promise<number> {
    const chat = await this.findById(id);
    if (!chat) {
      return 404;
    }
    chat.isPrivate = isPrivate;
    this.chatRepository.save(chat);
    return 200;
  } 

  async joinPublicChat(id: number, user : User): Promise<number> {
    const chat = await this.findById(id);
    if (!chat)
      return 404; //chat not found
    if (chat.users_id.includes(user.id))
      return 400; //user already in chat
    if (chat.bans_id.includes(user.id))
      return 401; //user is banned
    if (chat.password != "")
      return 201
    chat.users_id.push(user.id);
    chat.users_name.push(user.name);
    await this.chatRepository.save(chat);
    this.messageService.createAnonce(id, user.name + " has joined the chat");
    return 200;
  }

  async leaveChat(id: number, user : User): Promise<number> {
    const chat = await this.findById(id);
    if (!chat)
      return 404;
    if (!chat.users_id.includes(user.id))
      return 400;
    if (chat.isDirect)
      return 402;
    if (chat.owner_id == user.id)
      if (this.ownerLeaveChat(chat) == 201)
        return 201;
    if (this.isUserActive(id, user.id))
      this.removeActiveUserFromChat(id, user.id);
    chat.users_id = chat.users_id.filter(item => item !== user.id);
    chat.users_name = chat.users_name.filter(item => item !== user.name);
    await this.chatRepository.save(chat);
    this.messageService.removeUserMsgFromChat(id, user.id);
    this.messageService.createAnonce(id, user.name + " has left the chat");
    return 200;
  }

  ownerLeaveChat(chat: Chat): number {
    if (chat.users_id.length > 1) {
      for (let i = 0; i < chat.users_id.length; i++) {
        if (chat.users_id[i] != chat.owner_id) {
          chat.owner_id = chat.users_id[i];
          if (!chat.admins_id.includes(chat.owner_id))
            chat.admins_id.push(chat.owner_id);
          this.messageService.createAnonce(chat.id, chat.users_name[i] + " is now the owner of the chat");
          break;
        }
      }
    } else {
      this.delete(chat.id);
      return 201;
    }
    return 200;
  }


  async inviteUser(chatId: number, userId : number, invitedId: number): Promise<number> {
    const chat = await this.findById(chatId);
    const user = await this.userService.findById(invitedId);
    if (!chat)
      return 404; //chat not found
    if (!user)
      return 405; //user not found
    if (!chat.users_id.includes(userId))
      return 400; //user not in chat
    if (chat.users_id.includes(invitedId))
      return 401; //user already in chat
    if (chat.isDirect)
      return 402; //can't invite user in direct chat
    if (chat.bans_id.includes(invitedId))
      return 403; //user is banned
    chat.users_id.push(user.id);
    chat.users_name.push(user.name);
    this.messageService.createAnonce(chatId, user.name + " has been invited to the chat");
    await this.chatRepository.save(chat);
    return 200;
  }

  async joinProtectedChat(id: number, user : User, password: string): Promise<number> {
    const chat = await this.findById(id);
    if (!chat)
      return 404;
    if (chat.users_id.includes(user.id))
      return 400;
    if (chat.password != password)
      return 401;
    chat.users_id.push(user.id);
    chat.users_name.push(user.name);
    this.chatRepository.save(chat);
    this.messageService.createAnonce(id, user.name + " has joined the chat");
    return 200;
  }
}