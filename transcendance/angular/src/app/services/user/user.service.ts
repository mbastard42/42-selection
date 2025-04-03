import { Injectable } from '@angular/core';
import {User} from '../../class/user';
import { HttpClient } from '@angular/common/http';
import { randInt } from 'three/src/math/MathUtils';
import { UserRequest } from 'src/app/network/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  profilePicture: string = "";
  user: User;

  constructor(private readonly userRequest: UserRequest) {
    this.user = new User();
    this.user.setEmail("");
    this.user.setUsername("");
    this.user.setId(-1);
    this.user.setProfilFile("");
  }

  getUser(){
    return this.user;
  }

  getProfilePicture(){
    return this.profilePicture;
  }

  setUser(newUser: User){
   this.user = newUser;
  }

  resetUser(){
    this.user = new User();
    this.user.setEmail("");
    this.user.setUsername("");
    this.user.setId(0);
    this.user.setProfilFile("");
  }


  removeUserFromBackend() {
    this.userRequest.removeUser(this.user.id);
    this.resetUser();
  }

  async editUsername(newName: string) : Promise<number> {
    const res = await this.userRequest.editUsername(this.getUser().id, newName)
    if (!res)
      return 404;
    else if (res == 200)
      this.user.name = newName;
    return res;
  }

  async updateProfilePictureFromBackend() : Promise<boolean> {
    const pic = await this.getAvatarFromBackend();
    if (!pic)
      return false;
    this.profilePicture = pic;
    return true;
  }

  async getAvatarFromBackend() : Promise<string | undefined> {
    const response = await this.userRequest.getAvatar(this.user.id)
    if (!response)
      return undefined;
    return response
  }

  async setAvatarToBackend(avatar: File) : Promise<number | undefined> {
    const response = await this.userRequest.setAvatar(this.user.id, avatar)
    if (!response)
      return 404;
    return response
  }

}
