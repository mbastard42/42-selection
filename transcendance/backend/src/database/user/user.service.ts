import { Injectable, NotFoundException } from '@nestjs/common';
import { authenticator } from 'otplib';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, Like, ILike } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';
// import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';
import { Socket } from 'socket.io';

export enum UserStatus { ONLINE, CHAT, GAME }

@Injectable()
export class UserService {

  connectClients : Map<[number, UserStatus], Socket> = new Map<[number, number], Socket>();
    
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getConnectedClients() : Map<[number, number], Socket> {
    return this.connectClients;
  }

  getConnectedClientIdBySocketId(socketId: string) : number {
    for (let [key, socket] of this.getConnectedClients()) {
      if (socket.id == socketId)
        return key[0];
    }
    return null;
  }

  getConnectedSocketByUserId(userId: number) : Socket {
    for (let [key, socket] of this.getConnectedClients()) {
      if (key[0] == userId)
        return socket;
    }
    return null;
  }

  hasConnectedUser(userId : number) : boolean {
    const connectedClients = this.getConnectedClients();

    for (const [key, socket] of connectedClients) {
      if (key[0] === userId) {
        return true; // La clé avec userId a été trouvée
      }
    }

    return false; // La clé avec userId n'a pas été trouvée>
  }

  setConnectedUser(userId : number, socket : Socket, status: UserStatus = UserStatus.ONLINE) {
    this.getConnectedClients().set([userId, status], socket);
  }

  setConnectedUserStatus(userId : number, status: number) {
    const connectedClients = this.getConnectedClients();

    for (const [key, socket] of connectedClients)
    {
      if (key[0] === userId) {
        key[1] = status;
      }
    }
  }

  getConnectedUserStatus(userId : number) : number {
    const connectedClients = this.getConnectedClients();

    for (const [key, socket] of connectedClients)
    {
      if (key[0] === userId) {
        return key[1];
      }
    }
    return -1;
  }

  removeConnectedUser(userId : number) {
    const connectedClients = this.getConnectedClients();
    
    for (const [key, socket] of connectedClients)
    {
      if (key[0] === userId) {
        connectedClients.delete(key);
      }
    }
  }

  removeConnectedClient(client : Socket) {
    const connectedClients = this.getConnectedClients();

    for (const [key, socket] of connectedClients)
    {
      if (socket === client) {
        connectedClients.delete(key);
      }
    }
  }


  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getLogin42Url(): Promise<{url: string}> {
    const base = "https://api.intra.42.fr/oauth/authorize";
    const client_id = "?client_id=u-s4t2ud-8f7614eb45ec69401e73be457519ea2874e11c5488db0621d8de492cea9d47c6";
    const redirect_uri = "&redirect_uri=https%3A%2F%2Flocalhost%2Flogin%2Flogin42";
    const response_type = "&response_type=code";
    const scope = "&scope=public";
    return {url: base + client_id + redirect_uri + response_type + scope}
  }

  async fetch42Token(code: string): Promise<string> {
    const base = "https://api.intra.42.fr/oauth/token";
    const client_id = "?client_id=u-s4t2ud-8f7614eb45ec69401e73be457519ea2874e11c5488db0621d8de492cea9d47c6";
    const client_secret = "&client_secret=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";
    const grant_type = "&grant_type=authorization_code";
    const redirect_uri = "&redirect_uri=https%3A%2F%2Flocalhost%2Flogin%2Flogin42";

    const axios = require('axios');

    const url = base + client_id + client_secret + grant_type + redirect_uri + "&code=" + code;
    let token = "";

    try {
      const response = await axios.post(url, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      token = response.data.access_token; // Le résultat de la requête sera dans response.data
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
    }

    return token
  }

  async fetch42User(token: string) {
    const url = "https://api.intra.42.fr/v2/me";
    let data = null;

    const axios = require('axios');

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      data = response.data; // Le résultat de la requête sera dans response.data
    } catch (error) {
      console.error('Erreur lors de la requête GET :', error);
    }
    return data;
  }

  async login42(code: string): Promise<{}> {

    const token = await this.fetch42Token(code);
    if (!token)
      return {status: 402, user: null, token: null}

    //-----------------------------GET USER---------------------------------

    const data = await this.fetch42User(token);
    if (!data && !data.email)
      return {status: 404, user: null, token: null}

    //------------------------SETUP-----------------
    const user = await this.findByEmail(data.email);
    if (user)
    {
      if (!user.is42)
        return {status: 401, user: null, token: null}; //user already exist but not 42 account
      return {
        status: user.name.length > 0 ? user.GAsecretEncrypted != "" ? 201 : 200 : 202, //201 = 2FA needed, 200 = OK, 202 = userConfig needed
        user: user,
        token: user.token 
      };
    }
    const newUser = new User();
    newUser.email = data.email;
    newUser.name = "";
    newUser.token = this.generateToken();
    newUser.is42 = true;
    newUser.password = "";
    return {
      status: 202,
      user: await this.create(newUser),
      token: newUser.token
    };
  }

  async is2FAEnabled(id: number) : Promise<boolean>
  {
    const user = await this.findById(id);
    if (user)
      return user.GAsecretEncrypted != "";
  }

  async is2FAValid(id: number, code: string) : Promise<number>
  {
    const user = await this.findById(id);
    if (user)
    {
      const decryptedSecret = this.decryptKey(user);
      if (authenticator.check(code, decryptedSecret))
        return 200;
      return 401;
    }
    return 404;
  }

  async toggle2FA(id: number) : Promise<{status: number, key: string}>
  {
    const user = await this.findById(id);
    if (user)
    {
      if (user.GAsecretEncrypted == "")
        return {status: 200, key: this.new2FA(user)};
      else
        return {status: await this.remove2FA(user), key: ""};
    }
    return {status: 404, key: ""};
  }

  new2FA(user: User): string {
    const key = authenticator.generateSecret();
    this.encrypt2FA(user, key);
    return key;
  }
  
  encrypt2FA(user: User, secret: string) {

    const KeyToEncrypt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
  
    const cipher = crypto.createCipheriv('aes-256-cbc', KeyToEncrypt, iv);
  
    let encryptedSecret = cipher.update(secret, 'utf8', 'hex');
    encryptedSecret += cipher.final('hex');
  
    user.KeyToCrypt = KeyToEncrypt.toString('hex');
    user.GAsecretEncrypted = encryptedSecret;
    user.IV = iv.toString('hex');
  
    this.userRepository.save(user);
  }

   decryptKey(user: User): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(user.KeyToCrypt, 'hex'), Buffer.from(user.IV, 'hex'));
  
    let decryptedKey = decipher.update(user.GAsecretEncrypted, 'hex', 'utf8');
    decryptedKey += decipher.final('utf8');
  
    return decryptedKey;
  }

  async remove2FA(user: User) : Promise<number>
  {
    // user.GAsecret = "";
    user.KeyToCrypt = "";
    user.GAsecretEncrypted = "";
    user.IV = "";
    await this.userRepository.save(user);
    return 200;
  }

  async login(email: string, password: string): Promise<{status: number, user: User, token: string}> {
    // await new Promise(resolve => setTimeout(resolve, 2000))

    const usr = await this.findByCredential(email, password) //2.3 seconds
    if (!usr)
      return {status: 404, user: null, token: null}  //user not found
    if (usr.GAsecretEncrypted != "")
      return {status: 201, user: null, token: null} //2FA needed
    if (usr.is42)
      return {status: 410, user: null, token: null} //42 account
    if (usr.name == "")
      return {
        status: 202,
        user: usr,
        token: usr.token,
      } //userConfig needed
    return {
      status: 200,
      user: usr,
      token: usr.token 
    };
  }

  async login2FA(email: string, password: string, code: string): Promise<{}> {
    const usr = await this.findByCredential(email, password)
    if (!usr)
      return {status: 404} 
    const decryptedSecret = this.decryptKey(usr);
    if (!authenticator.check(code, decryptedSecret))
      return {status: 410} //2FA code invalid
    return {
      status: 200,
      user: usr,
      token: usr.token 
    };
  }

  async configUser(email: string, username: string): Promise<{}>
  {
    if (username.length < 3 || username.length > 20)
      return {status: 403, user: null, token: null};
    let user = await this.findByEmail(email);
    if (await this.isUsernameValid(username) != 200)
      return {status: 401, user: null, token: null}; //username invalid
    if (!user)
      return {status: 404, user: null, token: null};
    if (user.name != "")
      return {status: 201, user: null, token: null}; //already configured
    user.name = username;
    await this.userRepository.save(user);
    return {status: 200, user: user, token: user.token};
  }

  async isUsernameValid(username: string) : Promise<number>
  {
    if (username.length < 3 || username.length > 13)
      return 402; //username invalid
    if (await this.findByUsername(username))
      return 401; //username already taken
    return 200;
  }

  async getBlockList(userId: number)
  {
    const user = await this.findById(userId);
    if (user)
      return user.blocked_id;
    return null;
  }

  async blockUserId(id : number, other: number)
  {
    const user = await this.findById(id);
    if (user)
    {
      if (await this.findById(other) == null)
        return 404; //user not foud
      if (other == id)
        return 403; //can't block yourself
      if (user.blocked_id.includes(other))
        return 201; //already blocked
      user.blocked_id.push(other);
    }
    await this.userRepository.save(user);
    return 200;
  }

  async unblockUserId(id : number, other: number)
  {
    const user = await this.findById(id);
    if (user)
    {
      if (await this.findById(other) == null)
        return 404; //user not foud
      if (!user.blocked_id.includes(other))
        return 201; //already unblocked
      user.blocked_id = user.blocked_id.filter(blockedid => blockedid != other)
    }
    await this.userRepository.save(user);
    return 200;
  }

  async register(email: string, password: string) : Promise<{status: number, usr: User}>
  {
    if (password.length < 5)
      return {status: 402, usr: null}
    if (!this.verifyEmail(email))
      return {status: 401, usr: null}
    if (await this.findByEmail(email) != null)
      return {status: 400, usr: null};
  
    let user = new User();
    user.email = email;
    user.password = await this.hashPassword(password);
    user.token = this.generateToken();
    user.name = "";
    user = await this.create(user);
    if (user == null)
      return {status: 500, usr: null}
    return {status: 200, usr: user};
  }

  verifyEmail(email: string) : boolean
  {
    return email.includes("@") && email.includes(".");
  }

  async create(newUser: User): Promise<User> {
    const user = this.userRepository.create(newUser);
    return this.userRepository.save(user);
  }

  async update(index: number, updateUser: User): Promise<User> {
    const options: FindOneOptions<User> = {
        where: { id: index },
      };
    const user = await this.userRepository.findOne(options);
    if (user) {
      Object.assign(user, updateUser);
      return this.userRepository.save(user);
    }
    return null;
  }

  async findAllByUsername(searchUsernames: string): Promise<User[]> {
    const options: FindOneOptions<User> = {
      where: { name: ILike(`%${searchUsernames}%`) },
    };
    const users = await this.userRepository.find(options);

    return users;
  }

  async findByUsername(name: string): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { name },
    };
    const user = await this.userRepository.findOne(options);
    return user;
  }

  async findById(index: number): Promise<User> {

    const options: FindOneOptions<User> = {
      where: { id: index },
    };

    const user = await this.userRepository.findOne(options);
    return user;
  }

  findByEmail(mail: string): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { email: mail },
    };
    const user = this.userRepository.findOne(options);
    return user;
  }

  async findByCredential(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (user && await this.verifyPassword(user.password, password)    )
      return user;
    return null;
  }

  verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async findByToken(token: string): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { token },
    };
    const user = await this.userRepository.findOne(options);
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }


  async getUserId(username: string): Promise<number> {
    const user = await this.findByUsername(username);
    if (user)
      return user.id;
    return null;
  }

  async getUsername(id: number): Promise<string> {
    const user = await this.findById(id);
    if (user)
      return user.name;
    return null;
  }

  generateToken()
  {
    let token : string = "";
    let tokenlen : number = 13;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    for(let i = 0; i < tokenlen; i++)
      token += alphabet.charAt(Math.floor(Math.random() * alphabet.length));

    return token;
  }

  async editUsername(id: number, username: string): Promise<number> {
    const user = await this.findById(id);
    if (!user)
      return 400;
    const isInvalide = await this.isUsernameValid(username);
    if (isInvalide != 200)
      return isInvalide;
    user.name = username;
    await this.userRepository.save(user);
    return 200;
  }

  async isUserValid(userId: number, token: string) : Promise<boolean>
  {
    const usr = await this.findById(userId)
    return token == usr.token
  }

    async hashPassword(password: string) {
    try {

       const salt = await bcrypt.genSalt(15);
       return await bcrypt.hash(password, salt);
    }
    catch (error) {
       throw error;
    }
   }

}