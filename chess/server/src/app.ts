import WebSocketServer from 'ws';
import http from 'http';

class SocketServer {
  clients: WebSocketServer[];
  constructor() {
    this.clients = [];

    const server = http.createServer((request, response) => {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      console.log(`${new Date()} Received request for ${request.url}`);
      response.writeHead(404, {
        'Content-Type': 'application/json',
      });
      response.end();
    });
    server.listen(8080, () => {
      console.log(`${new Date()} Server is listening on port 8080`);
    });

    const wsServer = new WebSocketServer.Server({ server });

    wsServer.on(
      'connection',
      (
        connection: WebSocketServer,
        request: http.IncomingMessage,
      ) => {
        this.clients.push(connection);
        console.log(`${new Date()} Connection accepted.`);
        connection.on('message', (message: WebSocketServer.Data) => {
          if (typeof message === 'string') {
            console.log(`Received Message: ${message}`, `clients -> ${this.clients.length}`);
          } else if (message instanceof Buffer) {
            console.log(`Received Binary Message of ${message.length} bytes`);
          }
          this.clients.forEach((it: WebSocketServer) => it.send(message));
        });
        connection.on('close', (client: WebSocketServer, code: number, reason: string) => {
          this.clients = this.clients.filter((it: WebSocketServer) => it !== client);
          console.log(`${new Date()} Client ${request.socket?.remoteAddress} disconnected with reason: ${reason} and code: ${code}.`);
        });
      },
    );
  }
}
const socketServer = new SocketServer();
