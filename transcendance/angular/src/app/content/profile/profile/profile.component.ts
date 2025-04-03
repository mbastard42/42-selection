import { Component, ElementRef, ViewChild } from '@angular/core';
import { User } from 'src/app/class/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { ServiceIncludes } from 'src/app/services/includes';
import { AuthRequest } from 'src/app/network/auth';
import { NavService } from 'src/app/services/nav/nav.service';

enum menu {MAIN, EDIT, TFA}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  actualMenu : menu = menu.MAIN;
  TFAsecret : string = "";
  QRCodeUrl : string = "";
  isTFAActive : boolean | undefined = undefined;
  user : User = new User();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('fileInput') fileInput: any;


  constructor(private readonly service : ServiceIncludes, private readonly authRequest: AuthRequest, private readonly navService: NavService) {
    this.navService.setElem({id: 'profile_friendlist/profile', down: 'profile_score_div/profile', right: 'profile_2FA/profile'  ,next: 'friend_search/friend'});
    this.navService.setElem({id: 'friend_search/friend', prev: 'profile_friendlist/profile'});
  
    this.navService.setElem({id: 'profile_2FA/profile', down: 'profile_score_div/profile', left:'profile_friendlist/profile', right: 'profile_edit/profile', nextBehavior: this.toggle2FA});

    this.navService.setElem({id: 'profile_edit/profile', left: 'profile_2FA/profile', down: 'profile_score_div/profile', next: 'profile_edit_cancel/profile', nextBehavior: this.editProfile});

    this.navService.setElem({id: 'profile_score_div/profile', up: 'profile_edit/profile', downBehavior: this.scrollDownScoreDiv, upBehavior: this.scrollUpScoreDiv});

    this.navService.setElem({id: 'profile_edit_avatar/profile', down: 'profile_edit_save/profile', right: 'profile_edit_name/profile', nextBehavior: this.toggleSelectFile});
    this.navService.setElem({id: 'profile_edit_name/profile',left: 'profile_edit_avatar/profile' , down: 'profile_edit_save/profile', nextBehavior: this.enterNewName});
    this.navService.setElem({id: 'profile_edit_save/profile', up: 'profile_edit_name/profile', down: 'profile_edit_cancel/profile', next: 'profile_friendlist/profile',nextBehavior: this.editUser});
    this.navService.setElem({id: 'profile_edit_cancel/profile', up: 'profile_edit_save/profile', next:'profile_friendlist/profile', nextBehavior: this.backToMain});

    this.navService.setElem({id: 'profile_2FA_back/profile', next: 'profile_2FA/profile', nextBehavior: this.backToMain});
    this.start();
  };

  enterNewName = () => {
    this.navService.keyService.usingKeyboard(this.user.name, 'Enter', 0,() => {
      if (this.user.name == '_')
          this.user.name = '';
    });
    if (this.user.name == '')
        this.user.name = '_';
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 0)
            this.user.name = newValue;
    });
  }


  isSelected(id: string) : boolean {
    return this.navService.isSelected(id);
  }

  isTFAButtonActive = () =>
  {
    return (this.isTFAActive != undefined);
  }

  scrollDownScoreDiv = () =>
  {
    this.scrollContainer.nativeElement.scrollTop += 30;
  }

  scrollUpScoreDiv = () =>
  {
    if (this.scrollContainer.nativeElement.scrollTop > 0)
      this.scrollContainer.nativeElement.scrollTop -= 30;
    else
      this.navService.moveUp();
  }

  async start()
  {
    this.copyUserFromService();
    await this.updateIsTFAActive();
  }

  copyUserFromService()
  {
    this.user.name = this.service.userService.getUser().name;
    this.user.email = this.service.userService.getUser().email;
  }

  getUsername()
  {
    return this.user.name;
  }

  getUsernameFromService()
  {
    return this.service.userService.getUser().name;
  }

  getAvatar()
  {
    return this.service.userService.getProfilePicture();
  }

  async updateIsTFAActive(){
    const res = await this.authRequest.is2FAEnabled(this.service.userService.getUser().id);
    this.isTFAActive = res;
    if (this.isTFAActive == undefined)
      alert("error when getting informations from server.");
  }

  getIsTFAActiveLabel() : string
  {
    if (this.isTFAActive)
      return "Désactiver 2FA";
    else if (this.isTFAActive == null)
      return "Loading...";
    return "Activer 2FA";
  }

  doShowQRCode()
  {
    return this.TFAsecret.length > 0;
  }

  doShowMain()
  {
    return this.actualMenu == menu.MAIN;
  }

  doShowEdit()
  {
    return this.actualMenu == menu.EDIT;
  }

  doShowTFA()
  {
    return this.actualMenu == menu.TFA;
  }

  editProfile = () =>
  {
    this.actualMenu = menu.EDIT;
    this.navService.next();
  }

  backToMain = () =>
  {
    this.copyUserFromService();
    this.actualMenu = menu.MAIN;
    
    this.navService.next();
  }


   toggle2FA = async () =>
  {
    if (this.isTFAActive == undefined)
      return;
    if (!this.isTFAActive)
    {
      if (!await this.activate2FA())
        alert("error when activating 2FA");
      else
      {
        this.navService.navigateToId('profile_2FA_back/profile')
        this.isTFAActive = true;
      }
    }
    else if (!await this.desactivate2FA())
        alert("error when desactivating 2FA");
    else
    {
      this.navService.navigateToId('profile_2FA/profile')
      this.isTFAActive = false;
    }
    this.updateIsTFAActive();
  }

  async activate2FA() : Promise<boolean>
  {
    this.actualMenu = menu.TFA;
    const res = await this.authRequest.toggle2FA(this.service.userService.getUser().id);
    if (res)
    {
        if (res.status == 200 && res.key.length > 0){
            this.TFAsecret = res.key;
            this.QRCodeUrl = "otpauth://totp/transcendance" + "?secret=" + this.TFAsecret + "&issuer=" + this.user.name;
            alert("2FA activated, please scan the QRCode with your phone and enter the code you will receive by email.")
          }
      else
        return false;
    }
    else
      return false;
    return true;
  }

  async desactivate2FA() : Promise<boolean>
  {
    const res = await this.authRequest.toggle2FA(this.service.userService.getUser().id);
    if (res)
    {
      if (res.status != 200 || res.key != "")
        return false;
    }
    else
      return false;
    return true;
  }

  openFriendList()
  {
    this.service.rootingService.goToFriendListScreen();
  }

  openScore()
  {
    this.service.rootingService.goToScore(this.user.name)
    // this.service.authService.overlayService.newOverlay(overlayScreen.SCORE, this.user.name, 0, 0);
  }

  onUsernameChange(event : any)
  {
    if (event.target.value.length > 0)
      this.user.name = event.target.value;
  }

  onEmailChange(event : any)
  {
    if (event.target.value.length > 0)
      this.user.email = event.target.value;
  }
  
  editUser = async () =>
  {
    if (this.user.name == this.service.userService.getUser().name)
    {
      this.backToMain();
      return;
    }
  
    const res = await this.service.userService.editUsername(this.user.name);
    if (res == 404)
      alert("error when updating user - request failed");
    else if (res == 400)
      alert("error when updating user - user not found");
    else if (res == 402)
      alert("error when updating user - invalid username\nusername must be between 3 and 13 characters long");
    else if (res == 401)
      alert("error when updating user - username already taken");
    this.backToMain();
  }


  deleteUser()
  {
    this.service.userService.removeUserFromBackend();
    this.service.authService.logOut();
  }

  getUserName()
  {
    return this.user.name;
  }

  getEmail()
  {
    return this.user.email;
  }

  getUserProfile()
  {
    return this.service.userService.user;
  }

  toggleSelectFile = () => {
    this.fileInput.nativeElement.click();
}

async updateAvatar() {
  this.service.userService.updateProfilePictureFromBackend();
}


  async onFileSelected(event : any) {

    try {
        this.resizeImage(event.target.files[0], 360).then(async (resizedImage) => {
            const res = await this.service.userService.setAvatarToBackend(resizedImage);
            if (res == 200)
                this.updateAvatar();
            else if (res == 404)
                this.service.notifService.addNotification("Avatar upload failed - request to server failed");
            else if (res == 400)
                this.service.notifService.addNotification("Avatar upload failed - can't upload this file");
        });
    } catch (e) {
        console.log("Error resizing image : " + e)
    }
}

resizeImage(file: File, size: number): Promise<File> {

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
    
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            let width = image.width;
            let height = image.height;
    
            canvas.width = size;
            canvas.height = size;
    
            ctx!.drawImage(image, 0, 0, width, height, 0, 0, size, size);
    
            canvas.toBlob(
            (blob) => {
                if (blob) {
                const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                resolve(resizedFile);
                } else {
                reject(new Error('Erreur lors de la création du blob.'));
                }
            },
            file.type,
            1
            );
        };
    
        image.onerror = () => {
            reject(new Error('Erreur lors du chargement de l\'image.'));
        };
    });
}

naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
press(id: string): void {this.navService.keyService.press({id: id}, true);}
}
