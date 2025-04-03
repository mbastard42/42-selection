import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { randInt } from 'three/src/math/MathUtils';
import { AuthService } from '../auth/auth.service';
import { UserRequest } from 'src/app/network/user';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NotificationsService {

	private notifSubject = new Subject<[string, number]>();

	notification$ = this.notifSubject.asObservable();

	notifList: string[] = [];


	constructor(private userRequest: UserRequest, private userService : UserService) {
		// setInterval(() => {
		// 	if (this.authService.isLogIn())
		// 		this.getNotifs();
		// }, 1000);
	}

	getColorByType(alertType: number)
	{
		switch (alertType)
		{
			case 0:
				return "blue";
			case 1:
				return "green";
			case 2:
				return "var(--background-color)";
			default:
				return "grey";
		}
	}

	public async addNotification(message: string, alertType?: number)
	{
		if (this.notifList.includes(message))
			return ;
		this.notifList.push(message);
		await new Promise(resolve => setTimeout(resolve, 5));
		this.notifSubject.next([message, alertType ? alertType : 2]);
	}


}
