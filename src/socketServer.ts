import net from 'net';
import { config } from './config';

const IDENTIFY_PREFIX = 'CAM:';

export class CameraSocketServer {
  private server: net.Server;
  private cameraSockets = new Map<number, Set<net.Socket>>();

  constructor() {
    this.server = net.createServer((socket) => this.handleConnection(socket));
  }

  start(): void {
    this.server.listen(config.cameraSocketPort, () => {
      console.log(`Servidor de cámaras escuchando en el puerto ${config.cameraSocketPort}`);
    });
  }

  // Cada celular, al conectarse, debe identificarse enviando "CAM:<numero>\n"
  private handleConnection(socket: net.Socket): void {
    let cameraNumber: number | undefined;

    socket.on('data', (data) => {
      if (cameraNumber !== undefined) return;

      const text = data.toString().trim();
      if (!text.startsWith(IDENTIFY_PREFIX)) return;

      const parsed = Number(text.slice(IDENTIFY_PREFIX.length));
      if (!Number.isInteger(parsed)) return;

      cameraNumber = parsed;
      this.registerSocket(cameraNumber, socket);
    });

    socket.on('close', () => {
      if (cameraNumber !== undefined) {
        this.unregisterSocket(cameraNumber, socket);
      }
    });

    socket.on('error', () => {
      if (cameraNumber !== undefined) {
        this.unregisterSocket(cameraNumber, socket);
      }
    });
  }

  private registerSocket(cameraNumber: number, socket: net.Socket): void {
    if (!this.cameraSockets.has(cameraNumber)) {
      this.cameraSockets.set(cameraNumber, new Set());
    }
    this.cameraSockets.get(cameraNumber)!.add(socket);
    console.log(`Celular identificado como cámara ${cameraNumber}`);
  }

  private unregisterSocket(cameraNumber: number, socket: net.Socket): void {
    this.cameraSockets.get(cameraNumber)?.delete(socket);
  }

  // Envía verde a la cámara activa y rojo a todas las demás
  broadcastActiveCamera(activeCameraNumber: number, allCameraNumbers: number[]): void {
    for (const cameraNumber of allCameraNumbers) {
      const signal = cameraNumber === activeCameraNumber ? 'GREEN' : 'RED';
      const sockets = this.cameraSockets.get(cameraNumber);
      if (!sockets) continue;

      for (const socket of sockets) {
        socket.write(`${signal}\n`);
      }
    }
  }
}
