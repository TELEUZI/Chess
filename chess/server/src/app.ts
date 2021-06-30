import WebSocketServer from 'ws';
import * as http from 'http';

class SocketServer {
  clients: WebSocketServer[];
  constructor() {
    this.clients = [];
    const server = http.createServer((request:http.IncomingMessage, response:http.ServerResponse) => {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      console.log(`${new Date()} Received request for ${request.url}`);
      response.writeHead(404, {
        'Content-Type': 'application/json',
      });
      response.end();
    });
    server.listen(8000, () => {
      console.log(`${new Date()} Server is listenings on port 8000`);
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
        let parsed: any;
        connection.on('message', (message: string) => {
          parsed = JSON.parse(message);
          console.log('type:', parsed.type, '\ndata:', parsed.data);
          if ( parsed.type === 'name') {
              this.clients.forEach((it: WebSocketServer) => {
                if(it.readyState === 1) it.send(JSON.stringify(parsed.data));
            });
            console.log(`Received Message: ${message}`, `clients -> ${this.clients.length}`);}

            // parsed = JSON.parse(message)
          // } else if (message instanceof Buffer) {
          //   console.log(`Received Binary Message of ${message.length} bytes`);
          //   // parsed = message.toJSON();
          // }

        connection.on('close', (client: WebSocketServer, code: number, reason: string) => {
          this.clients = this.clients.filter((it: WebSocketServer) => it !== client);
          console.log(`${new Date()} Client ${request.socket?.remoteAddress} disconnected with reason: ${reason} and code: ${code}.`);
        });
      },
    );
  })}
}
const socketServer = new SocketServer();
