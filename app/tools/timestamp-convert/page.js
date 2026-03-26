'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TimestampConvertPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'timestamp-convert' })
    }).catch(() => { });

    const trimmedInput = input.trim();
    let convertedResult = '';

    if (!trimmedInput) {
      convertedResult = '请输入时间戳或日期！';
    } else if (/^\d+$/.test(trimmedInput)) {
      const timestamp = parseInt(trimmedInput);
      const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
      convertedResult = `时间戳(${trimmedInput}) → 日期：${date.toLocaleString('zh-CN')}`;
    } else {
      try {
        const timestamp = new Date(trimmedInput).getTime() / 1000;
        convertedResult = `日期(${trimmedInput}) → 时间戳：${Math.floor(timestamp)}（秒） / ${Math.floor(timestamp) * 1000}（毫秒）`;
      } catch (e) {
        convertedResult = '日期格式错误！请输入如：2026-03-18 12:00:00';
      }
    }

    setResult(convertedResult);
  };

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <h2>时间戳转换工具</h2>
      <div className="tool-content">
        <input type="text" className="input-area" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="请输入时间戳（如：1710864000）或普通日期（如：2026-03-18）" style={{ minHeight: 'auto', height: '50px' }} />
        <button className="btn" onClick={handleConvert}>开始转换</button>
        <div className="result-area">
          <div className="result-title">转换结果：</div>
          <div>{result || '请输入内容后点击「开始转换」'}</div>
        </div>
        <Link href="/" className="back-btn">← 返回工具目录</Link>
      </div>
    </div>
  );
}
