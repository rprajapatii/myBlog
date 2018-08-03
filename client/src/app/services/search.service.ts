import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor( private http: Http,
              private authService: AuthService) { }

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

  search(title) {
    this.createAuthHeaders();
    return this.http.get( this.domain + '/search/searchTitle/' + title, this.options).pipe( map(res => res.json() ));
  }

}
