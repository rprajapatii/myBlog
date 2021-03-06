import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
import { Subject } from 'rxjs';

@Injectable()

export class AuthService {
  authToken: string;
  options;
  user;

  domain = 'http://localhost:8080';

  public configObservable = new Subject<number>();

  constructor( private http: Http,
  ) { }

  createAuthHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'ContentType': 'application/json',
        'authorization': this.authToken
      })
    });

  }

  loadToken() {
    this.authToken = ' ' + localStorage.getItem('token');
  }

  registerUser(user) {
    return this.http.post(this.domain + '/auth/register', user)
    .pipe(map(res => res.json()));
  }

  checkEmail(email) {
     return this.http.get(this.domain + '/auth/checkEmail/' + email)
     .pipe(map(res => res.json()));
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/auth/checkUsername/' + username)
     .pipe(map(res => res.json()));
  }

  emitConfig(val) {
    this.configObservable.next(val);
  }

  loginUser(user) {
    return this.http.post( this.domain + '/auth/login', user ).pipe(map(res => res.json()));
  }

  logout() {
    this.user = null;
    this.authToken = null;
    localStorage.clear();
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/auth/profile', this.options).pipe(map(res => res.json()) );
  }

  getPublicProfile(username) {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/auth/publicProfile/' + username, this.options).pipe( map( res => res.json() ));
  }

  loggedIn() {
    return tokenNotExpired();
  }

}
