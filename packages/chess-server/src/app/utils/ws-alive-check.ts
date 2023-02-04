import WebSocket from 'ws';

export default function isReadyWS(ws: WebSocket): boolean {
  return ws.readyState === WebSocket.OPEN;
}
