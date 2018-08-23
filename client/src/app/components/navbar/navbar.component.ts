import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CategoryService } from './../../services/category.service';
import { NotificationService } from './../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css',
  '../../../../node_modules/font-awesome/css/font-awesome.css'
]
})

export class NavBarComponent implements OnInit {
  categories = [];
  catagoricalBlogs;
  value = 0;
  notifications;
  notificationCount;
  blogId;
  notificationMessage;

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    if (this.authService.loggedIn()) {
      this.getAllCategories();
      this.getAllNotifications();
      this.getNotificationCount();
    }

    this.authService.configObservable.subscribe(value => {
      this.value = value;
      if (this.value === 1) {
        this.getAllCategories();
        this.getAllNotifications();
        this.getNotificationCount();
      } else {
        this.categories = null;
        this.notifications = null;
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
    });
  }

  onEnter(searchText: string) {
    this.router.navigate(['/search/' + searchText]);
  }

  getAllNotifications() {
    this.notificationService.getAllNotifications().subscribe(data => {
      console.log('notification =', data);
      if (!data.success) {
        this.notificationMessage = data.message;
      } else {
        this.notifications  = data.notifications;
        // .sort(function(a, b) {
        //   console.log(a.timestamp);
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return b.timestamp - a.timestamp;
        // });

      }
    });
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(data => {
      // console.log('notification count');
      // console.log(data);
      if (data.success) {
        this.notificationCount = data.count;
      }
    });
  }

  onNotificationClick(notificationId, notificationMessage, blogId) {
    console.log(blogId);
    const elementPos = this.notifications.map(function(x) {return x._id; }).indexOf(notificationId);
    this.notifications[elementPos].seen = true;

    this.notificationService.updateSeen(this.notifications).subscribe(data => {
      // console.log('after Update');
      // console.log(data);
      this.getAllNotifications();
      this.getNotificationCount();
    this.router.navigate(['/view-blog/' + blogId]);
    });

  }

  ngOnInit() {
  }

}
