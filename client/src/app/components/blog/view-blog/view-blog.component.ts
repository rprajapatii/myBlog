import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute , Router} from '@angular/router';
// import { map } from 'rxjs/operators';


@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css',
              '../../../../../node_modules/font-awesome/css/font-awesome.css'
            ]
})

export class ViewBlogComponent implements OnInit {
  form: FormGroup;
  commentForm: FormGroup;

  message;
  messageClass: string;
  loadingBlogs = false;
  processing = false;
  username: string;
  newComment = [];
  enabledComments = [];
  currentUrl;
  blog;

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              ) {
                this.createCommentForm();
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

  viewUpdate() {
    location.reload();
  }

  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getBlog();
    });
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getBlog();
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
      this.getBlog();
      const index = this.newComment.indexOf(id);
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

  getBlog() {
    // console.log('inside getblog');
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.viewBlog(this.currentUrl.id).subscribe( data => {
       console.log('data from viewblog =', data);
     if (!data.success) {
      this.messageClass = 'alert alert-danger';
      this.message = 'Blog not found';
     } else {
      this.blog = data.blog;
     }
    });
  }

  goToPublicProfile(username) {
      this.router.navigate(['/public-profile/' + username]);
  }

  ngOnInit() {
    this.getBlog();
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
  }

}
