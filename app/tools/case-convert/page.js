'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CaseConvertPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleToUpper = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'case-convert' })
    }).catch(() => { });
    setResult(input.toUpperCase())
  };
  const handleToLower = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'case-convert' })
    }).catch(() => { });
    setResult(input.toLowerCase())
  };
  const handleToTitle = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'case-convert' })
    }).catch(() => { }); 
    setResult(input.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\B\w/g, (c) => c.toLowerCase()))
  };

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <h2>大小写转换工具</h2>
      <div className="tool-content">
        <textarea className="input-area" value={input} onChange={(e) => setInput(e.target.value)} placeholder="请输入需要转换的文本（支持中英文混合）..." />
        <button className="btn" onClick={handleToUpper}>转全部大写</button>
        <button className="btn" onClick={handleToLower}>转全部小写</button>
        <button className="btn" onClick={handleToTitle}>转首字母大写</button>
        <div className="result-area">
          <div className="result-title">转换结果：</div>
          <div>{result || '请输入文本后选择转换类型'}</div>
        </div>
        <Link href="/" className="back-btn">← 返回工具目录</Link>
      </div>
    </div>
  );
}
