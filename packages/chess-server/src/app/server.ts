import * as http from 'http';
import type { NextFunction, Request, Response } from 'express';
import WebSocket from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';

import express from 'express';
import session from 'express-session';
import buildWsRouting from './routes/index/ws';
import { router } from './routes/index/http';
import { connectToMongo } from './db';
import { sessionOptions } from './middlewares/session';

const host = 'localhost';
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT ?? DEFAULT_PORT;

export interface ServerItems {
  app: express.Express;
  server: http.Server;
  wss: WebSocket.Server;
}
export async function setUpServer(): Promise<ServerItems> {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(session(sessionOptions));

  app.use('/assets', express.static(path.join(__dirname, 'assets')));

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  app.use(router);
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Http error:', error);
    if (res.headersSent) {
      next(error);
      return;
    }
    res.status(500).json({ error: error.message });
  });
  buildWsRouting(wss);
  wss.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  const { sep } = path;
  const appBuildPath = path.join(__dirname, `..${sep}..${sep}packages${sep}chess-client${sep}`);
  app.use(express.static(appBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(appBuildPath, 'index.html'));
  });
  await connectToMongo();
  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') console.debug(`listening on ${host}:${PORT}`);
      resolve();
    });
  });
  return { app, server, wss };
}

export async function tearDownServerItems({ server, wss }: ServerItems): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close((err) => {
      if (err != null) {
        console.error(err);
      }
      resolve();
    });
  });

  await new Promise<void>((resolve) => {
    wss.close((err) => {
      if (err != null) {
        console.error(err);
      }
      resolve();
    });
  });
}
