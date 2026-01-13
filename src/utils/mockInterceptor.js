import { shouldUseMock, getRealApiUrl, logMockInfo } from '@/config/mock.config';
import { baseURL } from '@/config';

/**
 * Mock 请求拦截器
 * 根据配置决定请求是使用 Mock 还是真实 API
 * @param {Object} config - Axios 请求配置
 * @returns {Object} 修改后的配置
 */
export function mockRequestInterceptor(config) {
  // 获取完整的请求 URL
  const fullUrl = config.url.startsWith('http') 
    ? config.url 
    : `${config.baseURL || baseURL}${config.url}`;

  // 判断是否使用 Mock
  const useMock = shouldUseMock(fullUrl);

  // 打印调试信息
  logMockInfo(fullUrl, useMock);

  // 根据判断结果修改 baseURL
  if (!useMock) {
    // 使用真实 API
    const realApiUrl = getRealApiUrl();
    
    // 如果原 URL 包含 Mock Server 路径，需要替换
    if (config.url.includes('/vab-mock-server/')) {
      config.url = config.url.replace('/vab-mock-server/', '/');
    }
    
    // 设置真实 API 的 baseURL
    config.baseURL = realApiUrl;
    
    // 可以在这里添加真实 API 需要的额外配置
    // 例如：不同的认证方式、额外的 headers 等
    // config.headers['X-Real-API'] = 'true';
  }

  return config;
}

/**
 * 批量配置接口 Mock 状态的辅助函数
 * 用于在代码中快速标记某个接口是否使用 Mock
 * 
 * @example
 * import { markAsMock, markAsReal } from '@/utils/mockInterceptor';
 * 
 * // 标记为使用 Mock
 * export function getUserList() {
 *   return request({
 *     url: '/user/list',
 *     method: 'get',
 *     ...markAsMock()  // 强制使用 Mock
 *   });
 * }
 * 
 * // 标记为使用真实 API
 * export function createOrder(data) {
 *   return request({
 *     url: '/order/create',
 *     method: 'post',
 *     data,
 *     ...markAsReal()  // 强制使用真实 API
 *   });
 * }
 */

/**
 * 标记请求强制使用 Mock
 * @returns {Object}
 */
export function markAsMock() {
  return {
    headers: {
      'X-Force-Mock': 'true'
    }
  };
}

/**
 * 标记请求强制使用真实 API
 * @returns {Object}
 */
export function markAsReal() {
  return {
    headers: {
      'X-Force-Real': 'true'
    }
  };
}

/**
 * 检查请求是否被标记为强制 Mock 或真实 API
 * @param {Object} config - Axios 请求配置
 * @returns {string|null} 'mock' | 'real' | null
 */
export function checkForceMode(config) {
  const headers = config.headers || {};
  
  if (headers['X-Force-Mock'] === 'true') {
    return 'mock';
  }
  
  if (headers['X-Force-Real'] === 'true') {
    return 'real';
  }
  
  return null;
}
