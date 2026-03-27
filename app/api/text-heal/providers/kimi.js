export class KimiProvider {
  constructor() {
    this.apiKey = process.env.KIMI_API_KEY;
    this.apiEndpoint = 'https://api.kimi.com/coding/v1/messages';
  }

  async heal(text, scene) {
    if (!this.apiKey) {
      throw new Error('KIMI_API_KEY is not configured');
    }

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify({
        model: 'kimi-coding',
        messages: [
          {
            role: 'user',
            content: `你是一个专业的文案优化助手。用户会输入一段文本和一个使用场景，你需要根据场景优化这段文本，使其更得体、更有吸引力、更符合场景特点。

场景：${scene}
要求：
1. 保持原意不变
2. 提升表达质量
3. 适应场景特点
4. 只返回优化后的文本，不要解释

请优化以下文本：
${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Kimi API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Kimi 返回格式与 Anthropic 一致
    if (data.content && Array.isArray(data.content) && data.content[0].text) {
      return data.content[0].text;
    }
    
    throw new Error('Unexpected response format from Kimi API');
  }
}

export const kimiProvider = new KimiProvider();
