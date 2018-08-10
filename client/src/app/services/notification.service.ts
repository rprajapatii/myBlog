import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor( private http: Http,
    private authService: AuthService
  ) {}

  domain = this.authService.domain;
  options;

  createAuthHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'ContentType': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  getAllNotifications() {
    this.createAuthHeaders();
    return this.http.get( this.domain + '/notification/notifications', this.options)
    .pipe( map( res => res.json() ));
  }

  getNotificationCount() {
    this.createAuthHeaders();
    return this.http.get( this.domain + '/notification/countNotification', this.options)
    .pipe( map( res => res.json() ));
  }


  updateSeen(notifications) {
    const blogData = { notifications: notifications };
    return this.http.put(this.domain + '/notification/updateSeen' , blogData , this.options)
    .pipe(  map(res => {
      res.json();
    }));
  }

}
