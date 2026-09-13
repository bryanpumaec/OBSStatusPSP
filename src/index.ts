import { loadSceneCameraMap, getCameraForScene, getAllCameraNumbers } from './sceneMap';
import { CameraSocketServer } from './socketServer';
import { ObsConnection } from './obsConnection';

async function main(): Promise<void> {
  const sceneMap = loadSceneCameraMap();
  const allCameraNumbers = getAllCameraNumbers(sceneMap);

  const socketServer = new CameraSocketServer();
  socketServer.start();

  const obs = new ObsConnection();
  obs.onProgramSceneChanged((sceneName) => {
    const cameraNumber = getCameraForScene(sceneMap, sceneName);
    if (cameraNumber === undefined) {
      console.warn(`La escena "${sceneName}" no está mapeada a ninguna cámara`);
      return;
    }

    console.log(`Escena en programa: "${sceneName}" -> cámara ${cameraNumber}`);
    socketServer.broadcastActiveCamera(cameraNumber, allCameraNumbers);
  });

  await obs.connect();
}

main().catch((error) => {
  console.error('Error iniciando la aplicación:', error);
  process.exit(1);
});
