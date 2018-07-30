import { Component, OnInit } from '@angular/core';
import { BlogService } from './../../services/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userBlogs;

  constructor( private blogService: BlogService ) { }

  getUserBlogs() {
    this.blogService.getUserBlogs().subscribe(data => {
      this.userBlogs = data.blogs;
      // console.log(data);
    });
  }

  ngOnInit() {
    this.getUserBlogs();
  }

}
