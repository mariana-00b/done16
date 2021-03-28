import { Component, OnInit } from '@angular/core';
import { IPost } from '../shared/interfaces/post/post.interface';
import { IUser } from '../shared/interfaces/user/user.interface';
import { User } from '../shared/models/user/user.model';
import { UserService } from '../shared/services/user/user.service';
import { PostService } from '../shared/services/post/post.service';
import { Post } from '../shared/models/post/post.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  isModalOpen: boolean;
  isAddPost: boolean;
  isEditPost: boolean;
  isSignUp: boolean;
  popUpTitle: string;
  accountName: string;
  isSign: boolean = true;
  isEdited: boolean | void;
  isLogged: boolean;
  isEditButtonVisible: boolean;
  currentPost: IPost;

  username: string = '';
  email: string = '';
  password: string = '';
  title: string;
  text: string;
  date: Date;

  arrUsers: IUser[] = [];
  arrPosts: IPost[] = [];

  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.getArrUsers();
    this.getArrPosts();
  }

  private getArrUsers(): void {
    this.arrUsers = this.userService.getArrUsers();
  }

  private getArrPosts(): void {
    this.arrPosts = this.postService.getArrPosts();
  }

  openSignUpModal(): void {
    this.popUpTitle = 'Sign Up';
    this.isModalOpen = true;
    this.isSignUp = true;
  }

  openSignInModal(): void {
    this.popUpTitle = 'Sign In';
    this.isModalOpen = true;
  }

  openAddPostModal(): void {
    this.popUpTitle = 'Add post';
    this.isModalOpen = true;
    this.isAddPost = true;
    this.isEditPost = false;
    this.isSign = false;
  }

  openEditPostModal(post: IPost): void {
    this.currentPost = post;
    this.openAddPostModal();
    console.log('openEditPostModal => ', this.currentPost);
    this.title = post.topic;
    this.text = post.message;
    this.date = post.date;
    this.isEditPost = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetModalField();
  }

  resetModalField(): void {
    this.popUpTitle = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.title = '';
    this.text = '';
    this.isSignUp = false;
    this.isSign = true;
    this.isAddPost = false;
  }

  signUpUser(): void {
    this.checkEmptyInput('up');
    const USER: IUser = new User(this.email, this.password, this.username);

    if (this.arrUsers.length > 0) {
      USER.id = +this.arrUsers.slice(-1)[0].id + 1;
    } else {
      USER.id = 1;
    }

    const EXIST = this.userService.checkUserExist(USER);

    if (EXIST) {
      throw new SyntaxError('This username or email already exist.');
    } else {
      this.userService.addCheckedUser(USER);
      this.loginUser(USER);
    }
  }

  signInUser(): void {
    this.checkEmptyInput('in');
    let user = new User(this.email, this.password);
    const EXIST = this.userService.checkUserExist(user);

    if (!EXIST) {
      throw new SyntaxError('Cannot sign-in, user not found.');
    }

    const USER = this.userService.singInUser(user);
    if (typeof USER === 'undefined') {
      throw new SyntaxError('Check your login or password.');
    }
    this.loginUser(USER);
  }

  loginUser(user: IUser): void {
    this.accountName = user.username;
    this.isLogged = true;
    this.closeModal();
    this.setEditPermissions(user.username);
    this.isEditButtonVisible = true;
  }

  signOutUser(): void {
    this.isLogged = false;
    this.isEditButtonVisible = false;
  }

  addNewPost(): void {
    this.checkEmptyInput('post');
    const NEW_POST = new Post(
      this.accountName,
      this.title,
      new Date(),
      this.text
    );

    if (this.arrPosts.length > 0) {
      NEW_POST.id = +this.arrPosts.slice(-1)[0].id + 1;
      console.log('addNewPost if => ', NEW_POST.id);
    } else {
      NEW_POST.id = 1;
      console.log('addNewPost else => ', NEW_POST.id);
    }
    console.log('addNewPost after if/else => ', NEW_POST.id);

    this.closeModal();
    this.postService.addPost(NEW_POST);
    this.setEditPermissions(NEW_POST.postedBy);
  }

  editCurrentPost(): void {
    this.checkEmptyInput('post');
    let editedPost = new Post(
      this.currentPost.postedBy,
      this.title,
      this.date,
      this.text
    );
    editedPost.id = this.currentPost.id;
    this.postService.editPost(editedPost.id, editedPost);
    this.setEditPermissions(editedPost.postedBy);
    this.closeModal();
  }

  deletePost(id: number | string): void {
    this.postService.deletePost(id);
  }

  checkEmptyInput(signStatus: string) {
    if (signStatus === 'in') {
      if (!this.email || !this.password) {
        throw new SyntaxError('SIGN-IN Enter all inputs');
      }
    } else if (signStatus === 'up') {
      if (!this.email || !this.password || !this.username) {
        throw new SyntaxError('SIGN-UP Enter all inputs');
      }
    } else {
      if (!this.title || !this.text) {
        throw new SyntaxError('POST Enter all inputs');
      }
    }
  }

  setEditPermissions(username: string): void {
    if (username === 'admin') {
      this.arrPosts.forEach((post) => (true ? (post.status = true) : null));
    } else {
      this.arrPosts.forEach((post) => {
        if (post.postedBy === username) {
          post.status = true;
        } else {
          post.status = false;
        }
      });
    }
  }
}
