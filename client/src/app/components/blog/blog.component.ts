import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css',
              '../../../../node_modules/font-awesome/css/font-awesome.css']
})

export class BlogComponent implements OnInit {
  message: string;
  messageClass: string;
  newBlog = false;
  loadingBlogs = false;

  constructor() { }

  newBlogForm() {
    this.newBlog = true;
    console.log(this.newBlog);
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    // Get all blogs

    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  draftComment() {

  }

  ngOnInit() {
  }

}
