import express from 'express';
import roomRouter from '../rooms/http';
import usersRouter from '../users/http';
import authRouter from '../auth/http';

export const router = express.Router();

router.get('/healthCheck', (req, res) => {
  res.sendStatus(200);
});

router.use('/rooms', roomRouter);

router.use('/users', usersRouter);

router.use('/auth', authRouter);
