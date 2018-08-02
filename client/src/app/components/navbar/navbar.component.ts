import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CategoryService } from './../../services/category.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavBarComponent implements OnInit, OnChanges {
  categories = [];
  catagoricalBlogs;
  value = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private categoryService: CategoryService
  ) {
    this.getAllCategories();
    this.authService.configObservable.subscribe(value => {
      console.log('value in nav =', value);
      this.value = value;
      if (this.value === 1) {
        this.getAllCategories();
      } else {
        this.categories = null;
      }
    });
  }

  onLogoutClick() {
    this.authService.logout();
    this.authService.emitConfig(0);
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert alert-info' });
    this.router.navigate(['/']);
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.categories;
      //  console.log(this.categories);
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.value === 1) {
      this.getAllCategories();
    }
  }

}
