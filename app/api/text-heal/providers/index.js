// Provider 注册与路由 - 扩展性设计：新增AI提供商只需添加一个文件并在这里注册

import { deepseekProvider } from './deepseek.js';
import { kimiProvider } from './kimi.js';

// Provider 注册表
const providers = {
  deepseek: deepseekProvider,
  kimi: kimiProvider,
};

// 当前使用的 Provider（可配置）
const activeProvider = 'kimi';

/**
 * 获取指定的 Provider
 * @param {string} providerName - Provider 名称，如 'kimi', 'deepseek'
 * @returns {object} Provider 实例
 */
export function getProvider(providerName) {
  const name = providerName || activeProvider;
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Provider "${name}" not found`);
  }
  return provider;
}

/**
 * 获取当前激活的 Provider（保持向后兼容）
 */
export function getActiveProvider() {
  return getProvider();
}

/**
 * 获取所有可用的 Provider
 */
export function getAvailableProviders() {
  return Object.keys(providers);
}

/**
 * 设置激活的 Provider（预留接口，后期可支持动态切换）
 */
export function setActiveProvider(providerName) {
  if (!(providerName in providers)) {
    throw new Error(`Provider "${providerName}" not available`);
  }
  // 注意：在生产环境中，这里应该更新配置而不是直接修改
  console.warn(`Switching provider to ${providerName} (runtime change)`);
}

// 重新导出便于直接使用
export { deepseekProvider, kimiProvider };
