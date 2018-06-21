import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
// import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavBarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert alert-info' });
    this.router.navigate(['/']); // Navigate back to home page
  }

  ngOnInit() {
  }

}
