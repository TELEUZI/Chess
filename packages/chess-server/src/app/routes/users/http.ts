import express from 'express';
import * as controller from '../../controllers/users/http';

const usersRouter = express.Router();
usersRouter.get('/', controller.getUsers);
usersRouter.get('/:id', controller.getUser);
usersRouter.post('/', controller.createUser);
usersRouter.put('/:id', controller.updateUser);
usersRouter.delete('/:id', controller.deleteUser);

export default usersRouter;
