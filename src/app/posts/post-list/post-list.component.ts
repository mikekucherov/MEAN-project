import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private postsSub: Subscription;
  isAuthenticated;
  authSubs: Subscription;

  constructor(public postsService: PostsService, private auth: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.auth.getIsAuthenticatedStatus();

    this.userId = this.auth.getUserId();

    this.authSubs = this.auth
      .getAuthStatusListener()
      .subscribe((isAuth) => (this.isAuthenticated = isAuth));
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.userId = this.auth.getUserId();
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSubs.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(
      () => {
        // FIXME Subscription inside subscription!! change to switchMap
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
