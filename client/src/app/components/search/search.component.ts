import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SearchService } from './../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  currentUrl;
  messageClass;
  message;
  filteredBlogs;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchComponent: SearchService
  ) {}

  getFilteredBlogs() {
    this.currentUrl = this.activatedRoute.snapshot.paramMap;
    this.searchComponent.search(this.currentUrl.get('searchText')).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Blogs for the category could not be found.';
       } else {
        this.filteredBlogs = data.blogs;
       }
    });
  }

  goToPublicProfile(username) {
    this.router.navigate(['/public-profile/' + username]);
  }

  ngOnInit() {
    this.getFilteredBlogs();
  }

}
