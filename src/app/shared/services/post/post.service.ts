import { Injectable } from '@angular/core';
import { IPost } from '../../interfaces/post/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private arrPosts: IPost[] = [];
  constructor() {}
  getArrPosts(): IPost[] {
    return this.arrPosts;
  }

  addPost(post: IPost): void {
    this.arrPosts.push(post);
  }

  editPost(id: number | string, post: IPost): void {
    const INDEX = this.arrPosts.findIndex(post => post.id === id);
    this.arrPosts.splice(INDEX, 1, post);
    console.log(this.arrPosts);
  }

  deletePost(id: number | string): void {
    const INDEX = this.arrPosts.findIndex(post => post.id === id);
    this.arrPosts.splice(INDEX, 1);
  }
}
