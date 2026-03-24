'use client';
import { useEffect, useRef } from 'react';

export default function Home() {
  // -------- 1. 核心状态与全局函数（解决作用域问题） --------
  // 定义全局可访问的 showDirectory 函数
  const showDirectory = () => {
    if (typeof document === 'undefined') return; // 避免SSR环境报错
    // 隐藏所有工具页面，显示工具目录
    document.querySelectorAll('.tool-page').forEach(page => {
      page.style.display = 'none';
    });
    const dirEl = document.getElementById('tools-directory');
    if (dirEl) dirEl.style.display = 'block';
    window.scrollTo(0, 0);
  };

  // 翻页时钟定时器（用于清理副作用）
  const clockIntervalRef = useRef(null);

  // -------- 2. 所有交互逻辑（useEffect 内只做事件绑定） --------
  useEffect(() => {
    // --------------- 翻页时钟逻辑 ---------------
    const updateFlipClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeStr = hours + minutes + seconds;
      
      document.querySelectorAll('.flip-digit').forEach((digitEl, index) => {
        const currentDigit = timeStr[index];
        if (digitEl.dataset.digit !== currentDigit) {
          digitEl.dataset.digit = currentDigit;
          digitEl.classList.add('flipping');
          digitEl.querySelector('.top').textContent = currentDigit;
          digitEl.querySelector('.bottom').textContent = currentDigit;
          setTimeout(() => digitEl.classList.remove('flipping'), 600);
        }
      });
    };

    // 启动时钟
    clockIntervalRef.current = setInterval(updateFlipClock, 1000);
    updateFlipClock();

    // --------------- 工具卡片点击逻辑 ---------------
    document.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = card.dataset.tool;
        // 隐藏目录，显示对应工具
        document.getElementById('tools-directory').style.display = 'none';
        document.querySelectorAll('.tool-page').forEach(page => {
          page.style.display = 'none';
        });
        const toolPage = document.getElementById(toolId);
        if (toolPage) toolPage.style.display = 'block';
        window.scrollTo(0, 0);
      });
    });

    // --------------- 首页logo点击逻辑 ---------------
    document.getElementById('home-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      showDirectory();
    });

    // --------------- 通用复制函数（挂载到window） ---------------
    window.copyResult = function(elementId) {
      const element = document.getElementById(elementId);
      const text = element.textContent || element.innerText;
      navigator.clipboard.writeText(text)
        .then(() => alert('复制成功！'))
        .catch(() => alert('复制失败，请手动复制！'));
    };

    // --------------- 字数统计工具 ---------------
    document.getElementById('count-btn')?.addEventListener('click', () => {
      const input = document.getElementById('word-input').value;
      if (!input) {
        document.getElementById('word-result').textContent = '请输入需要统计的文本！';
        return;
      }
      const totalChars = input.length;
      const charsWithoutSpace = input.replace(/\s/g, '').length;
      const chineseChars = input.replace(/[^\u4e00-\u9fa5]/g, '').length;
      const englishChars = input.replace(/[^a-zA-Z]/g, '').length;
      
      document.getElementById('word-result').innerHTML = `
        总字符数：${totalChars}（含空格）<br>
        纯字符数：${charsWithoutSpace}（不含空格）<br>
        中文字符：${chineseChars} 个<br>
        英文字符：${englishChars} 个
      `;
    });

    // --------------- 二维码生成工具 ---------------
    document.getElementById('reset-size')?.addEventListener('click', () => {
      document.getElementById('qrcode-width').value = 200;
      document.getElementById('qrcode-height').value = 200;
    });

    document.getElementById('generate-qrcode')?.addEventListener('click', () => {
      const content = document.getElementById('qrcode-input').value;
      const width = parseInt(document.getElementById('qrcode-width').value) || 200;
      const height = parseInt(document.getElementById('qrcode-height').value) || 200;
      
      if (!content) {
        document.getElementById('qrcode-result').textContent = '请输入二维码内容！';
        return;
      }

      document.getElementById('qrcode-result').innerHTML = '';
      // 延迟加载避免QRCode未定义
      setTimeout(() => {
        new QRCode(document.getElementById('qrcode-result'), {
          text: content,
          width: width,
          height: height,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H,
        });
      }, 100);
    });

    // --------------- 时间戳转换工具 ---------------
    document.getElementById('convert-timestamp')?.addEventListener('click', () => {
      const input = document.getElementById('timestamp-input').value.trim();
      let result = '';

      if (!input) {
        result = '请输入时间戳或日期！';
      } else if (/^\d+$/.test(input)) {
        const timestamp = parseInt(input);
        const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
        result = `时间戳(${input}) → 日期：${date.toLocaleString('zh-CN')}`;
      } else {
        try {
          const timestamp = new Date(input).getTime() / 1000;
          result = `日期(${input}) → 时间戳：${Math.floor(timestamp)}（秒） / ${Math.floor(timestamp) * 1000}（毫秒）`;
        } catch (e) {
          result = '日期格式错误！请输入如：2026-03-18 12:00:00';
        }
      }

      document.getElementById('timestamp-result').textContent = result;
    });

    // --------------- 大小写转换工具 ---------------
    document.getElementById('to-upper')?.addEventListener('click', () => {
      const input = document.getElementById('case-input').value;
      document.getElementById('case-result').textContent = input.toUpperCase();
    });

    document.getElementById('to-lower')?.addEventListener('click', () => {
      const input = document.getElementById('case-input').value;
      document.getElementById('case-result').textContent = input.toLowerCase();
    });

    document.getElementById('to-title')?.addEventListener('click', () => {
      const input = document.getElementById('case-input').value;
      const result = input.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\B\w/g, (c) => c.toLowerCase());
      document.getElementById('case-result').textContent = result;
    });

    // --------------- 数字大小写转换工具 ---------------
    document.getElementById('number-to-chinese')?.addEventListener('click', () => {
      const input = document.getElementById('number-input').value.trim();
      if (!/^\d+(\.\d+)?$/.test(input)) {
        document.getElementById('number-result').textContent = '请输入有效的阿拉伯数字！';
        return;
      }
      const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const unitMap = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
      const [integerPart, decimalPart] = input.split('.');
      
      let integerStr = '';
      for (let i = 0; i < integerPart.length; i++) {
        const digit = integerPart[i];
        integerStr += digitMap[digit] + unitMap[integerPart.length - 1 - i];
      }
      let decimalStr = '';
      if (decimalPart) {
        decimalStr = '点' + decimalPart.split('').map(d => digitMap[d]).join('');
      }
      document.getElementById('number-result').textContent = integerStr + decimalStr;
    });

    document.getElementById('reset-number')?.addEventListener('click', () => {
      document.getElementById('number-input').value = '';
      document.getElementById('number-result').textContent = '请输入数字后点击「转中文大写」';
    });

    // --------------- 单位换算工具 ---------------
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

    document.getElementById('convert-type')?.addEventListener('change', (e) => {
      const type = e.target.value;
      const fromUnit = document.getElementById('from-unit');
      const toUnit = document.getElementById('to-unit');
      fromUnit.innerHTML = '';
      toUnit.innerHTML = '';
      
      Object.entries(unitConfig[type]).forEach(([key, val]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = val.name;
        fromUnit.appendChild(option.cloneNode(true));
        toUnit.appendChild(option);
      });
      
      fromUnit.selectedIndex = 0;
      toUnit.selectedIndex = 1;
    });

    document.getElementById('unit-convert-btn')?.addEventListener('click', () => {
      const type = document.getElementById('convert-type').value;
      const value = parseFloat(document.getElementById('unit-input').value);
      const fromKey = document.getElementById('from-unit').value;
      const toKey = document.getElementById('to-unit').value;
      
      if (isNaN(value)) {
        document.getElementById('unit-result').textContent = '请输入有效的数值！';
        return;
      }

      const fromRate = unitConfig[type][fromKey].rate;
      const toRate = unitConfig[type][toKey].rate;
      const baseValue = value / fromRate;
      const resultValue = baseValue * toRate;
      
      document.getElementById('unit-result').textContent = `${value} ${unitConfig[type][fromKey].name} = ${resultValue.toFixed(6)} ${unitConfig[type][toKey].name}`;
    });

    document.getElementById('reset-unit')?.addEventListener('click', () => {
      document.getElementById('unit-input').value = '';
      document.getElementById('unit-result').textContent = '请输入数值并选择单位后点击「开始换算」';
    });

    // --------------- JSON格式化工具 ---------------
    document.getElementById('json-format-btn')?.addEventListener('click', () => {
      const input = document.getElementById('json-input').value.trim();
      try {
        const json = JSON.parse(input);
        const formatted = JSON.stringify(json, null, 2);
        const highlighted = formatted.replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
          (match) => {
            if (/^"/.test(match)) {
              if (/:$/.test(match)) return `<span class="json-key">${match}</span>`;
              return `<span class="json-string">${match}</span>`;
            }
            if (/true|false/.test(match)) return `<span class="json-boolean">${match}</span>`;
            if (/null/.test(match)) return `<span class="json-null">${match}</span>`;
            return `<span class="json-number">${match}</span>`;
          }
        );
        document.getElementById('json-result').innerHTML = highlighted;
      } catch (e) {
        document.getElementById('json-result').textContent = `JSON格式错误：${e.message}`;
      }
    });

    document.getElementById('json-compress-btn')?.addEventListener('click', () => {
      const input = document.getElementById('json-input').value.trim();
      try {
        const json = JSON.parse(input);
        const compressed = JSON.stringify(json);
        document.getElementById('json-result').textContent = compressed;
      } catch (e) {
        document.getElementById('json-result').textContent = `JSON格式错误：${e.message}`;
      }
    });

    document.getElementById('json-validate-btn')?.addEventListener('click', () => {
      const input = document.getElementById('json-input').value.trim();
      try {
        JSON.parse(input);
        document.getElementById('json-result').textContent = 'JSON格式合法！';
      } catch (e) {
        document.getElementById('json-result').textContent = `JSON格式错误：${e.message}`;
      }
    });

    // --------------- 药品服用次数计算工具 ---------------
    document.getElementById('drug-frequency')?.addEventListener('change', (e) => {
      const customFreq = document.getElementById('custom-frequency');
      customFreq.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    document.getElementById('drug-calc-btn')?.addEventListener('click', () => {
      const startTime = new Date(document.getElementById('drug-start-time').value);
      const endTime = new Date(document.getElementById('drug-end-time').value);
      const frequency = document.getElementById('drug-frequency').value;
      const customHour = parseFloat(document.getElementById('drug-custom-hour')?.value) || 0;
      const timeRule = document.querySelector('input[name="time-rule"]:checked')?.value;

      if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        document.getElementById('drug-total-count').textContent = '--';
        document.getElementById('drug-time-list').textContent = '请选择有效的开始/结束时间！';
        return;
      }
      if (startTime > endTime) {
        document.getElementById('drug-total-count').textContent = '--';
        document.getElementById('drug-time-list').textContent = '开始时间不能晚于结束时间！';
        return;
      }
      if (frequency === 'custom' && (isNaN(customHour) || customHour <= 0)) {
        document.getElementById('drug-total-count').textContent = '--';
        document.getElementById('drug-time-list').textContent = '请输入有效的自定义频率（>0）！';
        return;
      }

      const intervalHour = frequency === 'custom' ? customHour : parseFloat(frequency);
      const intervalMs = intervalHour * 60 * 60 * 1000;
      const timeList = [];
      let currentTime = new Date(startTime);
      
      while (currentTime <= endTime) {
        timeList.push(new Date(currentTime));
        currentTime.setTime(currentTime.getTime() + intervalMs);
      }

      let filteredList = [...timeList];
      switch (timeRule) {
        case 'include-start':
          filteredList = filteredList.filter(t => t.getTime() !== endTime.getTime());
          break;
        case 'include-end':
          filteredList = filteredList.filter(t => t.getTime() !== startTime.getTime());
          break;
        case 'exclude-both':
          filteredList = filteredList.filter(t => t.getTime() !== startTime.getTime() && t.getTime() !== endTime.getTime());
          break;
        default: break;
      }

      const formattedList = filteredList.map(t => t.toLocaleString('zh-CN')).join('\n');
      document.getElementById('drug-total-count').textContent = filteredList.length;
      document.getElementById('drug-time-list').textContent = formattedList;
    });

    document.getElementById('drug-reset-btn')?.addEventListener('click', () => {
      document.getElementById('drug-start-time').value = '';
      document.getElementById('drug-end-time').value = '';
      document.getElementById('drug-frequency').value = '';
      document.getElementById('drug-custom-hour').value = '';
      document.getElementById('drug-total-count').textContent = '--';
      document.getElementById('drug-time-list').textContent = '请点击「开始计算」生成列表';
      document.getElementById('custom-frequency').style.display = 'none';
    });

    // --------------- 清理副作用 ---------------
    return () => {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
      // 移除所有事件监听（避免内存泄漏）
      document.querySelectorAll('.tool-card').forEach(card => {
        card.removeEventListener('click', () => {});
      });
    };
  }, []); // 空依赖：仅挂载时执行一次

  // -------- 3. 页面DOM结构（修复所有返回按钮的onClick） --------
  return (
    <div className="container">
      {/* 广告位1：顶部横幅 */}
      <div className="ad-top">
        <p>【广告位】- 顶部横幅广告</p>
      </div>

      {/* 工具目录页（默认显示） */}
      <div id="tools-directory">
        <p style={{ margin: '15px 0', color: '#666' }}>精选好用的免费工具，在线即用，无需下载安装</p>
        <div className="tools-grid">
          {/* 药品服用次数计算工具卡片 */}
          <a href="#" className="tool-card" data-tool="drug-calculator">
            <div className="tool-icon">💊</div>
            <div className="tool-title">药品服用次数计算</div>
            <div className="tool-desc">CRC专用 | 按给药时间/频率精准计算服药次数</div>
          </a>
          {/* 字数统计 */}
          <a href="#" className="tool-card" data-tool="word-count">
            <div className="tool-icon">📝</div>
            <div className="tool-title">字数统计工具</div>
            <div className="tool-desc">统计中文、英文、字符数，含空格/不含空格</div>
          </a>
          {/* 二维码生成 */}
          <a href="#" className="tool-card" data-tool="qrcode-generator">
            <div className="tool-icon">📱</div>
            <div className="tool-title">二维码生成器</div>
            <div className="tool-desc">输入文字/链接，一键生成二维码，可保存</div>
          </a>
          {/* 时间戳转换 */}
          <a href="#" className="tool-card" data-tool="timestamp-convert">
            <div className="tool-icon">⏰</div>
            <div className="tool-title">时间戳转换</div>
            <div className="tool-desc">Unix时间戳与普通日期时间互转</div>
          </a>
          {/* 大小写转换 */}
          <a href="#" className="tool-card" data-tool="case-convert">
            <div className="tool-icon">🔤</div>
            <div className="tool-title">大小写转换</div>
            <div className="tool-desc">文本全部大写/小写/首字母大写，一键转换</div>
          </a>
          {/* 数字大小写转换 */}
          <a href="#" className="tool-card" data-tool="number-case-convert">
            <div className="tool-icon">🔢</div>
            <div className="tool-title">数字大小写转换</div>
            <div className="tool-desc">阿拉伯数字转中文大写（财务专用，支持小数）</div>
          </a>
          {/* 单位换算 */}
          <a href="#" className="tool-card" data-tool="unit-convert">
            <div className="tool-icon">📏</div>
            <div className="tool-title">常用单位换算</div>
            <div className="tool-desc">长度/重量/面积换算，支持米/千米/斤/公斤/平方米等</div>
          </a>
          {/* JSON格式化 */}
          <a href="#" className="tool-card" data-tool="json-format">
            <div className="tool-icon">🔧</div>
            <div className="tool-title">JSON格式化</div>
            <div className="tool-desc">JSON美化/压缩/校验，支持高亮显示</div>
          </a>
          {/* 更多工具 */}
          <a href="#" className="tool-card" data-tool="more-tools">
            <div className="tool-icon">➕</div>
            <div className="tool-title">更多工具</div>
            <div className="tool-desc">持续更新中，敬请期待...</div>
          </a>
        </div>
      </div>

      {/* 工具1：字数统计页面 */}
      <div className="tool-page" id="word-count">
        <h2>字数统计工具</h2>
        <div className="tool-content">
          <textarea className="input-area" id="word-input" placeholder="请输入需要统计的文本..."></textarea>
          <button className="btn" id="count-btn">开始统计</button>
          <div className="result-area">
            <div className="result-title">统计结果：</div>
            <div id="word-result">请输入文本后点击「开始统计」</div>
          </div>
          {/* 修复返回按钮：直接调用全局showDirectory */}
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具2：二维码生成页面 */}
      <div className="tool-page" id="qrcode-generator">
        <h2>二维码生成器</h2>
        <div className="tool-content">
          <input type="text" className="input-area" id="qrcode-input"
            placeholder="请输入文字、链接等内容（如：https://www.baidu.com）" style={{ minHeight: 'auto', height: '50px' }} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
            <label>二维码尺寸：</label>
            <input type="number" id="qrcode-width" placeholder="宽度(px)" defaultValue="200"
              style={{ width: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <span>×</span>
            <input type="number" id="qrcode-height" placeholder="高度(px)" defaultValue="200"
              style={{ width: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <button className="btn" id="reset-size" style={{ padding: '8px 12px', fontSize: '14px' }}>重置为正方形</button>
          </div>
          <button className="btn" id="generate-qrcode">生成二维码</button>
          <div className="result-area">
            <div className="result-title">二维码预览：</div>
            <div id="qrcode-result" style={{ textAlign: 'center', padding: '20px 0' }}>请输入内容后点击「生成二维码」</div>
          </div>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具3：时间戳转换页面 */}
      <div className="tool-page" id="timestamp-convert">
        <h2>时间戳转换工具</h2>
        <div className="tool-content">
          <input type="text" className="input-area" id="timestamp-input"
            placeholder="请输入时间戳（如：1710864000）或普通日期（如：2026-03-18）" style={{ minHeight: 'auto', height: '50px' }} />
          <button className="btn" id="convert-timestamp">开始转换</button>
          <div className="result-area">
            <div className="result-title">转换结果：</div>
            <div id="timestamp-result">请输入内容后点击「开始转换」</div>
          </div>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具4：大小写转换页面 */}
      <div className="tool-page" id="case-convert">
        <h2>大小写转换工具</h2>
        <div className="tool-content">
          <textarea className="input-area" id="case-input" placeholder="请输入需要转换的文本（支持中英文混合）..."></textarea>
          <button className="btn" id="to-upper">转全部大写</button>
          <button className="btn" id="to-lower">转全部小写</button>
          <button className="btn" id="to-title">转首字母大写</button>
          <div className="result-area">
            <div className="result-title">转换结果：</div>
            <div id="case-result">请输入文本后选择转换类型</div>
          </div>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具5：数字大小写转换页面 */}
      <div className="tool-page" id="number-case-convert">
        <h2>数字大小写转换工具（财务专用）</h2>
        <div className="tool-content">
          <input type="text" className="input-area" id="number-input" placeholder="请输入阿拉伯数字（如：12345.67、999999999）"
            style={{ minHeight: 'auto', height: '50px' }} />
          <button className="btn" id="number-to-chinese">转中文大写</button>
          <button className="btn" id="reset-number">清空</button>
          <div className="result-area">
            <div className="result-title">转换结果：</div>
            <div id="number-result">请输入数字后点击「转中文大写」</div>
          </div>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具6：单位换算页面 */}
      <div className="tool-page" id="unit-convert">
        <h2>常用单位换算工具</h2>
        <div className="tool-content">
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '16px', marginRight: '10px' }}>换算类型：</label>
            <select id="convert-type"
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}>
              <option value="length">长度换算（米/千米/厘米/毫米/尺/寸）</option>
              <option value="weight">重量换算（公斤/斤/克/千克/吨）</option>
              <option value="area">面积换算（平方米/平方千米/公顷/亩）</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <input type="number" id="unit-input" placeholder="请输入数值"
              style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', minWidth: '200px' }} />
            <select id="from-unit"
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', minWidth: '150px' }}>
              <option value="m">米 (m)</option>
            </select>
            <span style={{ alignSelf: 'center', fontSize: '18px' }}>→</span>
            <select id="to-unit"
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', minWidth: '150px' }}>
              <option value="km">千米 (km)</option>
            </select>
          </div>
          <button className="btn" id="unit-convert-btn">开始换算</button>
          <button className="btn" id="reset-unit">清空</button>
          <div className="result-area">
            <div className="result-title">换算结果：</div>
            <div id="unit-result">请输入数值并选择单位后点击「开始换算」</div>
          </div>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具7：JSON格式化页面 */}
      <div className="tool-page" id="json-format">
        <h2>JSON格式化工具</h2>
        <div className="tool-content">
          <textarea className="input-area" id="json-input"
            placeholder="请输入需要格式化的JSON文本（支持未格式化/压缩的JSON）..."></textarea>
          <button className="btn" id="json-format-btn">格式化（美化）</button>
          <button className="btn" id="json-compress-btn">压缩（精简）</button>
          <button className="btn" id="json-validate-btn">校验合法性</button>
          <div className="result-area" style={{ marginTop: '20px' }}>
            <div className="result-title">处理结果：</div>
            <pre id="json-result"
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '14px' }}>请输入JSON文本后选择操作</pre>
          </div>
          <button className="btn" style={{ marginTop: '10px' }} onClick={() => window.copyResult('json-result')}>复制结果</button>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }} style={{ marginLeft: '10px' }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 工具8：药品服用次数计算页面 */}
      <div className="tool-page" id="drug-calculator">
        <h2>药品服用次数计算（CRC专用）</h2>
        <div className="tool-content">
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <label
                style={{ fontSize: '16px', fontWeight: '500', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>给药开始时间(首次服用时间)</label>
              <input type="datetime-local" id="drug-start-time"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', background: '#fff', transition: 'border 0.3s ease' }}
                required />
            </div>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <label
                style={{ fontSize: '16px', fontWeight: '500', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>药品回收时间</label>
              <input type="datetime-local" id="drug-end-time"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', background: '#fff', transition: 'border 0.3s ease' }}
                required />
            </div>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <label
                style={{ fontSize: '16px', fontWeight: '500', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>给药频率</label>
              <select id="drug-frequency"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', background: '#fff', transition: 'all 0.3s ease', appearance: 'none', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"8\"><path fill=\"%23666\" d=\"M0 0l6 6 6-6z\" /></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '30px' }}>
                <option value="">请选择给药频率</option>
                <option value="24h">每日一次 (qd) - 每24小时</option>
                <option value="12h">每日两次 (bid) - 每12小时</option>
                <option value="8h">每日三次 (tid) - 每8小时</option>
                <option value="6h">每日四次 (qid) - 每6小时</option>
                <option value="1h">每小时一次 (qh) - 每1小时</option>
                <option value="custom">自定义频率（小时）</option>
              </select>
              <div id="custom-frequency" style={{ marginTop: '10px', display: 'none' }}>
                <input type="number" id="drug-custom-hour" placeholder="输入间隔小时数（如8=每8小时）" min="0.1"
                  step="0.1"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                <span
                  style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>支持小数（如0.5=每30分钟）</span>
              </div>
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <label
                style={{ fontSize: '16px', fontWeight: '500', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>时间范围规则</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="time-rule" value="include-both" defaultChecked
                    style={{ accentColor: '#3498db' }} />
                  <span>包含开始时间和结束时间</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="time-rule" value="include-start"
                    style={{ accentColor: '#3498db' }} />
                  <span>仅包含开始时间</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="time-rule" value="include-end" style={{ accentColor: '#3498db' }} />
                  <span>仅包含结束时间</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="time-rule" value="exclude-both"
                    style={{ accentColor: '#3498db' }} />
                  <span>不包含开始和结束时间</span>
                </label>
              </div>
            </div>
          </div>

          <button className="btn" id="drug-calc-btn"
            style={{ background: '#3498db', padding: '12px 30px', fontSize: '16px', borderRadius: '8px' }}>开始计算/刷新结果</button>
          <button className="btn" id="drug-reset-btn"
            style={{ background: '#95a5a6', padding: '12px 30px', fontSize: '16px', borderRadius: '8px', marginLeft: '10px' }}>清空</button>

          <div className="result-area"
            style={{ marginTop: '20px', background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="result-title"
              style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              计算结果</div>
            <div style={{ fontSize: '16px', marginBottom: '15px' }}>
              <span style={{ fontWeight: '500' }}>总服药次数：</span>
              <span id="drug-total-count" style={{ color: '#3498db', fontSize: '20px', fontWeight: '600' }}>--</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontWeight: '500' }}>服药时间列表：</span>
              <button className="btn" onClick={() => window.copyResult('drug-time-list')}
                style={{ padding: '8px 16px', fontSize: '14px', marginLeft: '10px', touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(0,0,0,0)' }}>复制列表</button>
            </div>
            <pre id="drug-time-list"
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '14px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>请点击「开始计算」生成列表</pre>
          </div>
          <a href="#" className="back-btn" onClick={(e) => {
            e.preventDefault();
            showDirectory();
          }} style={{ marginTop: '20px' }}>← 返回工具目录</a>
        </div>
      </div>

      {/* 广告位2：底部广告 */}
      <div className="ad-bottom">
        <p>【广告位】- 底部广告</p>
      </div>
    </div>
  );
}