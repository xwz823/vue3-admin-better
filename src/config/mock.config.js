/**
 * @description Mock 数据配置
 * 用于控制哪些接口使用 Mock 数据，哪些调用真实后端
 */

const mockConfig = {
  // ============ 全局配置 ============
  
  /**
   * 是否启用 Mock
   * true: 启用 Mock（根据白名单/黑名单规则）
   * false: 完全禁用 Mock，所有请求走真实后端
   */
  enableMock: true,

  /**
   * Mock 模式
   * 'whitelist': 白名单模式 - 只有在 mockWhiteList 中的接口才使用 Mock
   * 'blacklist': 黑名单模式 - 除了在 mockBlackList 中的接口，其他都使用 Mock
   * 'all': 全部 Mock - 所有接口都使用 Mock（默认模式）
   */
  mockMode: 'whitelist',

  // ============ 白名单模式配置 ============
  
  /**
   * Mock 白名单
   * 当 mockMode = 'whitelist' 时生效
   * 只有在此列表中的接口才会使用 Mock 数据
   * 
   * 支持三种匹配方式：
   * 1. 精确匹配: '/vab-mock-server/user/login'
   * 2. 前缀匹配: '/vab-mock-server/user/*' (匹配所有 user 相关接口)
   * 3. 正则匹配: /\/user\/.*\/detail/ (使用正则表达式)
   */
  mockWhiteList: [
    // ========== 用户相关接口 ==========
    '/vab-mock-server/login',           // 用户登录
    '/vab-mock-server/logout',          // 用户登出
    '/vab-mock-server/userInfo',        // 获取用户信息
    '/vab-mock-server/register',        // 用户注册
    
    // ========== 路由相关接口 ==========
    '/vab-mock-server/menu/navigate',   // 获取导航菜单
    
    // ========== 表格相关接口 ==========
    '/vab-mock-server/table/getList',   // 获取表格列表
    '/vab-mock-server/table/doEdit',    // 编辑表格数据
    '/vab-mock-server/table/doDelete',  // 删除表格数据
    '/vab-mock-server/table/*',         // 表格相关所有接口
    
    // ========== 树形数据接口 ==========
    '/vab-mock-server/tree/list',       // 获取树形列表
    '/vab-mock-server/tree/*',          // 树形数据所有接口
    
    // ========== 图标相关接口 ==========
    '/vab-mock-server/icon/list',       // 获取图标列表
    '/vab-mock-server/icon/getList',    // 获取图标列表（别名）
    '/vab-mock-server/icon/*',          // 图标相关所有接口
    
    // ========== 外部 API（暂时不 Mock，保持原样） ==========
    // 'https://api.vuejs-core.cn/getNotice',  // 公告接口（外部API）
    // 'https://api.vuejs-core.cn/getAd',      // 广告接口（外部API）
    // 'https://api.github.com/*',             // GitHub API（外部API）
  ],

  // ============ 黑名单模式配置 ============
  
  /**
   * Mock 黑名单
   * 当 mockMode = 'blacklist' 时生效
   * 在此列表中的接口将调用真实后端，其他接口使用 Mock
   * 
   * 支持三种匹配方式（同白名单）
   */
  mockBlackList: [
    // 示例：这些接口调用真实后端
    // '/vab-mock-server/product/*',      // 商品相关接口
    // '/vab-mock-server/order/*',        // 订单相关接口
    // '/vab-mock-server/payment/*',      // 支付相关接口
  ],

  // ============ 真实后端配置 ============
  
  /**
   * 真实后端 API 地址
   * 当接口不使用 Mock 时，将请求此地址
   */
  realApiConfig: {
    // 开发环境真实后端地址
    dev: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
    // 生产环境真实后端地址
    prod: process.env.VUE_APP_API_BASE_URL || 'https://api.yourdomain.com',
  },

  // ============ 调试配置 ============
  
  /**
   * 是否在控制台打印 Mock 信息
   * true: 打印每个请求是使用 Mock 还是真实 API
   * false: 不打印
   */
  debug: true,

  /**
   * 控制台日志样式
   */
  logStyle: {
    mock: 'color: #67C23A; font-weight: bold; background: #f0f9ff; padding: 2px 8px; border-radius: 3px;',
    real: 'color: #409EFF; font-weight: bold; background: #ecf5ff; padding: 2px 8px; border-radius: 3px;',
    error: 'color: #F56C6C; font-weight: bold; background: #fef0f0; padding: 2px 8px; border-radius: 3px;',
  },
};

/**
 * 检查 URL 是否匹配规则
 * @param {string} url - 请求 URL
 * @param {Array} rules - 匹配规则列表
 * @returns {boolean}
 */
function matchRule(url, rules) {
  if (!rules || rules.length === 0) return false;

  return rules.some(rule => {
    // 1. 正则表达式匹配
    if (rule instanceof RegExp) {
      return rule.test(url);
    }

    // 2. 通配符匹配
    if (rule.includes('*')) {
      const regexPattern = rule
        .replace(/\*/g, '.*')           // * 转换为 .*
        .replace(/\//g, '\\/');         // / 转义
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(url);
    }

    // 3. 精确匹配
    return url === rule || url.startsWith(rule);
  });
}

/**
 * 判断是否应该使用 Mock
 * @param {string} url - 请求 URL
 * @returns {boolean}
 */
export function shouldUseMock(url) {
  // 如果全局禁用 Mock，直接返回 false
  if (!mockConfig.enableMock) {
    return false;
  }

  // 根据不同模式判断
  switch (mockConfig.mockMode) {
    case 'whitelist':
      // 白名单模式：只有在白名单中的才使用 Mock
      return matchRule(url, mockConfig.mockWhiteList);

    case 'blacklist':
      // 黑名单模式：不在黑名单中的才使用 Mock
      return !matchRule(url, mockConfig.mockBlackList);

    case 'all':
    default:
      // 全部 Mock 模式
      return true;
  }
}

/**
 * 获取真实 API 地址
 * @returns {string}
 */
export function getRealApiUrl() {
  const env = process.env.NODE_ENV || 'dev';
  return mockConfig.realApiConfig[env] || mockConfig.realApiConfig.dev;
}

/**
 * 打印调试信息
 * @param {string} url - 请求 URL
 * @param {boolean} useMock - 是否使用 Mock
 */
export function logMockInfo(url, useMock) {
  if (!mockConfig.debug) return;

  const type = useMock ? '🟢 Mock' : '🔵 Real API';
  const style = useMock ? mockConfig.logStyle.mock : mockConfig.logStyle.real;
  
  console.log(
    `%c[${type}] ${url}`,
    style
  );
}

/**
 * 获取配置信息（用于调试）
 * @returns {Object}
 */
export function getMockConfig() {
  return {
    enableMock: mockConfig.enableMock,
    mockMode: mockConfig.mockMode,
    debug: mockConfig.debug,
    whiteListCount: mockConfig.mockWhiteList.length,
    blackListCount: mockConfig.mockBlackList.length,
  };
}

export default mockConfig;
