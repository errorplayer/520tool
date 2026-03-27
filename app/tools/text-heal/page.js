'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sceneList, getSceneById } from '../../lib/text-heal-scenes';

// 可用的 AI 模型提供商
const PROVIDERS = [
  { id: 'kimi', name: 'Kimi', icon: '🤖', description: '月之暗面，支持多轮对话' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🧠', description: '深度求索，开源实力' },
];

export default function TextHeal() {
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('kimi');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState(null);

  const handleSceneSelect = (sceneId) => {
    setSelectedScene(sceneId);
    setError('');
  };

  const handleHeal = async () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'text-heal' })
    }).catch(() => { });
    if (!selectedScene) {
      setError('请选择使用场景');
      return;
    }
    if (!inputText.trim()) {
      setError('请输入需要优化的文本');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/text-heal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          sceneId: selectedScene,
          provider: selectedProvider,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error || '请求过于频繁，请稍后再试');
          setRateLimit(data.resetTime);
        } else {
          setError(data.error || '处理失败，请稍后重试');
        }
        return;
      }

      setResult(data.result);
      setRateLimit({
        remaining: data.remaining,
        resetTime: data.resetTime,
      });
    } catch (err) {
      setError('网络错误，请检查连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult('');
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('已复制到剪贴板');
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  const handleApply = () => {
    setInputText(result);
    setResult('');
  };

  const getSceneIcon = (id) => {
    const icons = {
      email: '📧',
      social: '💬',
      article: '📝',
      review: '⭐',
      chat: '💭',
    };
    return icons[id] || '🔧';
  };

  return (
    <div className="text-heal-page">
      <div className="tool-header">
        <h1>文本智能润色</h1>
        <p>AI 驱动，一键优化您的文本内容</p>
      </div>

      {/* 场景选择 */}
      <div className="scene-selector">
        <div className="scene-title">选择使用场景</div>
        <div className="scene-grid">
          {sceneList.map((scene) => (
            <div
              key={scene.id}
              className={`scene-card ${selectedScene === scene.id ? 'active' : ''}`}
              onClick={() => handleSceneSelect(scene.id)}
            >
              <div className="scene-icon">{getSceneIcon(scene.id)}</div>
              <div className="scene-name">{scene.name}</div>
              <div className="scene-desc">{scene.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 编辑区 */}
      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-label">输入文本</div>
          <div className="char-count">
            {inputText.length} / 2000 字
          </div>
        </div>
        <textarea
          className="editor-textarea"
          placeholder="请输入需要优化的文本..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
        />
        <div className="editor-footer">
          <div className="inline-provider-selector">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                className={`inline-provider-chip ${selectedProvider === provider.id ? 'active' : ''}`}
                onClick={() => setSelectedProvider(provider.id)}
                disabled={loading}
              >
                {provider.icon} {provider.name}
              </button>
            ))}
          </div>
          <button
            className="btn-clear"
            onClick={handleClear}
            disabled={loading}
          >
            清空
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* 操作栏 */}
      <div className="action-bar">
        <button
          className="btn-primary"
          onClick={handleHeal}
          disabled={loading || !selectedScene || !inputText.trim()}
        >
          {loading ? '处理中...' : '开始润色'}
        </button>
        {rateLimit && (
          <div className="rate-limit-info">
            本小时剩余次数: {rateLimit.remaining}
          </div>
        )}
      </div>

      {/* 结果展示区 */}
      {result && (
        <div className="result-container">
          <div className="result-header">
            <div className="result-label">优化结果</div>
            <div className="result-actions">
              <button className="btn-copy" onClick={handleCopy}>
                复制
              </button>
              <button className="btn-apply" onClick={handleApply}>
                应用到输入
              </button>
            </div>
          </div>
          <div className="result-content">{result}</div>
        </div>
      )}

      {loading && (
        <div className="result-container loading">
          <div className="loading-spinner"></div>
          <p>AI 正在精心优化您的文本...</p>
        </div>
      )}

      <Link href="/" className="back-btn">← 返回工具目录</Link>
    </div>
  );
}
