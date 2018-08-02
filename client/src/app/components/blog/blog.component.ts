import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { BlogService } from './../../services/blog.service';
import { CategoryService } from './../../services/category.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css',
              '../../../../node_modules/font-awesome/css/font-awesome.css']
})

export class BlogComponent implements OnInit {
  form: FormGroup;
  commentForm: FormGroup;
  message;
  messageClass: string;
  newBlog = false;
  loadingBlogs = false;
  processing = false;
  username: string;
  allBlogs;
  categories = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.createForm();
   }

  createForm() {
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
      category: ['', Validators.compose([
                 Validators.required
      ])

      ]

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

  newBlogForm() {
    this.newBlog = true;
    this.getAllCategories();
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();

    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  onBackClick() {
    window.location.reload();
  }

  enableForm() {
    this.form.controls['title'].enable();
    this.form.controls['body'].enable();
    this.form.controls['category'].enable();
  }

  disableForm() {
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
    this.form.controls['category'].enable();
  }

  onBodyTextEditorKeyUp(textValue) {
    this.form.controls['body'].setValue(textValue);
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableForm();

    const blog = {
      title: this.form.controls['title'].value,
      body: this.form.controls['body'].value,
      createdBy: this.username,
      category: this.form.controls['category'].value
    };

    this.blogService.newBlog(blog).subscribe(data => {
      console.log('data b4 save', data);
     if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
     } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllBlogs();
        setTimeout(() => {
          this.newBlog = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableForm();
        }, 2000);
     }

    });
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.allBlogs = data.blogs;
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.categories;
      console.log(this.categories);
    });
  }

  goToPublicProfile(username) {
    this.router.navigate(['/public-profile/' + username]);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
    this.getAllBlogs();
  }

}
