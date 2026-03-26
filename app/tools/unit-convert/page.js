'use client';

import { useState } from 'react';
import Link from 'next/link';

const unitConfig = {
  length: {
    m: { name: '米 (m)', rate: 1 },
    km: { name: '千米 (km)', rate: 0.001 },
    cm: { name: '厘米 (cm)', rate: 100 },
    mm: { name: '毫米 (mm)', rate: 1000 },
    chi: { name: '尺', rate: 3 },
    cun: { name: '寸', rate: 30 },
  },
  weight: {
    kg: { name: '公斤 (kg)', rate: 1 },
    jin: { name: '斤', rate: 2 },
    g: { name: '克 (g)', rate: 1000 },
    t: { name: '吨 (t)', rate: 0.001 },
  },
  area: {
    m2: { name: '平方米 (m²)', rate: 1 },
    km2: { name: '平方千米 (km²)', rate: 1e-6 },
    hectare: { name: '公顷', rate: 0.0001 },
    mu: { name: '亩', rate: 0.0015 },
  },
};

export default function UnitConvertPage() {
  const [type, setType] = useState('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState('请输入数值并选择单位后点击「开始换算」');

  const handleTypeChange = (newType) => {
    setType(newType);
    const units = Object.keys(unitConfig[newType]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const handleConvert = () => {
    fetch('/api/stats/use', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_id: 'unit-convert' }) }).catch(() => { });

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('请输入有效的数值！');
      return;
    }

    const fromRate = unitConfig[type][fromUnit].rate;
    const toRate = unitConfig[type][toUnit].rate;
    const baseValue = numValue / fromRate;
    const resultValue = baseValue * toRate;

    setResult(`${numValue} ${unitConfig[type][fromUnit].name} = ${resultValue.toFixed(6)} ${unitConfig[type][toUnit].name}`);
  };

  const handleReset = () => {
    setValue('');
    setResult('请输入数值并选择单位后点击「开始换算」');
  };

  const currentUnits = Object.entries(unitConfig[type]);

  return (
    <div className="tool-page" style={{ display: 'block' }}>
      <h2>常用单位换算工具</h2>
      <div className="tool-content">
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '16px', marginRight: '10px' }}>换算类型：</label>
          <select value={type} onChange={(e) => handleTypeChange(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}>
            <option value="length">长度换算（米/千米/厘米/毫米/尺/寸）</option>
            <option value="weight">重量换算（公斤/斤/克/千克/吨）</option>
            <option value="area">面积换算（平方米/平方千米/公顷/亩）</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="请输入数值"
            style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', minWidth: '200px' }} />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', minWidth: '150px' }}>
            {currentUnits.map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
          <span style={{ alignSelf: 'center', fontSize: '18px' }}>→</span>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', minWidth: '150px' }}>
            {currentUnits.map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={handleConvert}>开始换算</button>
        <button className="btn" onClick={handleReset}>清空</button>
        <div className="result-area">
          <div className="result-title">换算结果：</div>
          <div>{result}</div>
        </div>
        <Link href="/" className="back-btn">← 返回工具目录</Link>
      </div>
    </div>
  );
}
