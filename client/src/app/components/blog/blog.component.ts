import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { BlogService } from './../../services/blog.service';

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
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {
    this.createForm();
    this.createCommentForm();
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

    });
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['',   Validators.compose([
                  Validators.required,
                  Validators.minLength(1),
                  Validators.maxLength(200)
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
  }

  disableForm() {
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableForm();

    const blog = {
      title: this.form.controls['title'].value,
      body: this.form.controls['body'].value,
      createdBy: this.username
    };

    this.blogService.newBlog(blog).subscribe(data => {
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
      // console.log(data);
    });
  }

  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  disableCommentForm() {
    this.commentForm.controls['comment'].disable();
  }

  enableCommentForm() {
    this.commentForm.controls['comment'].enable();
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  oncommentSubmit(id) {
    this.processing = true;
    const comment = this.commentForm.get('comment').value;
    this.blogService.commentBlog(id, comment).subscribe(data => {
      console.log( 'data from commitSubmit =', data );
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      console.log('index=', this.newComment.indexOf(id));
      this.newComment.splice(index, 1);
      this.commentForm.reset();
      this.processing = false;
      if (this.enabledComments.indexOf(id) < 0) {
        this.onShowCommentClick(id);
      }
    });
  }

  cancelCommit(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

  onShowCommentClick(id) {
    this.enabledComments.push(id);
  }

  onHideCommentClick(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }


  // this.disableCommentForm(); // Disable form while saving comment to database
  //   this.processing = true; // Lock buttons while saving comment to database
  //   const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
  //   // Function to save the comment to the database
  //   this.blogService.postComment(id, comment).subscribe(data => {
  //     this.getAllBlogs(); // Refresh all blogs to reflect the new comment
  //     const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
  //     this.newComment.splice(index, 1); // Remove id from the array
  //     this.enableCommentForm(); // Re-enable the form
  //     this.commentForm.reset(); // Reset the comment form
  //     this.processing = false; // Unlock buttons on comment form
  //     if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
  //   });

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
    this.getAllBlogs();
  }

}
