import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()

export class BlogService {

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

  newBlog(blog) {
    this.createAuthHeaders();
    return this.http.post( this.domain + '/blogs/newBlog', blog, this.options).pipe(map( res => res.json()
    ));
  }

}