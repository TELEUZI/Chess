import type User from '../interfaces/user';
import UserDao from '../models/user-dao';

const OBJECT_STORE_KEY = 'name';
const OBJECT_STORE_NAME = 'Users';

export default class UserDaoService {
  private static instance: UserDaoService | null = null;

  private readonly dao: UserDao;

  private currentUser: User | null = null;

  private constructor() {
    this.dao = new UserDao(OBJECT_STORE_NAME, OBJECT_STORE_KEY, undefined);
  }

  public static getInstance(): UserDaoService {
    if (!UserDaoService.instance) {
      UserDaoService.instance = new UserDaoService();
    }
    return UserDaoService.instance;
  }

  setData(user: User): void {
    this.currentUser = user;
    this.dao.create(user);
  }

  // async updateUserScore(newUser: User): Promise<void> {
  //   const currentUser: User = await this.findCurrentByEmail(newUser);
  //   currentUser.score = newUser.score > currentUser.score ? newUser.score : currentUser.score;
  //   this.setData(currentUser);
  // }

  async getAvatar(): Promise<ArrayBuffer | string> {
    return (await this.findCurrentByEmail(this.currentUser))?.avatar ?? '';
  }

  private async findCurrentByEmail(userToFind: User | null): Promise<User | null> {
    return userToFind
      ? (await this.dao.findAll()).find((user) => user.name === userToFind.name) ?? null
      : null;
  }
}
