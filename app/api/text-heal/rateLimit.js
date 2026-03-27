// 限流模块 - 扩展性设计：可插拔，后期可替换为 Redis 方案

// 简易内存限流实现
const ipRequests = new Map();
const WINDOW_MS = 60 * 1000; // 时间窗口：1分钟
const MAX_REQUESTS = 10; // 每分钟最多10次请求

export function checkRateLimit(ip) {
  const now = Date.now();
  const requests = ipRequests.get(ip) || { count: 0, windowStart: now };

  // 如果时间窗口已过期，重置
  if (now - requests.windowStart > WINDOW_MS) {
    requests.count = 0;
    requests.windowStart = now;
  }

  // 检查是否超过限制
  if (requests.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: requests.windowStart + WINDOW_MS,
    };
  }

  // 增加计数
  requests.count += 1;
  ipRequests.set(ip, requests);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - requests.count,
    resetTime: requests.windowStart + WINDOW_MS,
  };
}

// 清理过期数据（定期调用）
export function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, requests] of ipRequests.entries()) {
    if (now - requests.windowStart > WINDOW_MS) {
      ipRequests.delete(ip);
    }
  }
}

// 每5分钟清理一次，防止内存泄漏
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

// 获取客户端 IP（从 headers 中提取）
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}
