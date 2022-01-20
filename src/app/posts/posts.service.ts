import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3200/api/posts" + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .pipe(
        tap((performedData) => {
          this.posts = performedData.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: performedData.maxPosts,
          });
        })
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3200/api/posts",
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>("http://localhost:3200/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.http
      .put("http://localhost:3200/api/posts/" + id, postData)
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3200/api/posts/" + postId);
  }
}
