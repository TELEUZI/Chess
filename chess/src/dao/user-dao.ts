import User from '../interfaces/user';
import BaseDao from './based-dao';

export default class UserDao extends BaseDao<User> {
  async getAvatar(): Promise<string> {
    return (await this.get()).avatar;
  }
}
