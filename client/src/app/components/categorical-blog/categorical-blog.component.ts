import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CategoryService } from './../../services/category.service';

@Component({
  selector: 'app-categorical-blog',
  templateUrl: './categorical-blog.component.html',
  styleUrls: ['./categorical-blog.component.css']
})

export class CategoricalBlogComponent implements OnInit {
  currentUrl;
  messageClass;
  message;
  categoricalBlogs;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  getCategoricalBlogs() {
    this.currentUrl = this.activatedRoute.snapshot.paramMap;
    this.categoryService.getCategoricalBlogs(this.currentUrl.get('catName'))
    .subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Blogs for the category could not be found.';
       } else {
        this.categoricalBlogs = data.blogs;
       }
    });
  }

  goToPublicProfile(username) {
    this.router.navigate(['/public-profile/' + username]);
  }

  ngOnInit() {
    this.getCategoricalBlogs();
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCategoricalBlogs();
      }
    });
  }

}
