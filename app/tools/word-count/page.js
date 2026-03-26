'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WordCountPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleCount = () => {
    fetch('/api/stats/use', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_id: 'word-count' }) }).catch(() => { });

    if (!input) {
      setResult('请输入需要统计的文本！');
      return;
    }
    const totalChars = input.length;
    const charsWithoutSpace = input.replace(/\s/g, '').length;
    const chineseChars = input.replace(/[^\u4e00-\u9fa5]/g, '').length;
    const englishChars = input.replace(/[^a-zA-Z]/g, '').length;

    setResult(`
      总字符数：${totalChars}（含空格）<br>
      纯字符数：${charsWithoutSpace}（不含空格）<br>
      中文字符：${chineseChars} 个<br>
      英文字符：${englishChars} 个
    `);
  };

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <h2>字数统计工具</h2>
      <div className="tool-content">
        <textarea className="input-area" value={input} onChange={(e) => setInput(e.target.value)} placeholder="请输入需要统计的文本..." />
        <button className="btn" onClick={handleCount}>开始统计</button>
        <div className="result-area">
          <div className="result-title">统计结果：</div>
          <div dangerouslySetInnerHTML={{ __html: result || '请输入文本后点击「开始统计」' }} />
        </div>
        <Link href="/" className="back-btn">← 返回工具目录</Link>
      </div>
    </div>
  );
}
