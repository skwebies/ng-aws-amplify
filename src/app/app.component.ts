import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIService, Blog } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'amplify-app';
  public createForm: FormGroup;

  public blogs: Array<Blog> = [];

  private subscription: Subscription | null = null;

  constructor(private api: APIService, private formBuilder: FormBuilder) {
    this.createForm =  this.formBuilder.group({
      name: ["", Validators.required],
    })

  }

  async ngOnInit() {
    /* fetch blogs when app loads */
    this.api.ListBlogs().then((event) => {
      this.blogs = event.items as Array<Blog>;
    });

    /* subscribe to new blogs being created */
    this.subscription = <Subscription>(
      this.api.OnCreateBlogListener.subscribe((event: any) => {
        const newBlog = event.value.data.onCreateBlog;
        this.blogs = [newBlog, ...this.blogs];
      })
    );
  }


  public onCreateBlog(blog: Blog) {
    this.api.CreateBlog(blog).then((event) => {
      console.log("item created");
      this.createForm.reset();
    })
    .catch((err) => {
      console.log("error creating blog", err);
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }
}
