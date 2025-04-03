import { Controller, Post, Param, Get, Res, Body } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { Response } from 'express';

@Controller('avatar')
export class AvatarController {
    constructor(private readonly avatarService: AvatarService) {}

    @Get()
    async findAll() {
        return this.avatarService.findAll();
    }
    @Post('upload')
    async uploadAvatar(@Body() body: {userId: number, buffer: number[]}): Promise<number> {
      const array = new Uint8Array(body.buffer)
      return await this.avatarService.uploadAvatar(array, body.userId) ? 200 : 400;
    }

    @Post('getAvatar')
    async getAvatarPost(@Body() body: any){
        const avatar = await this.avatarService.getAvatar(body.id);
        if (!avatar) {
            return this.avatarService.getDefaultAvatar();
        }
        if (!avatar.uint8Array || avatar.uint8Array.length === 0) {
            return null;
        }
        return avatar.uint8Array;
    }
}
