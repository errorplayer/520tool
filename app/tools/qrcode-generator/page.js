'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';

export default function QRCodeGeneratorPage() {
  const [content, setContent] = useState('');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [qrLoaded, setQrLoaded] = useState(false);
  const resultRef = useRef(null);

  const handleResetSize = () => {
    setWidth(200);
    setHeight(200);
  };

  const handleGenerate = () => {

     fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'qrcode-generator' })
    }).catch(() => { });
    if (!content) {
      alert('请输入二维码内容！');
      return;
    }
    
    if (!qrLoaded || typeof QRCode === 'undefined') {
      alert('二维码库加载中，请稍候...');
      return;
    }

    if (resultRef.current) {
      resultRef.current.innerHTML = '';
      new QRCode(resultRef.current, {
        text: content,
        width: width,
        height: height,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  };

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <Script 
        src="https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" 
        onReady={() => setQrLoaded(true)}
      />
      <h2>二维码生成器</h2>
      <div className="tool-content">
        <input type="text" className="input-area" value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="请输入文字、链接等内容（如：https://www.baidu.com）" style={{ minHeight: 'auto', height: '50px' }} />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <label>二维码尺寸：</label>
          <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 200)} placeholder="宽度(px)"
            style={{ width: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <span>×</span>
          <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 200)} placeholder="高度(px)"
            style={{ width: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <button className="btn" onClick={handleResetSize} style={{ padding: '8px 12px', fontSize: '14px' }}>重置为正方形</button>
        </div>
        <button className="btn" onClick={handleGenerate}>生成二维码</button>
        <div className="result-area">
          <div className="result-title">二维码预览：</div>
          <div ref={resultRef} style={{ textAlign: 'center', padding: '20px 0' }}>请输入内容后点击「生成二维码」</div>
        </div>
        <Link href="/" className="back-btn">← 返回工具目录</Link>
      </div>
    </div>
  );
}
