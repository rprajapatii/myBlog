import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = 'Register';
  regForm: FormGroup;
  message: string;
  messageClass: string;
  processing = false;
  emailValid: boolean;
  emailMessage: string;
  usernameValid: boolean;
  usernameMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.regForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        this.validateEmail
      ])
      ],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        this.validateUsername
      ])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
        this.validatePassword
      ])
      ],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm') });
  }

  validateEmail(controls) {
    // tslint:disable-next-line:max-line-length
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true };
    }
  }

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true };
    }
  }

  validatePassword(controls) {
    const regExp = RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,25}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true }; // Return as error: do not match
      }
    };
  }

  disableForm() {
    this.regForm.controls['email'].disable();
    this.regForm.controls['username'].disable();
    this.regForm.controls['password'].disable();
    this.regForm.controls['confirm'].disable();
  }

  enableForm() {
    this.regForm.controls['email'].enable();
    this.regForm.controls['username'].enable();
    this.regForm.controls['password'].enable();
    this.regForm.controls['confirm'].enable();
  }

  onRegSubmit() {
    const user = {
      email: this.regForm.get('email').value,
      username: this.regForm.get('username').value,
      password: this.regForm.get('password').value
    };
    this.processing = true;
    this.disableForm();
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate( ['/Login'] );
        }, 2000);
      }  else {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.enableForm();
      }
    });
  }

    // Function to check if e-mail is taken
    checkEmail() {
      // Function from authentication file to check if e-mail is taken
      this.authService.checkEmail(this.regForm.get('email').value).subscribe(data => {
        if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    });
    }

    checkUsername() {
      this.authService.checkUsername(this.regForm.get('username').value).subscribe(data => {
        if (!data.success) {
          this.usernameValid = false; // Return username as invalid
          this.usernameMessage = data.message; // Return error message
        } else {
          this.usernameValid = true; // Return username as valid
          this.usernameMessage = data.message; // Return success message
        }
      });
    }

  ngOnInit() {
  }

}
