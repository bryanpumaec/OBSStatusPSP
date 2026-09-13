import fs from 'fs';
import { config } from './config';

export type SceneCameraMap = Record<string, number>;

export function loadSceneCameraMap(): SceneCameraMap {
  const raw = fs.readFileSync(config.sceneMapPath, 'utf-8');
  return JSON.parse(raw) as SceneCameraMap;
}

export function getCameraForScene(map: SceneCameraMap, sceneName: string): number | undefined {
  return map[sceneName];
}

export function getAllCameraNumbers(map: SceneCameraMap): number[] {
  return Array.from(new Set(Object.values(map)));
}
