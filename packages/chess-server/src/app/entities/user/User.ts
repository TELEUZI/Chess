import { getModelForClass, prop } from '@typegoose/typegoose';

class User {
  @prop()
  public name!: string;

  @prop({ type: () => String })
  public email!: string;
}

export const UserModel = getModelForClass(User);
