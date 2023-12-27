import { getModelForClass, mongoose, prop } from '@typegoose/typegoose';

export class RefreshToken {
  @prop({ required: true })
  public token!: string;

  @prop({ required: true, ref: 'User' })
  public userId!: mongoose.Types.ObjectId;
}

export const RefreshTokenModel = getModelForClass(RefreshToken);
