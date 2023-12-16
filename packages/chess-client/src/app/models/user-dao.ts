import type User from '../interfaces/user';
import BaseDao from './base-dao';

export default class UserDao extends BaseDao<User> {
  // async getAvatar(): Promise<ArrayBuffer | string> {
  //   return (await this.get()).avatar;
  // }
}
