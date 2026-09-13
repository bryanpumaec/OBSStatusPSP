import 'dotenv/config';
import path from 'path';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const config = {
  obsUrl: required('OBS_WEBSOCKET_URL'),
  obsPassword: process.env.OBS_WEBSOCKET_PASSWORD ?? '',
  cameraSocketPort: Number(process.env.CAMERA_SOCKET_PORT ?? 9000),
  sceneMapPath: path.resolve(process.env.SCENE_MAP_PATH ?? './config/scene-camera-map.json'),
};
