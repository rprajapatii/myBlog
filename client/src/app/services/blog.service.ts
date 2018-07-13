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

  getAllBlogs() {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/blogs/getAllBlogs', this.options)
    .pipe( map(res =>  res.json() ));
  }

  getSingleBlog(id) {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/blogs/singleBlog/' + id, this.options)
    .pipe( map(res => res.json() ));
  }

  viewBlog(id) {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/blogs/viewBlog/' + id, this.options)
    .pipe( map(res => res.json() ));
  }

  updateBlog(blog) {
    this.createAuthHeaders();
    // console.log('inside authBlog service');
    return this.http.put(this.domain + '/blogs/updateBlog', blog , this.options)
    .pipe( map(res => res.json() ));
  }

  deleteBlog(id) {
    this.createAuthHeaders();
    return this.http.delete(this.domain + '/blogs/deleteBlog/' + id, this.options).pipe( map(res => res.json() ));
  }

  likeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + '/blogs/likeBlog' , blogData , this.options)
    .pipe(  map(res => {
      res.json();
    }));
  }

  dislikeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + '/blogs/dislikeBlog' , blogData , this.options)
    .pipe(  map(res => {
      res.json();
    }));
  }

  updateView(id) {
    return this.http.get(this.domain + '/blogs/likeBlog', this.options)
    .pipe(map(res => { res.json(); }));
  }


  commentBlog(id, comment) {
    this.createAuthHeaders();
    const blogData = {
        id: id,
        comment: comment
    };
    return this.http.put(this.domain + '/blogs/comment', blogData, this.options)
    .pipe( map(res => res.json() ));
  }

}
