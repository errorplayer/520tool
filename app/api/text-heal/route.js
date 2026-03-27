// API 路由入口 - 统一网关
// 扩展性设计：串联所有模块，预留缓存接口

import { NextResponse } from 'next/server';
import { isValidScene, getSceneById } from './config.js';
import { checkRateLimit, getClientIp } from './rateLimit.js';
import { logUsage } from './logger.js';
import { getProvider } from './providers/index.js';

/**
 * POST /api/text-heal
 * Body: { text: string, sceneId: string }
 */
export async function POST(req) {
  try {
    // 1. 获取客户端 IP
    const ip = getClientIp(req);

    // 2. 限流检查
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: '请求过于频繁，请稍后再试',
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 }
      );
    }

    // 3. 解析请求体
    const { text, sceneId, provider } = await req.json();

    // 4. 参数校验
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '请输入需要优化的文本' },
        { status: 400 }
      );
    }

    if (!sceneId || typeof sceneId !== 'string') {
      return NextResponse.json(
        { error: '请选择使用场景' },
        { status: 400 }
      );
    }

    // 5. 验证场景
    if (!isValidScene(sceneId)) {
      return NextResponse.json(
        { error: '无效的场景ID' },
        { status: 400 }
      );
    }

    const scene = getSceneById(sceneId);

    // 6. 检查输入长度
    if (text.length > scene.inputLimit) {
      return NextResponse.json(
        { error: `输入文本过长，最多 ${scene.inputLimit} 字` },
        { status: 400 }
      );
    }

    // 7. 获取指定的 Provider
    const aiProvider = getProvider(provider);
    const startTime = Date.now();

    const resultText = await aiProvider.heal(text, scene.description || scene.name);

    const responseMs = Date.now() - startTime;

    // 8. 异步记录日志（不等待）
    logUsage({
      ip,
      sceneId,
      inputText: text,
      outputText: resultText,
      provider: aiProvider.constructor.name.replace('Provider', '').toLowerCase(),
      responseMs,
      tokensUsed: 0,
    });

    // 9. 返回结果
    return NextResponse.json({
      success: true,
      result: resultText,
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime,
    });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 预留 GET 接口用于获取场景列表
export async function GET() {
  const { sceneList } = await import('./config.js');
  return NextResponse.json({ scenes: sceneList });
}
