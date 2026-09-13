import OBSWebSocket from 'obs-websocket-js';
import { config } from './config';

export type SceneChangedHandler = (sceneName: string) => void;

export class ObsConnection {
  private obs = new OBSWebSocket();

  async connect(): Promise<void> {
    await this.obs.connect(config.obsUrl, config.obsPassword);
    console.log(`Conectado a OBS en ${config.obsUrl}`);
  }

  onProgramSceneChanged(handler: SceneChangedHandler): void {
    this.obs.on('CurrentProgramSceneChanged', (data) => {
      handler(data.sceneName);
    });
  }
}
