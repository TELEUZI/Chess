import express from 'express';
import * as controller from '../../controllers/rooms/http';

const roomRouter = express.Router();
roomRouter.get('/', controller.getRooms);
roomRouter.get('/:roomName', controller.getRoom);
roomRouter.post('/:roomName', controller.createRoom);
roomRouter.put('/:roomName/players', controller.addPlayer);
export default roomRouter;
