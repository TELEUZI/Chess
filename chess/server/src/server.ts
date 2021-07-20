import * as http from 'http';
import express, { NextFunction, Request, Response } from 'express';
import WebSocket from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import buildWsRouting from './routes/index/ws';
import { router } from './routes/index/http';

const host = '0.0.0.0';
const PORT = process.env.PORT || 5000;

export interface ServerItems {
  app: express.Express;
  server: http.Server;
  wss: WebSocket.Server;
}
export async function setUpServer(): Promise<ServerItems> {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  app.use(cors());
  app.use(helmet());
  app.use(router);
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Http error:', error);
    if (res.headersSent) {
      return next(error);
    }
    res.status(500).json({ error: error.message });
  });
  buildWsRouting(wss);
  wss.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  const { sep } = path;
  const appBuildPath = path.join(__dirname, `..${sep}..${sep}client${sep}dist${sep}`);
  console.log(appBuildPath);
  app.use(express.static(appBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(appBuildPath), 'index.html');
  });
  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') console.log(`listening on ${host}:${PORT}`);
      resolve();
    });
  });
  return { app, server, wss };
}

export async function tearDownServerItems({ server, wss }: ServerItems): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close((err) => {
      if (err !== null) {
        console.error(err);
      }
      resolve();
    });
  });

  await new Promise<void>((resolve) => {
    wss.close((err) => {
      if (err !== null) {
        console.error(err);
      }
      resolve();
    });
  });
}
