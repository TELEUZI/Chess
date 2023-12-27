import { UserModel } from '../../entities/user/User';
import type { UserSchema } from '../../shemas/user';

export function createUser(userData: UserSchema): Promise<UserSchema> {
  return UserModel.create(userData).then((user) => user.toObject());
}

export function getUsers(): Promise<UserSchema[]> {
  return UserModel.find();
}

export function getUserById(userId: string): Promise<UserSchema | null> {
  return UserModel.findById(userId);
}

export function getUserByUsername(username: string): Promise<UserSchema | null> {
  return UserModel.findOne({ username });
}

export function updateUser(userId: string, userData: UserSchema): Promise<UserSchema | null> {
  return UserModel.findByIdAndUpdate(userId, userData, { new: true });
}

export function deleteUser(userId: string): Promise<void> {
  return UserModel.findByIdAndDelete(userId)
    .exec()
    .then(() => {});
}
