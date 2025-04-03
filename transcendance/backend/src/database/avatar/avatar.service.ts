import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar } from './avatar.entity';
import * as fs from 'fs';

@Injectable()
export class AvatarService {
    constructor( 
        @InjectRepository(Avatar)
        private readonly avatarRepository: Repository<Avatar>,
    ){}

    async create(data: Uint8Array, userId: number): Promise<Avatar> {
        if (!data || data.length == 0 || userId <= 0)
            return null;
        const avatar = new Avatar();
        avatar.uint8Array = data;
        avatar.userID = userId;
        return this.avatarRepository.save(avatar);
    }

    async uploadAvatar(data: Uint8Array, userId: number): Promise<Avatar> {
        const avatar = await this.avatarRepository.findOne({where: {userID: userId}});
        if (!avatar) {
            return this.create(data, userId);
        }
        if (!data || data.length == 0)
            return null;
        avatar.uint8Array = data;
        return await this.avatarRepository.save(avatar);
    }

    async findAll(): Promise<Avatar[]> {
        return this.avatarRepository.find();
    }

    async getAvatar(userID: number): Promise<Avatar> {
        return await this.avatarRepository.findOne({where: {userID: userID}});
    }

    getDefaultAvatar(): Uint8Array {
        try {
            const filePath = 'src/database/avatar/default.jpeg';
            const fileBuffer = fs.readFileSync(filePath);
            return fileBuffer;
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier :', error);
            return this.getDefaultFallbackAvatar();
        }
    }

    getDefaultFallbackAvatar(): Uint8Array {
        const base64Image = '...';
        const buffer = Buffer.from(base64Image, 'base64');
        return new Uint8Array(buffer);
    }

}