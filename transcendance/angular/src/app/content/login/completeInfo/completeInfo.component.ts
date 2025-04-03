import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/nav/nav.service';
import { NotificationsService } from 'src/app/services/notifService/notifications.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-completeInfo',
  templateUrl: './completeInfo.component.html',
  styleUrls: ['./completeInfo.component.css']
})
export class CompleteInfoComponent {

  username: string = "";
  avatarUrl : string = "";

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('hideInput') hideInput: any;

  constructor(
    private navService : NavService,
    private authService : AuthService,
    private readonly notifService: NotificationsService,
    private readonly userService : UserService
    ){
    this.updateAvatar();
    this.navService.setElem({id: 'completeInfo_avatar/login/info', down: 'completeInfo_username/login/info', next: 'login_done/login', nextBehavior: this.toggleSelectFile});
    this.navService.setElem({id: 'completeInfo_username/login/info', up: 'completeInfo_avatar/login/info', down: 'completeInfo_done/login/info', nextBehavior: this.enterUsername});
    this.navService.setElem({id: 'completeInfo_done/login/info', up: 'completeInfo_username/login/info', next: 'menu_game/', nextBehavior: this.configUser});

    if (this.navService.cutOnRoute(this.navService.head?.route!)[1] !== '/login/info')
    this.navService.head = this.navService.getElem('completeInfo_done/login/info');
  }

  getEmail = () => {
    return this.userService.getUser().email;
  }

  enterUsername = () => {
    this.navService.keyService.usingKeyboard(this.username, 'Enter', 4, () => {
        if (this.username == '_')
            this.username = '';
    });
    if (this.username == '')
        this.username = '_';
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 4) {
            this.username = newValue;
            if (this.username == '')
                this.username = '_';
        }
    });
}
  
naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
press(id: string): void { this.navService.keyService.press({id: id}, true); }

  isSelected = (id : string) => {
    return this.navService.isSelected(id);
  }

  canConfigUser(){
    if (this.getEmail() == "" || this.authService.isLogIn())
        return false;
    return true;
  }


  configUser = async () =>
  {
      this.navService.keyService.setKey({mute: true});
      const res = await this.authService.configUser(this.getEmail(), this.username, "");
      if (res == 400)
          this.notifService.addNotification("User config failed - request to server failed");
      else if (res == 401)
          this.notifService.addNotification("User config failed - username already taken");
      else if (res == 104)
          this.notifService.addNotification("User config failed - socket connection failed");
      else if (res == 403)
          this.notifService.addNotification("User config failed - username must be between 3 and 20 characters");
      else if (res == 404)
          this.notifService.addNotification("User config failed - invalid user");
      else if (res == 201)
          this.notifService.addNotification("User config failed - user already configured");
      else if (res == 200)
          this.navService.next();
      this.navService.keyService.setKey({mute: false});
  }

getAvatarUrl() {
    return this.avatarUrl;
}

toggleSelectFile = () => {
    this.fileInput.nativeElement.click();
}

async updateAvatar() {
    const newAvatar = await this.userService.getAvatarFromBackend();
    if (newAvatar)
    this.avatarUrl = newAvatar;
}

generateAvatarUrl(avatar: File): string {
    return URL.createObjectURL(avatar);
}

async onFileSelected(event : any) {

    try {
        this.resizeImage(event.target.files[0], 360).then(async (resizedImage) => {
            const res = await this.userService.setAvatarToBackend(resizedImage);
            if (res == 200)
                this.updateAvatar();
            else if (res == 404)
                this.notifService.addNotification("Avatar upload failed - request to server failed");
            else if (res == 400)
                this.notifService.addNotification("Avatar upload failed - can't upload this file");
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

openKeyboard = () => {
  this.hideInput.nativeElement.focus();
}


}
