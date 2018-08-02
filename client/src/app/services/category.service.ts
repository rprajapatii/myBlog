import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})

export class CategoryService {

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

  getAllCategories() {
    this.createAuthHeaders();
    return this.http.get( this.domain + '/category/categories', this.options)
    .pipe( map( res => res.json() ));
  }

  addCategory(categoryName) {
    this.createAuthHeaders();
    return this.http.post( this.domain + '/category/category/' + categoryName, this.options).pipe( map( res => res.json() ));
  }

  getCategoricalBlogs(categoryName) {
    this.createAuthHeaders();
    return this.http.get( this.domain + '/category/categoryBlogs/' + categoryName, this.options ).pipe( map( res => res.json() ));
  }

}
