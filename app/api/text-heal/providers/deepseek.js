export class DeepSeekProvider {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
  }

  async heal(text, scene) {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的文案优化助手。用户会输入一段文本和一个使用场景，你需要根据场景优化这段文本，使其更得体、更有吸引力、更符合场景特点。

场景：${scene}
要求：
1. 保持原意不变
2. 提升表达质量
3. 适应场景特点
4. 只返回优化后的文本，不要解释`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`DeepSeek API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export const deepseekProvider = new DeepSeekProvider();
