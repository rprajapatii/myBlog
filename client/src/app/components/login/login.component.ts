import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  title = 'Login';
  loginForm: FormGroup;
  message: string;
  messageClass: string;
  processing = false;
  inputClass: string;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
   ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group ({
      username: ['', Validators.required ],
      password: ['', Validators.required ]
    });
  }

  disableForm() {
    this.loginForm.controls['username'].disable();
    this.loginForm.controls['password'].disable();
  }

  enableForm() {
    this.loginForm.controls['username'].enable();
    this.loginForm.controls['password'].enable();

  }

  onLoginSubmit() {
    const user = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

    this.processing = true;
    this.disableForm();

    this.authService.loginUser(user).subscribe( data => {
      if (data.success) {
        this.messageClass =  'alert alert-success';
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user);
        setTimeout(() => {
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
          this.router.navigate(['/dashboard']);
          }
        }, 2000 );
      } else {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      }
    });

  }


  ngOnInit() {
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page.';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}
