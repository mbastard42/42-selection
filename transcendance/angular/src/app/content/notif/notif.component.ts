import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifService/notifications.service';
import { RootingService } from 'src/app/services/rooting/rooting.service';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.css']
})
export class AlertComponent implements OnDestroy  {

  private notificationSubscription: Subscription;

  constructor(private readonly notifService: NotificationsService, private elementRef: ElementRef) {
    this.notificationSubscription = this.notifService.notification$.subscribe(
      (notification) => {
        this.alertAnimation(notification[0], notification[1]);
      }
    )

  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  getNotifs()
  {
    return this.notifService.notifList;
  }

  getAlertId(alert: string)
  {
    return "alert" + this.notifService.notifList.indexOf(alert);
  }

  async alertAnimation(notif : string, alertType : number)
  {
    const specificElement = this.elementRef.nativeElement.querySelector(`#${this.getAlertId(notif)}`);
    if (!specificElement)
      return ;

    const alertHeight = specificElement.offsetHeight;
    let marginTop = -alertHeight;

    specificElement.style.marginTop = marginTop + "px";
    specificElement.style.backgroundColor = this.notifService.getColorByType(alertType);
    console.log("alertType", alertType)
    console.log(specificElement.style.backgroundColor)

    for (let i = 0; i < 50; i++) //0.5 seconds
    {
      await new Promise(resolve => setTimeout(resolve, 5));
      marginTop += alertHeight / 50;
      specificElement.style.marginTop = marginTop + "px";
    }
    await new Promise(resolve => setTimeout(resolve, 4000));
    for (let i = 0; i < 50; i++) //0.5 seconds
    {
      await new Promise(resolve => setTimeout(resolve, 5));
      marginTop -= alertHeight / 50;
      specificElement.style.marginTop = marginTop + "px";
    }
    this.notifService.notifList = this.notifService.notifList.filter((value) => value != notif);
  }

}
