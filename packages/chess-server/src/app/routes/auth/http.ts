import express from 'express';
import * as controller from '../../controllers/auth/http';

const authRouter = express.Router();

authRouter.post('/login', controller.login);
authRouter.post('/logout', controller.logout);
authRouter.post('/refreshToken', controller.refreshTokenFn);
authRouter.post('/register', controller.register);

export default authRouter;
