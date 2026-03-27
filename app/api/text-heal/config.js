// API 路由专用配置文件
import { sceneList, getSceneById } from '../../lib/text-heal-scenes.js';

export function isValidScene(id) {
  return sceneList.some(scene => scene.id === id);
}

export { sceneList, getSceneById };
