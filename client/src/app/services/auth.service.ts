import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()

export class AuthService {

  domain = 'http://localhost:8080';

  constructor( private http: Http ) { }

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

}
