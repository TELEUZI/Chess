import type { Request, Response } from 'express';

import { z } from 'zod';
import { UserModel } from '../../entities/user/User';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type UserSchema = z.infer<typeof userSchema>;

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserModel.find(); // Retrieve all users from the database
    res.send(users);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

// GET /users/:id
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId); // Retrieve a user by ID from the database

    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

// PUT /users/:id
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    const userData = userSchema.parse(req.body);
    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, { new: true }); // Update a user by ID in the database

    if (!updatedUser) {
      res.status(404).send('User not found');
    } else {
      res.send(updatedUser);
    }
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    await UserModel.findByIdAndDelete(userId); // Delete a user by ID from the database
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

// POST /users
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const userData = userSchema.parse(req.body);
    const newUser = await UserModel.create(userData); // Create a new user in the database

    res.send(newUser);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}
