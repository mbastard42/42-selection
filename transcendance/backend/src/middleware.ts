import { HttpException, Injectable, NestMiddleware, RequestMethod } from "@nestjs/common";
import { NextFunction } from "express";
import { UserService } from "./database/user/user.service";
import { User } from "./database/user/user.entity";
import { SocketService } from "./socket/socket.service";
import { RouteInfo } from "@nestjs/common/interfaces";


@Injectable()
export class TokenMiddleware implements NestMiddleware
{ 
    private readonly excludedPaths: {path: string, method: string}[];

    constructor (private readonly userService: UserService, private readonly socketService: SocketService) {
        this.excludedPaths = [
            {path : '/users/login', method: 'POST'},
            {path : '/users/login42', method: 'GET'},
            {path : '/users/login42', method: 'POST'},
            {path : '/users/login2FA', method: 'POST'},
            {path : '/users/is2FAValid', method: 'POST'},
            {path : '/users/configUser', method: 'POST'},
            {path : '/users/register', method: 'POST'},
            {path : '/avatar/upload', method: 'POST'},
            {path: '/avatar/getAvatar/:userId', method: 'GET'},
            {path: '/avatar/getAvatar', method: 'POST'},
        ];
    }
    
    use(req: Request, res: Response, next: NextFunction) {
        if (this.isExcludedPath(req.url, req.method))
            next();
        else
        {
            const userId = req.headers['userid'];
            const token = req.headers['token'];
            if (userId != undefined && token)
            {
                const id = parseInt(userId.toString());
                if (!this.userService.isUserValid(id, token))
                    throw new HttpException('Invalid user', 404);
                else if (!this.socketService.isUserConnected(id))
                    throw new HttpException('User not connected', 401);
                else
                    next();
            }
            else
                throw new HttpException('Missing headers', 401);
        }
    }

    isExcludedPath(path: string, method: string): boolean {
        for (const excludedPath of this.excludedPaths) {
            if (excludedPath.path === path && excludedPath.method.toString() === method)
                return true;
        }
        return false;
    }
}