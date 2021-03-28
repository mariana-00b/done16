import { Injectable } from '@angular/core';
import { IUser } from '../../interfaces/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private arrUsers: IUser[] = [
    {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      id: 1
    }
  ];
  constructor() {}

  getArrUsers(): IUser[] {
    return this.arrUsers;
  }

  checkUserExist(user: IUser): boolean {
    const IS_USERNAME_ALREADY_EXIST: boolean = this.arrUsers.every(
      (value) => value.username !== user.username
    );
    
    const IS_EMAIL_ALREADY_EXIST: boolean = this.arrUsers.every(
      (value) => value.email !== user.email
    );

    if (!IS_USERNAME_ALREADY_EXIST || !IS_EMAIL_ALREADY_EXIST) {
      return true;      
    }
    return false;
  }

  addCheckedUser(checkedUser: IUser): void {
    this.arrUsers.push(checkedUser);
  }

  singInUser(user: IUser): IUser {
    const index = this.arrUsers.findIndex(u => user.email === u.email && user.password === u.password);
    return this.arrUsers[index];
  }
}
