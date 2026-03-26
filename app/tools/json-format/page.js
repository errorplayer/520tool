'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JsonFormatPage() {
  const [input, setInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [foldedPaths, setFoldedPaths] = useState(new Set());
  const [error, setError] = useState('');
  const [isCompressed, setIsCompressed] = useState(false);

  const handleFormat = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'json-format' })
    }).catch(() => { });

    try {
      const json = JSON.parse(input.trim());
      setParsedJson(json);
      setError('');
      setIsCompressed(false);
    } catch (e) {
      setError(`JSON格式错误：${e.message}`);
      setParsedJson(null);
    }
  };

  const handleCompress = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'json-format' })
    }).catch(() => { });

    try {
      const json = JSON.parse(input.trim());
      setParsedJson(json);
      setError('');
      setIsCompressed(true);
    } catch (e) {
      setError(`JSON格式错误：${e.message}`);
      setParsedJson(null);
    }
  };

  const handleValidate = () => {
    fetch('/api/stats/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: 'json-format' })
    }).catch(() => { });

    try {
      JSON.parse(input.trim());
      setError('');
      setParsedJson({ _valid: true, message: 'JSON格式合法！' });
      setIsCompressed(false);
    } catch (e) {
      setError(`JSON格式错误：${e.message}`);
      setParsedJson(null);
    }
  };

  const handleCopy = async () => {
    if (!parsedJson) return;
    try {
      const text = JSON.stringify(parsedJson, null, isCompressed ? 0 : 2);
      await navigator.clipboard.writeText(text);
      alert('复制成功！');
    } catch (err) {
      alert('复制失败，请手动复制！');
    }
  };

  const toggleFold = (path) => {
    const newFoldedPaths = new Set(foldedPaths);
    if (newFoldedPaths.has(path)) {
      newFoldedPaths.delete(path);
    } else {
      newFoldedPaths.add(path);
    }
    setFoldedPaths(newFoldedPaths);
  };

  const renderJsonNode = (value, path = '', indent = 0) => {
    const indentStr = '  '.repeat(indent);
    const isFolded = foldedPaths.has(path);

    if (value === null) {
      return <span className="json-null">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="json-boolean">{String(value)}</span>;
    }

    if (typeof value === 'number') {
      return <span className="json-number">{String(value)}</span>;
    }

    if (typeof value === 'string') {
      return <span className="json-string">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span>[]</span>;
      }

      const isArrayTop = path === '';
      const displayPath = isArrayTop ? 'root' : path;

      if (isFolded) {
        return (
          <span>
            <button
              className="json-toggle"
              onClick={() => toggleFold(path)}
              title="点击展开"
            >
              ▶
            </button>
            <span className="json-bracket">[</span>
            <span className="json-collapsed-hint">{value.length} items</span>
            <span className="json-bracket">]</span>
          </span>
        );
      }

      return (
        <div>
          <button
            className="json-toggle"
            onClick={() => toggleFold(path)}
            title="点击折叠"
          >
            ▼
          </button>
          <span className="json-bracket">[</span>
          {value.map((item, index) => (
            <div key={index} style={{ marginLeft: '20px' }}>
              {renderJsonNode(item, `${path}[${index}]`, indent + 1)}
              {index < value.length - 1 && <span>,</span>}
            </div>
          ))}
          <span className="json-bracket">]</span>
        </div>
      );
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return <span>{'{}'}</span>;
      }

      if (isFolded) {
        return (
          <span>
            <button
              className="json-toggle"
              onClick={() => toggleFold(path)}
              title="点击展开"
            >
              ▶
            </button>
            <span className="json-bracket">{'{'}</span>
            <span className="json-collapsed-hint">{keys.length} keys</span>
            <span className="json-bracket">{'}'}</span>
          </span>
        );
      }

      return (
        <div>
          <button
            className="json-toggle"
            onClick={() => toggleFold(path)}
            title="点击折叠"
          >
            ▼
          </button>
          <span className="json-bracket">{'{'}</span>
          {keys.map((key, index) => (
            <div key={key} style={{ marginLeft: '20px' }}>
              <span className="json-key">"{key}"</span>
              <span>: </span>
              {renderJsonNode(value[key], `${path}.${key}`, indent + 1)}
              {index < keys.length - 1 && <span>,</span>}
            </div>
          ))}
          <span className="json-bracket">{'}'}</span>
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <h2>JSON格式化工具</h2>
      <div className="tool-content">
        <textarea className="input-area" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="请输入需要格式化的JSON文本（支持未格式化/压缩的JSON）..." />
        <button className="btn" onClick={handleFormat}>格式化（美化）</button>
        <button className="btn" onClick={handleCompress}>压缩（精简）</button>
        <button className="btn" onClick={handleValidate}>校验合法性</button>
        <div className="result-area" style={{ marginTop: '20px' }}>
          <div className="result-title">处理结果：</div>
          <pre id="json-result" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {parsedJson && !parsedJson._valid ? (
              isCompressed ? (
                <span className="json-string">{JSON.stringify(parsedJson)}</span>
              ) : (
                <div>{renderJsonNode(parsedJson)}</div>
              )
            ) : parsedJson && parsedJson._valid ? (
              <span style={{ color: '#c3e88d' }}>{parsedJson.message}</span>
            ) : error ? (
              <span style={{ color: '#ff5370' }}>{error}</span>
            ) : (
              <span style={{ color: '#666' }}>请输入JSON文本后选择操作</span>
            )}

          </pre>
        </div>
        <button className="btn" style={{ marginTop: '10px' }} onClick={handleCopy} disabled={!parsedJson}>复制结果</button>
        <Link href="/" className="back-btn" style={{ marginLeft: '10px' }}>← 返回工具目录</Link>
      </div>
    </div>
  );
}
