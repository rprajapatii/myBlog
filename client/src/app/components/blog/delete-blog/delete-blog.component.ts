import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { Component, OnInit } from '@angular/core';
import { BlogService } from './../../../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {
  message;
  messageClass;
  blog;
  currentUrl;

  constructor( private blogService: BlogService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private flashMessagesService: FlashMessagesService
              ) { }

  deleteBlog() {
    this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        // this.message = data.message;
        // this.messageClass = 'altert alert-danger';
        this.flashMessagesService.show(data.message, { cssClass: 'alert alert-info' });
      } else {
        // this.message = data.message;
        // this.messageClass = 'alert alert-success';

        setTimeout(() => {
          this.router.navigate(['/blog']);
          this.flashMessagesService.show(data.message, { cssClass: 'alert alert-info' });
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    // console.log(this.currentUrl.id);
  }

}
