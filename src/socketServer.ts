import net from 'net';
import { config } from './config';

export class CameraSocketServer {
  private server: net.Server;
  private clients = new Set<net.Socket>();

  constructor() {
    this.server = net.createServer((socket) => this.handleConnection(socket));
  }

  start(): void {
    this.server.listen(config.cameraSocketPort, () => {
      console.log(`Servidor de sockets escuchando en el puerto ${config.cameraSocketPort}`);
    });
  }

  private handleConnection(socket: net.Socket): void {
    this.clients.add(socket);

    socket.on('close', () => this.clients.delete(socket));
    socket.on('error', () => this.clients.delete(socket));
  }

  // Notifica a todos los clientes conectados cuál es la cámara actualmente en programa
  broadcastActiveCamera(cameraNumber: number): void {
    for (const socket of this.clients) {
      socket.write(`${cameraNumber}\n`);
    }
  }
}
