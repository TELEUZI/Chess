import express from 'express';
import roomRouter from '../rooms/http';

export const router = express.Router();

router.get('/healthCheck', (req, res) => {
  res.sendStatus(200);
});

router.use('/rooms', roomRouter);
