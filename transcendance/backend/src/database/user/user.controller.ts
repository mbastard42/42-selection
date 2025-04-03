import { Controller, Get, Post, Put, Body, Delete, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TokenMiddleware } from 'src/middleware';
import { NotifService } from 'src/notif/notif.service';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly notifService : NotifService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('login42')
  async getlogin42Url(): Promise<{url: string}> {
    return await this.userService.getLogin42Url();
  }

  @Post('login42')
  async login42(@Body() body: any): Promise<{}> {
    return this.userService.login42(body.code);
  }

  @Post('is2FAEnabled')
  async is2FAEnabled(@Body() body: any): Promise<boolean> {
    return await this.userService.is2FAEnabled(body.id);
  }

  @Post('is2FAValid')
  async is2FAValid(@Body() body: any): Promise<number> {
    return await this.userService.is2FAValid(body.userId, body.code);
  }

  @Post('toggle2FA')
  async toggle2FA(@Body() body: any): Promise<{status: number, key: string}> {
    return await this.userService.toggle2FA(body.id);
  }

  @Post('getBlockList')
  async getBlockedList(@Body() body: any): Promise<Array<number>>{
    return await this.userService.getBlockList(body.id);
  }

  @Post('blockId')
  async blockUserId(@Body() body: any): Promise<number>{
      return await this.userService.blockUserId(body.id, body.other);
  }

  @Post('unblockId')
  async ubblockUserId(@Body() body: any): Promise<number>{
      return await this.userService.unblockUserId(body.id, body.other);
  }

  @Post('login')
  async login(@Body() body: any): Promise<{}> {
    return this.userService.login(body.email, body.password);
  }

  @Post('login2FA')
  async login2FA(@Body() body: any): Promise<{}> {
    return this.userService.login2FA(body.email, body.password, body.code);
  }

  @Post('register')
  async register(@Body() body: any): Promise<{status: number, user: User, token: string}> {
    const res = await this.userService.register(body.email, body.password)
    return {
      status: res.status,
      user: res.usr,
      token: res.usr?.token,
    }
  }

  @Post('configUser')
  async configUser(@Body() body: any): Promise<{}> {
    return this.userService.configUser(body.email, body.username);
  }

  @Post('editUsername')
  async editUsername(@Body() body: any): Promise<{}> {
    return this.userService.editUsername(body.id, body.username);
  }


  @Post('search-username')
  async findAllByUsername(@Body() body: any): Promise<User[]> {
    if (body.username === '') return [];
    return this.userService.findAllByUsername(body.username);
  }  

  @Post('username')
  async findByUsername(@Body() body: any): Promise<User> {
    return this.userService.findByUsername(body.username);
  }

  @Post('getUserId')
  async getUserId(@Body() body: any): Promise<number> {
    return this.userService.getUserId(body.username);
  }

  @Post('id')
  async findById(@Body() body: any): Promise<User> {
    return await this.userService.findById(body.userId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUser: User): Promise<User> {
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}