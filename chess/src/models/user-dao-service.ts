import UserDao from '../dao/user-dao';
import GameConstants from '../enums/game-constants';
import User from '../interfaces/user';

const OBJECT_STORE_KEY = 'name';
const OBJECT_STORE_NAME = 'Users';

export default class UserDaoService {
  private static instance: UserDaoService;

  private dao: UserDao;

  private currentUser: User;

  private constructor() {
    this.dao = new UserDao(OBJECT_STORE_NAME, OBJECT_STORE_KEY, undefined);
  }

  public static getInstance(): UserDaoService {
    if (!UserDaoService.instance) {
      UserDaoService.instance = new UserDaoService();
    }
    return UserDaoService.instance;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setData(user: User): void {
    this.currentUser = user;
    this.dao.create(user);
  }

  async updateUserScore(newUser: User): Promise<void> {
    const currentUser: User = await this.findCurrentByEmail(newUser);
    currentUser.score = newUser.score > currentUser.score ? newUser.score : currentUser.score;
    this.setData(currentUser);
  }

  async getData(): Promise<User> {
    return this.dao.get();
  }

  async getAvatar(): Promise<string> {
    return (await this.findCurrentByEmail(this.currentUser)).avatar;
  }

  private async findCurrentByEmail(usertoFind: User): Promise<User> {
    return (await this.dao.findAll()).find((user) => user.name === usertoFind.name);
  }

  async getLast(): Promise<User> {
    const usersArray: User[] = await this.dao.findAll();
    return usersArray[usersArray.length - 1];
  }

  async getSorted(): Promise<User[]> {
    return (await this.dao.findAll())
      .sort((a, b) => a.score - b.score)
      .reverse()
      .slice(0, GameConstants.NUMBER_OF_BEST_RESULTS);
  }
}
