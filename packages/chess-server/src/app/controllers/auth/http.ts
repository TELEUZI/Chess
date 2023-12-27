import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Types } from 'mongoose';
import type { UserEntity } from '../../entities/user/User';
import { UserModel } from '../../entities/user/User';
import { RefreshTokenModel } from '../../entities/user/RefreshToken';
import { loginSchema, refreshTokenSchema, registerSchema } from '../../shemas/auth';

export async function login(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', error: result.error });
    return;
  }

  const { username, password } = result.data;
  const user = await UserModel.findOne({ username });

  if (user != null && bcrypt.compareSync(password, user.password)) {
    const userId = user._id.toString();
    const accessToken = jwt.sign({ id: userId }, 'access_secret', {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign({ id: userId }, 'refresh_secret');
    await RefreshTokenModel.create({ token: refreshToken, userId });
    req.session.user = user.toObject();
    res.json({ accessToken, refreshToken });
  } else {
    res.status(400).json({ message: 'Username or password incorrect' });
  }
}

export async function refreshTokenFn(req: Request, res: Response): Promise<void> {
  const result = refreshTokenSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', error: result.error });
    return;
  }
  const { token } = result.data;
  const refreshToken = await RefreshTokenModel.findOne({ token });

  if (!refreshToken) {
    res.status(403).json({ message: 'Refresh token is not valid' });
    return;
  }

  jwt.verify(token, 'refresh_secret', (err, id) => {
    if (err) return res.status(403).json({ message: 'Refresh token is not valid' });
    const accessToken = jwt.sign({ id }, 'access_secret', { expiresIn: '30m' });
    res.json({ accessToken });
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  if (req.session.user) {
    await RefreshTokenModel.deleteMany({ userId: req.session.user._id.toString() });
    req.session.destroy((err) => {
      if (err != null) {
        return res.status(500).json({ message: 'Could not log out, please try again' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.status(400).json({ message: 'Not logged in' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', error: result.error });
    return;
  }
  const { username, password } = result.data;
  const userExists = await UserModel.findOne({ username });

  if (userExists) {
    res.status(400).json({ message: 'Username already exists' });
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await UserModel.create({ username, password: hashedPassword });
  const userId = newUser._id.toString();

  const accessToken = jwt.sign({ id: userId }, 'access_secret', { expiresIn: '30m' });
  const refreshToken = jwt.sign({ id: userId }, 'refresh_secret');
  await RefreshTokenModel.create({ token: refreshToken, userId });
  req.session.user = newUser.toObject();

  res.status(201).json({ accessToken, refreshToken });
}

declare module 'express-session' {
  interface SessionData {
    user: Required<{
      _id: Types.ObjectId;
    }> &
      UserEntity & {
        _id: Types.ObjectId;
      };
  }
}
