/* eslint-disable no-param-reassign */
import type WebSocket from 'ws';
import qs from 'qs';
import buildRoomsRouting from '../rooms/ws';

export interface ExtentedWebsocket extends WebSocket {
  isAlive: boolean;
}

export default function buildWsRouting(wss: WebSocket.Server<ExtentedWebsocket>): void {
  wss.on('connection', (ws: ExtentedWebsocket, req) => {
    console.log('connection');
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    ws.on('error', (error) => {
      console.trace(error);
    });
    const { url } = req;
    if (url == null) {
      return;
    }
    const queryIndex = url.indexOf('?');
    const path = url.slice(0, queryIndex);
    const queryParams = qs.parse(url.slice(queryIndex + 1));
    switch (path) {
      case '/rooms':
        buildRoomsRouting(ws, queryParams);
        break;
      default:
        break;
    }
    ws.send('Connected.');
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach((ws: ExtentedWebsocket) => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, Number(process.env.PING_INTERVAL) || 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}
