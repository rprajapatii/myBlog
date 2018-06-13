import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
}) 
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string;
  messageClass: string;

  constructor( private formBuilder: FormBuilder ) { 
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group ({
      username: ['', Validators.required ],
      password: ['', Validators.required ]
    });
  }

  onLoginSubmit(){

  }


  ngOnInit() {
  }

}
