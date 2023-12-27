import { getModelForClass, prop } from '@typegoose/typegoose';

export class UserEntity {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;
}

export const UserModel = getModelForClass(UserEntity);
