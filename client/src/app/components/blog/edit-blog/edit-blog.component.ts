import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  blog;
  form: FormGroup;
  message;
  messageClass;
  newBlog: false;
  processing = false;
  currentUrl;
  loading = true;

  constructor( private formBuilder: FormBuilder,
               private location: Location,
               private blogService: BlogService,
               private activatedRoute: ActivatedRoute,
               private router: Router
            ) {
              this.updateForm();
            }

  enableForm() {
    this.form.controls['title'].enable();
    this.form.controls['body'].enable();
  }

  disableForm() {
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
  }

  updateForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(50),
                this.alphaNumericValidation
              ])
            ],
      body: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(5000)
        ])
      ],

    });
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'alphaNumericValidation': true };
    }
  }

  editBlogSubmit() {
    this.blogService.updateBlog(this.blog).subscribe( data => {
      // console.log('data = ', data);
      
    this.processing = true;
    this.disableForm();

    if ( !data.success ) {
      this.messageClass = 'alert alert-danger',
      this.message = data.message;
      this.processing = false;
      this.enableForm();
    } else {
      this.messageClass = 'alert alert-success',
      this.message = data.message;

      setTimeout(() => {
        this.router.navigate(['/blog']);
        this.processing = false;
        this.enableForm();
      }, 2000);
    }
    });
  }

  onBackClick() {
    this.location.back();
  }

  onDeleteClick() {

  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    // this.currentUrl = this.activatedRoute.snapshot.url;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe( data => {
     if (!data.success) {
      this.messageClass = 'alert alert-danger';
      this.message = 'Blog not found';
     } else {
       this.blog = data.blog;
      this.loading = false;
     }

    });
  }

}
