'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NumberCaseConvertPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = () => {
    fetch('/api/stats/use', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_id: 'number-case-convert' }) }).catch(() => { });

    const trimmedInput = input.trim();
    if (!/^\d+(\.\d+)?$/.test(trimmedInput)) {
      setResult('请输入有效的阿拉伯数字！');
      return;
    }
    const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unitMap = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
    const [integerPart, decimalPart] = trimmedInput.split('.');

    let integerStr = '';
    for (let i = 0; i < integerPart.length; i++) {
      const digit = integerPart[i];
      integerStr += digitMap[digit] + unitMap[integerPart.length - 1 - i];
    }
    let decimalStr = '';
    if (decimalPart) {
      decimalStr = '点' + decimalPart.split('').map(d => digitMap[d]).join('');
    }
    setResult(integerStr + decimalStr);
  };

  const handleReset = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <h2>数字大小写转换工具（财务专用）</h2>
      <div className="tool-content">
        <input type="text" className="input-area" value={input} onChange={(e) => setInput(e.target.value)} placeholder="请输入阿拉伯数字（如：12345.67、999999999）"
          style={{ minHeight: 'auto', height: '50px' }} />
        <button className="btn" onClick={handleConvert}>转中文大写</button>
        <button className="btn" onClick={handleReset}>清空</button>
        <div className="result-area">
          <div className="result-title">转换结果：</div>
          <div>{result || '请输入数字后点击「转中文大写」'}</div>
        </div>
        <Link href="/" className="back-btn">← 返回工具目录</Link>
      </div>
    </div>
  );
}
